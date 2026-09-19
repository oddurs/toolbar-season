<script>
  // The desktop behind IE. Once you've closed IE, its icon is here to reopen
  // it: click to select, double-click (or Enter) to open.
  import { ui } from "../lib/state.svelte.js";
  import { openIE, openMenu, closeMenu, desktopMenu } from "../lib/actions.js";
  import { I } from "../lib/icons.js";

  let selected = $state(false);
  const onkeydown = e => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), openIE());
</script>

<svelte:window
  onpointerdown={e => { if (!e.target.closest(".desk-icon")) selected = false; }}
  oncontextmenu={e => {
    // Right-clicking bare desktop (not the browser, a dialog or the buddy).
    if (e.target.closest(".win, .dlg, .menu, .buddy, .balloon, footer, .autocomplete, .desk-icon")) return;
    e.preventDefault();
    closeMenu();
    openMenu(e.clientX, e.clientY, desktopMenu());
  }}
/>

{#if ui.ieOnDesktop}
  <div class="desktop">
    <button class="desk-icon" class:sel={selected} onclick={() => (selected = true)} ondblclick={openIE} {onkeydown} aria-label="Internet Explorer (double-click to open)">
      {@html I.ie.replace("viewBox", 'class="desk-svg" viewBox')}<span>Internet Explorer</span>
    </button>
  </div>
{/if}
