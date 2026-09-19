<script>
  // "Problems with this Web page might prevent it from being displayed properly."
  import Dialog from "../Dialog.svelte";
  import { I } from "../../lib/icons.js";
  import { ui } from "../../lib/state.svelte.js";
  let { dlg, close } = $props();
  let details = $state(true);
  let i = $state(0);
  const err = $derived(ui.errors[i]);
</script>

<Dialog {dlg} {close} title="Internet Explorer" w={420}>
  <div class="row">{@html I.warn.replace("viewBox", 'class="bigico" viewBox')}<div style="padding-top:2px">Problems with this Web page might prevent it from being displayed properly or functioning properly. In the future, you can display this message by double-clicking the warning icon displayed in the status bar.</div></div>
  <label class="chk"><input type="checkbox" checked /> Always show this message when a page contains errors.</label>
  {#if details && err}
    <div class="scripterr">
      <div>Line: {err.line}</div><div>Char: {err.char}</div><div>Error: {err.error}</div><div>Code: 0</div><div>URL: {err.url}</div>
    </div>
  {/if}
  <div class="btns">
    <button class="xpbtn" onclick={() => (details = !details)}>{details ? "Hide Details <<" : "Show Details >>"}</button>
    <button class="xpbtn" disabled={i === 0} onclick={() => i--}>Previous</button>
    <button class="xpbtn" disabled={i >= ui.errors.length - 1} onclick={() => i++}>Next</button>
    <button class="xpbtn def" onclick={() => close("ok")}>OK</button>
  </div>
</Dialog>
