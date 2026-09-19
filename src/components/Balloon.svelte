<script>
  // XP balloon tip, pointing at the status bar's "Page: N% of window". Shown once.
  import { ui } from "../lib/state.svelte.js";
  import { dismissTip } from "../lib/actions.js";
  import { I } from "../lib/icons.js";

  let pos = $state(null);
  $effect(() => {
    if (!ui.tip) return;
    // Follow the window when it moves or resizes.
    ui.rect && [ui.rect.x, ui.rect.y, ui.rect.w, ui.rect.h];
    ui.max; ui.min;
    const place = () => {
      const r = document.querySelector(".st-view")?.getBoundingClientRect();
      pos = r ? { right: Math.max(8, innerWidth - r.right - 10), bottom: innerHeight - r.top + 12 } : null;
    };
    place();
    addEventListener("resize", place);
    const t = setTimeout(dismissTip, 25000);
    return () => { removeEventListener("resize", place); clearTimeout(t); };
  });
</script>

{#if ui.tip && pos && !ui.crashed}
  <div class="balloon" role="status" style:right="{pos.right}px" style:bottom="{pos.bottom}px">
    <div class="balloon-h">{@html I.info}<b>Your web page is being squeezed</b><button class="band-x" aria-label="Close" onclick={dismissTip}>×</button></div>
    <p>Only <b>{ui.viewPct}%</b> of this window is web page. The rest is toolbars.</p>
    <p>Close one with its <b>×</b>, drag them by their grips, or get rid of them for good in <b>Tools › Add or Remove Programs</b>.</p>
  </div>
{/if}
