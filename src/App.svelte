<script>
  import { onMount } from "svelte";
  import { ui, toolbarCount, bars, isOn, adware } from "./lib/state.svelte.js";
  import { start, act, closeMenu, crash, wakeAudio, checkSqueeze, trackClean } from "./lib/actions.js";
  import { I } from "./lib/icons.js";
  import Rebar from "./components/Rebar.svelte";
  import Band from "./components/Band.svelte";
  import Sidebar from "./components/Sidebar.svelte";
  import InfoBar from "./components/InfoBar.svelte";
  import StatusBar from "./components/StatusBar.svelte";
  import Menu from "./components/Menu.svelte";
  import DialogHost from "./components/DialogHost.svelte";
  import Buddy from "./components/Buddy.svelte";

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

  function onkeydown(e) {
    if (e.key === "F11") { e.preventDefault(); act.full(); }
    if (e.key === "F5") { e.preventDefault(); act.refresh(); }
    if (e.key === "Escape") { closeMenu(); act.stop(); }
  }
  function onclick(e) {
    if (ui.menu && !e.target.closest(".menu, .mi")) closeMenu();
  }
</script>

<svelte:window {onkeydown} {onclick} onpointerdowncapture={wakeAudio} />

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
      <div class="page" class:hl={ui.highlight} style:font-size="{ui.textSize}px" bind:this={pageEl}>
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

<div class="era">October 2005 · Windows XP SP2 · Internet Explorer 6.0 · {count ? `${count} toolbar${count === 1 ? "" : "s"} and counting` : "0 toolbars (for now)"}</div>

{#if ui.menu}{#key ui.menu}<Menu items={ui.menu.items} x={ui.menu.x} y={ui.menu.y} />{/key}{/if}
<DialogHost />
<Buddy />
