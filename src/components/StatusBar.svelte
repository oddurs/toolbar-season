<script>
  import { ui, adware } from "../lib/state.svelte.js";
  import { I } from "../lib/icons.js";
  import { openDialog } from "../lib/actions.js";
  const secure = $derived(ui.url.startsWith("https:"));

  const clock = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
</script>

{#if ui.showStatus}
  <div class="status">
    {#if ui.pageErrors && !ui.loading}
      <button class="st-msg st-err" title="Double-click to see the errors" ondblclick={() => openDialog("scripterror")}>{@html I.warn}<span>{ui.statusMsg}</span></button>
    {:else}
      <div class="st-msg">{@html I.page}<span>{ui.statusMsg}</span></div>
    {/if}
    {#if ui.cleanSince}
      <div class="st-clean" title="Best: {clock(ui.bestClean)}">{@html I.shield}Toolbar-free for <b>{clock(ui.cleanFor)}</b></div>
    {:else}
      <div class="st-prog"><i style:width="{Math.round(Math.min(ui.progress, 100) / (100 / 12)) * 9}px"></i></div>
    {/if}
    <div class="st-view" title="{adware().length} third-party toolbars installed · Best toolbar-free run: {clock(ui.bestClean)}">
      Page:&nbsp;<b class:bad={ui.viewPct < 25}>{ui.viewPct}%</b>&nbsp;of window
    </div>
    {#if secure}<div class="st-lock" title="SSL Secured (128 Bit)">{@html I.lock}</div>{/if}
    <div class="st-zone">{@html I.globe}{ui.connected ? "Internet" : "Offline"}</div>
  </div>
{/if}
