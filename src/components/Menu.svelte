<script>
  // A Windows menu, with the keyboard behaviour to match: arrows, Enter, Esc,
  // and Left/Right to move between submenus and across the menu bar.
  import { closeMenu } from "../lib/actions.js";
  import Menu from "./Menu.svelte";

  // `from` is the parent item's box, for submenus: they open to its right,
  // or to its left if there's no room, or below it on a screen too narrow for either.
  let { items, x, y, from = null, onleave = null, onswitch = null, focus = true } = $props();
  let el = $state();
  let pos = $state({ left: -9999, top: 0 });
  let sub = $state(null); // { i, x, y, items, keyboard }
  let hot = $state(-1);

  const list = $derived(typeof items === "function" ? items() : items);
  const usable = $derived(list.map((it, i) => (it !== "-" && !it.dis ? i : -1)).filter(i => i >= 0));

  // Keep the menu on screen, and take keyboard focus.
  $effect(() => {
    const r = el.getBoundingClientRect();
    let left = x, top = y;
    if (from && left + r.width > innerWidth) {
      left = from.left - r.width + 2;
      if (left < 0) { left = innerWidth - r.width - 2; top = from.bottom; }
    }
    pos = { left: Math.max(0, Math.min(left, innerWidth - r.width - 2)), top: Math.max(0, Math.min(top, innerHeight - r.height - 2)) };
    if (focus) el.focus({ preventScroll: true });
  });

  function openSub(i, keyboard = false) {
    const it = list[i];
    if (!it?.items) return (sub = null);
    const r = el.querySelector(`[data-i="${i}"]`).getBoundingClientRect();
    sub = { i, x: r.right - 2, y: r.top - 3, items: it.items, keyboard, from: { left: r.left, bottom: r.bottom } };
  }
  function choose(i, e) {
    const it = list[i];
    e?.stopPropagation();
    if (!it || it.dis) return;
    if (it.items) return openSub(i, true);
    closeMenu();
    it.fn?.(e);
  }
  function move(d) {
    if (!usable.length) return;
    const at = usable.indexOf(hot);
    hot = usable[(at + d + usable.length) % usable.length] ?? usable[0];
  }
  function onkeydown(e) {
    const k = e.key;
    if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Enter", " ", "Escape", "Home", "End"].includes(k)) return;
    e.preventDefault();
    e.stopPropagation();
    if (k === "ArrowDown") move(1);
    else if (k === "ArrowUp") move(hot < 0 ? 0 : -1);
    else if (k === "Home") hot = usable[0];
    else if (k === "End") hot = usable.at(-1);
    else if (k === "Enter" || k === " ") hot >= 0 && choose(hot, e);
    else if (k === "ArrowRight") list[hot]?.items ? openSub(hot, true) : onswitch?.(1);
    else if (k === "ArrowLeft") onleave ? onleave() : onswitch?.(-1);
    else if (k === "Escape") onleave ? onleave() : closeMenu();
  }
  function back() { sub = null; el.focus({ preventScroll: true }); }
</script>

<div class="menu" role="menu" tabindex="-1" bind:this={el} {onkeydown} style:left="{pos.left}px" style:top="{pos.top}px">
  {#each list as it, i}
    {#if it === "-"}
      <hr />
    {:else}
      <div
        class="it"
        class:dis={it.dis}
        class:spons={it.spons}
        class:hot={hot === i || sub?.i === i}
        role="menuitem"
        aria-haspopup={it.items ? "menu" : undefined}
        aria-disabled={it.dis || undefined}
        tabindex="-1"
        data-i={i}
        onmouseenter={() => { hot = i; openSub(i); }}
        onclick={e => choose(i, e)}
        onkeydown={() => {}}
      >
        {#if it.check}<span class="chk">✓</span>{/if}{it.label}
        {#if it.key}<span class="key">{it.key}</span>{/if}
        {#if it.items}<span class="sub">▶</span>{/if}
      </div>
    {/if}
  {/each}
</div>

{#if sub}
  {#key sub.i}<Menu items={sub.items} x={sub.x} y={sub.y} from={sub.from} onleave={back} {onswitch} focus={sub.keyboard} />{/key}
{/if}
