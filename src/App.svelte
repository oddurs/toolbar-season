<script>
  import { onMount } from "svelte";
  import { ui, toolbarCount, bars, isOn, adware } from "./lib/state.svelte.js";
  import { start, act, openMenu, closeMenu, crash, wakeAudio, checkSqueeze, trackClean, setMuted, escapeDialog } from "./lib/actions.js";
  import { pageMenu } from "./lib/pagemenu.js";
  import { MENUS } from "./lib/menus.js";
  import { I } from "./lib/icons.js";
  import Rebar from "./components/Rebar.svelte";
  import Band from "./components/Band.svelte";
  import Sidebar from "./components/Sidebar.svelte";
  import InfoBar from "./components/InfoBar.svelte";
  import StatusBar from "./components/StatusBar.svelte";
  import Menu from "./components/Menu.svelte";
  import DialogHost from "./components/DialogHost.svelte";
  import Buddy from "./components/Buddy.svelte";
  import Balloon from "./components/Balloon.svelte";

  let winEl = $state(), pageEl = $state();
  const bottomBars = $derived(bars().filter(b => b.place === "bottom" && isOn(b.id)));
  const count = $derived(toolbarCount());

  // How much of the window is actually web page.
  function measure() {
    if (!winEl || !pageEl) return;
    const w = winEl.getBoundingClientRect(), p = pageEl.getBoundingClientRect();
    ui.viewPct = Math.max(0, Math.round((p.width * p.height) / (w.width * w.height) * 100));
  }

  onMount(() => {
    const ro = new ResizeObserver(measure);
    ro.observe(pageEl);
    ro.observe(winEl);
    start();
    return () => ro.disconnect();
  });

  $effect(() => document.body.classList.toggle("sparkle", ui.sparkle));
  $effect(() => { ui.viewPct; checkSqueeze(); });
  $effect(() => { adware().length; ui.connected; trackClean(); });

  // Alt+F, Alt+E, Alt+V, Alt+A, Alt+T, Alt+H open the menus, as in IE.
  const MNEMONIC = { KeyF: "File", KeyE: "Edit", KeyV: "View", KeyA: "Favorites", KeyT: "Tools", KeyH: "Help" };
  function openNamed(name) {
    const btn = document.querySelector(`.mi[data-menu="${name}"]`);
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    openMenu(r.left, r.bottom, MENUS[name](), name);
  }
  function menuKey(e) {
    const name = e.altKey && !e.ctrlKey && !e.metaKey && MNEMONIC[e.code];
    if (!name) return false;
    e.preventDefault();
    openNamed(name);
    return true;
  }
  // Left/Right at the top level walks across the menu bar.
  function switchMenu(d) {
    const names = Object.keys(MENUS), at = names.indexOf(ui.menu?.owner);
    if (at >= 0) openNamed(names[(at + d + names.length) % names.length]);
  }

  function oncontextmenu(e) {
    if (e.target.closest("input, textarea")) return;
    e.preventDefault();
    closeMenu();
    openMenu(e.clientX, e.clientY, pageMenu());
  }

  function onkeydown(e) {
    if (menuKey(e)) return;
    if (e.key === "F11") { e.preventDefault(); act.full(); }
    if (e.key === "F5") { e.preventDefault(); act.refresh(); }
    if (e.key === "Escape") {
      if (ui.menu) return closeMenu();
      if (!escapeDialog()) act.stop();
    }
  }
  // Dismiss menus on pointer-down, before the click that may open another one.
  function onpointerdown(e) {
    wakeAudio();
    if (ui.menu && !e.target.closest(".menu, .mi")) closeMenu();
  }
</script>

<svelte:window {onkeydown} {onpointerdown} />

<div class="win" class:max={ui.max || ui.full} class:min={ui.min} class:loading={ui.loading} hidden={ui.crashed} bind:this={winEl}>
  {#if !ui.full}
    <div class="titlebar" role="presentation" ondblclick={() => (ui.max = !ui.max)}>
      {@html I.ie.replace("viewBox", 'class="ie-ico" viewBox')}
      <span class="ttl">{ui.title}</span>
      <button class="cap" aria-label="Minimize" onclick={() => (ui.min = !ui.min)}>{@html I.minim}</button>
      <button class="cap" aria-label="Maximize" onclick={() => (ui.max = !ui.max)}>{@html I.maxim}</button>
      <button class="cap close" aria-label="Close" onclick={crash}>{@html I.close}</button>
    </div>
  {/if}

  <Rebar />

  <div class="mid">
    <Sidebar />
    <div class="pane">
      <InfoBar />
      <div class="page" {oncontextmenu} role="presentation" class:hl={ui.highlight} style:font-size="{ui.textSize}px" bind:this={pageEl}>
        {#if ui.route?.page}
          {#key ui.route.key}
            <ui.route.page {...ui.route.props} />
          {/key}
        {/if}
      </div>
    </div>
  </div>

  <div class="bottombars">
    {#each bottomBars as bar (bar.id)}<Band {bar} />{/each}
  </div>

  <StatusBar />
</div>

<button class="sound-toggle" onclick={() => setMuted(!ui.muted)} aria-pressed={!ui.muted}>{@html ui.muted ? I.muted : I.speaker} Sound: {ui.muted ? "Off" : "On"}</button>
<div class="era">October 2005 · Windows XP SP2 · Internet Explorer 6.0 · {count ? `${count} toolbar${count === 1 ? "" : "s"} and counting` : "0 toolbars (for now)"}</div>

{#if ui.menu}{#key ui.menu}<Menu items={ui.menu.items} x={ui.menu.x} y={ui.menu.y} onswitch={ui.menu.owner ? switchMenu : null} />{/key}{/if}
<Balloon />
<DialogHost />
<Buddy />
