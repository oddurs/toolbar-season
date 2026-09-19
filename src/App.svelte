<script>
  import { onMount } from "svelte";
  import { ui, toolbarCount, bars, isOn, adware } from "./lib/state.svelte.js";
  import { start, act, openMenu, closeMenu, closeIE, wakeAudio, checkSqueeze, trackClean, checkCollapse, setMuted, escapeDialog, openDialog, ADWARE_TOTAL } from "./lib/actions.js";
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
  import Desktop from "./components/Desktop.svelte";
  import Wallpaper from "./components/Wallpaper.svelte";

  let winEl = $state(), pageEl = $state();
  const collapsed = $derived(ui.ended === "collapse" && adware().length >= ADWARE_TOTAL);
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
  $effect(() => { adware().length; ui.connected; trackClean(); checkCollapse(); });

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

  // Touch screens have no right-click: a long press opens the same menu.
  let press;
  function onPagePointerDown(e) {
    if (e.pointerType !== "touch" || e.target.closest("input, textarea")) return;
    const x = e.clientX, y = e.clientY;
    const cancel = () => { clearTimeout(press); removeEventListener("pointerup", cancel); removeEventListener("pointermove", moved); };
    const moved = ev => Math.hypot(ev.clientX - x, ev.clientY - y) > 10 && cancel();
    press = setTimeout(() => { cancel(); closeMenu(); openMenu(x, y, pageMenu()); }, 550);
    addEventListener("pointerup", cancel);
    addEventListener("pointermove", moved);
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
  // Move and resize the window. The first drag pins it where it is on screen.
  const floating = $derived(ui.rect && !ui.max && !ui.min && !ui.full);
  function pin() {
    if (ui.rect) return;
    const r = winEl.getBoundingClientRect();
    ui.rect = { x: r.left, y: r.top, w: r.width, h: r.height };
  }
  // On a phone the window fills the screen and stays put.
  const phone = () => innerWidth <= 640;
  function dragWin(e) {
    if (phone() || e.button !== 0 || e.target.closest("button") || ui.max || ui.min || ui.full) return;
    e.preventDefault();
    pin();
    const sx = e.clientX - ui.rect.x, sy = e.clientY - ui.rect.y;
    track(ev => {
      ui.rect.x = Math.max(80 - ui.rect.w, Math.min(innerWidth - 80, ev.clientX - sx));
      ui.rect.y = Math.max(0, Math.min(innerHeight - 30, ev.clientY - sy));
    });
  }
  function resize(e, edge) {
    if (phone() || e.button !== 0 || ui.max || ui.min || ui.full) return;
    e.preventDefault();
    e.stopPropagation();
    pin();
    const start = { ...ui.rect }, sx = e.clientX, sy = e.clientY, MIN_W = 420, MIN_H = 320;
    track(ev => {
      const dx = ev.clientX - sx, dy = ev.clientY - sy, r = { ...start };
      if (edge.includes("e")) r.w = Math.max(MIN_W, start.w + dx);
      if (edge.includes("s")) r.h = Math.max(MIN_H, start.h + dy);
      if (edge.includes("w")) { r.w = Math.max(MIN_W, start.w - dx); r.x = start.x + start.w - r.w; }
      if (edge.includes("n")) { r.h = Math.max(MIN_H, start.h - dy); r.y = Math.max(0, start.y + start.h - r.h); }
      ui.rect = r;
    });
  }
  function track(move) {
    const up = () => { removeEventListener("pointermove", move); removeEventListener("pointerup", up); document.body.classList.remove("dragging-win"); };
    document.body.classList.add("dragging-win");
    addEventListener("pointermove", move);
    addEventListener("pointerup", up);
  }
  const EDGES = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];

  // Dismiss menus on pointer-down, before the click that may open another one.
  function onpointerdown(e) {
    wakeAudio();
    if (ui.menu && !e.target.closest(".menu, .mi")) closeMenu();
  }
</script>

<svelte:window {onkeydown} {onpointerdown} />

<Wallpaper />
<Desktop />

<main
  class="win"
  aria-label="Internet Explorer"
  class:max={ui.max || ui.full}
  class:min={ui.min}
  class:floating
  class:collapsed
  class:loading={ui.loading}
  hidden={ui.crashed || ui.closed}
  bind:this={winEl}
  style:left={floating ? `${ui.rect.x}px` : null}
  style:top={floating ? `${ui.rect.y}px` : null}
  style:width={floating ? `${ui.rect.w}px` : null}
  style:height={floating ? `${ui.rect.h}px` : null}
>
  {#if !ui.max && !ui.min && !ui.full}
    {#each EDGES as edge}<div class="rz rz-{edge}" aria-hidden="true" onpointerdown={e => resize(e, edge)}></div>{/each}
  {/if}
  {#if !ui.full}
    <div class="titlebar" role="presentation" onpointerdown={dragWin} ondblclick={() => (ui.max = !ui.max)}>
      {@html I.ie.replace("viewBox", 'class="ie-ico" viewBox')}
      <span class="ttl">{ui.title}</span>
      <button class="cap" aria-label="Minimize" onclick={() => (ui.min = !ui.min)}>{@html I.minim}</button>
      <button class="cap" aria-label="Maximize" onclick={() => (ui.max = !ui.max)}>{@html I.maxim}</button>
      <button class="cap close" aria-label="Close" onclick={closeIE}>{@html I.close}</button>
    </div>
  {/if}

  <Rebar />

  <div class="mid" class:gone={collapsed}>
    <Sidebar />
    <div class="pane">
      <InfoBar />
      <div class="page" {oncontextmenu} onpointerdown={onPagePointerDown} role="presentation" class:hl={ui.highlight} style:font-size="{ui.textSize}px" bind:this={pageEl}>
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
</main>

<footer>
<button class="about-link" onclick={() => openDialog("why")}>What is this?</button>
<button class="sound-toggle" onclick={() => setMuted(!ui.muted)} aria-pressed={!ui.muted}>{@html ui.muted ? I.muted : I.speaker} Sound: {ui.muted ? "Off" : "On"}</button>
<div class="era">October 2005 · Windows XP SP2 · Internet Explorer 6.0 · {count ? `${count} toolbar${count === 1 ? "" : "s"} and counting` : "0 toolbars (for now)"}</div>
</footer>

{#if ui.menu}{#key ui.menu}<Menu items={ui.menu.items} x={ui.menu.x} y={ui.menu.y} onswitch={ui.menu.owner ? switchMenu : null} />{/key}{/if}
<Balloon />
<DialogHost />
<Buddy />
