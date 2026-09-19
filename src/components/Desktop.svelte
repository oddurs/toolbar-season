<script>
  // The desktop behind IE: shortcuts every toolbar left behind, and IE
  // itself once you've closed it. Click to select, double-click to open.
  import { ui, isInstalled } from "../lib/state.svelte.js";
  import { ALL_BARS } from "../lib/toolbars.js";
  import { openIE, openPop, pick } from "../lib/actions.js";
  import { I } from "../lib/icons.js";

  let selected = $state(null);
  const icons = $derived([
    ...(ui.ieOnDesktop ? [{ id: "ie", label: "Internet Explorer", svg: I.ie, open: openIE }] : []),
    ...ALL_BARS.filter(b => b.shortcut && isInstalled(b.id)).map(b => ({
      id: b.id, label: b.shortcut, svg: b.id === "speeddr" ? I.shieldX : b.id === "zingo" ? I.dice : I.globe,
      open: () => openPop(pick(["winner", "screensaver", "scare"])),
    })),
  ]);
  const onkeydown = (ic, e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), ic.open());
</script>

<svelte:window onpointerdown={e => { if (!e.target.closest(".desk-icon")) selected = null; }} />

<ul class="desktop" aria-label="Desktop">
  {#each icons as ic (ic.id)}
    <li>
      <button
        class="desk-icon"
        class:sel={selected === ic.id}
        onclick={() => (selected = ic.id)}
        ondblclick={ic.open}
        onkeydown={e => onkeydown(ic, e)}
        aria-label="{ic.label} (double-click to open)"
      >{@html ic.svg.replace("viewBox", 'class="desk-svg" viewBox')}<span>{ic.label}</span></button>
    </li>
  {/each}
</ul>
