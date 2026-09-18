<script>
  import { ui } from "../lib/state.svelte.js";
  import { act, closeBar, doSearch, openDialog } from "../lib/actions.js";
  import { I, smiley, SMILEY_MOODS } from "../lib/icons.js";
  import MenuBar from "./bars/MenuBar.svelte";
  import StandardButtons from "./bars/StandardButtons.svelte";
  import AddressBar from "./bars/AddressBar.svelte";
  import LinksBar from "./bars/LinksBar.svelte";

  let { bar, dragging = false } = $props();

  const BUILTIN = { menu: MenuBar, std: StandardButtons, addr: AddressBar, links: LinksBar };
  const Builtin = $derived(BUILTIN[bar.component]);
  const items = $derived(bar.items?.(ui) ?? []);
  const queries = $state({});

  const ico = svg => svg.replace("viewBox", 'class="ico" viewBox');
  const run = (it, e) => act[it.act]?.({ arg: it.arg, bar, el: e.currentTarget, e });
  const onkeydown = (engine, e) => e.key === "Enter" && doSearch(engine, queries[engine]);
</script>

<div
  class="band {bar.cls ?? ''}"
  class:fresh={ui.fresh[bar.id]}
  class:dragging
  style:background={ui.skins[bar.id] || null}
  data-bar={bar.id}
  role="toolbar"
  aria-label={bar.name}
>
  <span class="grip" title="Drag to move"></span>
  {#if Builtin}
    <Builtin />
  {:else}
    {#each items as it, i (i)}
      {#if it.t === "logo"}
        <span class="logo" style={it.style}>{@html it.html}</span>
      {:else if it.t === "search"}
        <input class="box" style:width="{it.w}px" placeholder={it.ph} aria-label="{bar.name} search" bind:value={queries[it.engine]} onkeydown={e => onkeydown(it.engine, e)} />
        <button class="tb" onclick={() => doSearch(it.engine, queries[it.engine])}>{@html ico(I.search)}{it.label}</button>
      {:else if it.t === "btn"}
        <button class="tb" onclick={e => run(it, e)}>{#if it.icon}{@html ico(it.icon)}{/if}{@html it.label}</button>
      {:else if it.t === "text"}
        <span class={it.cls}>{@html it.html}</span>
      {:else if it.t === "meter"}
        <span class="meter"><i style:width="{it.pct}%" style:background={it.color}></i></span>
      {:else if it.t === "ticker"}
        <span class="ticker"><span>{it.text}</span></span>
      {:else if it.t === "smileys"}
        {#each SMILEY_MOODS as [, , name], n}
          <button class="smiley-btn" aria-label="{name} smiley" onclick={() => openDialog("smiley", { name, n })}>{@html smiley(n)}</button>
        {/each}
      {:else if it.t === "sep"}
        <span class="sep"></span>
      {/if}
    {/each}
  {/if}
  {#if !bar.builtin}
    <span class="chev">»</span>
    <button class="band-x" title="Close {bar.name}" aria-label="Close {bar.name}" onclick={() => closeBar(bar.id)}>×</button>
  {/if}
</div>
