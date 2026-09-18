<script>
  import { closeMenu } from "../lib/actions.js";
  import Menu from "./Menu.svelte";

  let { items, x, y } = $props();
  let el = $state();
  let pos = $state({ left: -9999, top: 0 });
  let sub = $state(null); // { i, x, y, items }

  const list = $derived(typeof items === "function" ? items() : items);

  // Keep the menu on screen.
  $effect(() => {
    const r = el.getBoundingClientRect();
    pos = { left: Math.max(0, Math.min(x, innerWidth - r.width - 2)), top: Math.max(0, Math.min(y, innerHeight - r.height - 2)) };
  });

  function enter(it, i, e) {
    if (!it.items) return (sub = null);
    const r = e.currentTarget.getBoundingClientRect();
    sub = { i, x: r.right - 2, y: r.top - 3, items: it.items };
  }
  function choose(it, e) {
    e.stopPropagation();
    if (it.items || it.dis) return;
    closeMenu();
    it.fn?.(e);
  }
</script>

<div class="menu" role="menu" bind:this={el} style:left="{pos.left}px" style:top="{pos.top}px">
  {#each list as it, i}
    {#if it === "-"}
      <hr />
    {:else}
      <div
        class="it"
        class:dis={it.dis}
        class:spons={it.spons}
        class:hot={sub?.i === i}
        role="menuitem"
        tabindex="-1"
        onmouseenter={e => enter(it, i, e)}
        onclick={e => choose(it, e)}
        onkeydown={e => e.key === "Enter" && choose(it, e)}
      >
        {#if it.check}<span class="chk">✓</span>{/if}{it.label}
        {#if it.key}<span class="key">{it.key}</span>{/if}
        {#if it.items}<span class="sub">▶</span>{/if}
      </div>
    {/if}
  {/each}
</div>

{#if sub}
  {#key sub.i}<Menu items={sub.items} x={sub.x} y={sub.y} />{/key}
{/if}
