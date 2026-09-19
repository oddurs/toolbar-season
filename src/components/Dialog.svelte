<script>
  // An XP window frame for dialogs and pop-ups. Draggable by its title bar.
  import { onMount } from "svelte";
  import { raise } from "../lib/actions.js";
  import { I } from "../lib/icons.js";

  let { dlg, close, title, icon = I.ie, w = 360, help = false, cls = "", children } = $props();
  let el = $state();

  onMount(() => {
    const before = document.activeElement;
    const r = el.getBoundingClientRect();
    dlg.x = Math.max(4, Math.min(innerWidth - r.width - 4, dlg.x ?? (innerWidth - r.width) / 2));
    dlg.y = Math.max(4, Math.min(innerHeight - r.height - 4, dlg.y ?? (innerHeight - r.height) / 2.4));
    el.querySelector(".btns .def")?.focus();
    // Hand focus back to whatever had it, if it's still on the page.
    return () => { if (before?.isConnected && !document.querySelector(".dlg:focus-within")) before.focus?.({ preventScroll: true }); };
  });

  function drag(e) {
    if (e.target.closest("button")) return;
    const sx = e.clientX - dlg.x, sy = e.clientY - dlg.y;
    const move = ev => { dlg.x = ev.clientX - sx; dlg.y = Math.max(0, ev.clientY - sy); };
    const up = () => { removeEventListener("pointermove", move); removeEventListener("pointerup", up); };
    addEventListener("pointermove", move);
    addEventListener("pointerup", up);
  }
</script>

<div
  class="dlg {cls}"
  role="dialog"
  aria-label={title}
  tabindex="-1"
  bind:this={el}
  style:width="{w}px"
  style:left="{dlg.x ?? -9999}px"
  style:top="{dlg.y ?? 0}px"
  style:z-index={dlg.z}
  onpointerdown={() => raise(dlg.id)}
>
  <div class="titlebar" role="presentation" onpointerdown={drag}>
    {@html icon.replace("viewBox", 'class="ie-ico" viewBox')}
    <span class="ttl">{title}</span>
    {#if help}<button class="cap" aria-label="Help">{@html I.help}</button>{/if}
    <button class="cap close" aria-label="Close" onclick={() => close("x")}>{@html I.close}</button>
  </div>
  <div class="dlg-b">{@render children()}</div>
</div>
