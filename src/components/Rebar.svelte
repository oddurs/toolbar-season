<script>
  import { ui, bars, isOn } from "../lib/state.svelte.js";
  import { openMenu, closeMenu, toolbarMenu, moveBar } from "../lib/actions.js";
  import { I } from "../lib/icons.js";
  import Band from "./Band.svelte";

  let box = $state();
  let dragging = $state(null);

  const top = $derived(bars().filter(b => isOn(b.id) && !b.place && !(ui.full && b.builtin)));

  // Drag a band by its grip to reorder, like IE's rebar. The menu bar stays first.
  function onpointerdown(e) {
    const grip = e.target.closest(".grip");
    if (!grip) return;
    const id = grip.parentElement.dataset.bar;
    if (id === "menu") return;
    e.preventDefault();
    dragging = id;
    const move = ev => {
      const bands = [...box.querySelectorAll(":scope > .band")].filter(b => b.dataset.bar !== id);
      const after = bands.find(b => ev.clientY < b.getBoundingClientRect().top + b.offsetHeight / 2);
      const target = after?.dataset.bar === "menu" ? bands[1]?.dataset.bar : after?.dataset.bar;
      moveBar(id, target);
    };
    const up = () => { removeEventListener("pointermove", move); removeEventListener("pointerup", up); dragging = null; };
    addEventListener("pointermove", move);
    addEventListener("pointerup", up);
  }

  function oncontextmenu(e) {
    e.preventDefault();
    closeMenu();
    openMenu(e.clientX, e.clientY, toolbarMenu());
  }
</script>

<div class="rebar" bind:this={box} {onpointerdown} {oncontextmenu} role="presentation">
  {#each top as bar (bar.id)}
    <Band {bar} dragging={dragging === bar.id} />
  {/each}
  {#if !ui.full}
    <div class="throbber" aria-hidden="true">{@html I.flag}</div>
  {/if}
</div>
