<script>
  import { ui } from "../../lib/state.svelte.js";
  import { openMenu, closeMenu } from "../../lib/actions.js";
  import { MENUS } from "../../lib/menus.js";

  const open = (name, el) => { const r = el.getBoundingClientRect(); openMenu(r.left, r.bottom, MENUS[name](), name); };
  const onclick = (name, e) => (ui.menu?.owner === name ? closeMenu() : open(name, e.currentTarget));
  // Once a menu is open, hovering the others switches to them, as in Windows.
  const onmouseenter = (name, e) => ui.menu?.owner && ui.menu.owner !== name && open(name, e.currentTarget);
</script>

{#each Object.keys(MENUS) as name}
  {@const k = name === "Favorites" ? 1 : 0}
  <button class="mi" data-menu={name} class:open={ui.menu?.owner === name} onclick={e => onclick(name, e)} onmouseenter={e => onmouseenter(name, e)}>{name.slice(0, k)}<u>{name[k]}</u>{name.slice(k + 1)}</button>
{/each}
<span class="brand">provided by Dell</span>
