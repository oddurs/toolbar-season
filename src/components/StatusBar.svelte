<script>
  import { ui, adware } from "../lib/state.svelte.js";
  import { I } from "../lib/icons.js";
</script>

{#if ui.showStatus}
  <div class="status">
    <div class="st-msg">{@html I.page}<span>{ui.statusMsg}</span></div>
    <div class="st-prog"><i style:width="{Math.min(ui.progress, 100)}%"></i></div>
    <div class="st-view" title="{adware().length} third-party toolbars installed">
      Page:&nbsp;<b class:bad={ui.viewPct < 25}>{ui.viewPct}%</b>&nbsp;of window
    </div>
    <div class="st-zone">{@html I.globe}Internet</div>
  </div>
{/if}
