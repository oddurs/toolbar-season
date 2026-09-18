<script>
  import Dialog from "../Dialog.svelte";
  import { I } from "../../lib/icons.js";
  let { dlg, close, module } = $props();
</script>

<Dialog {dlg} {close} title="Internet Explorer" w={440}>
  <div class="crash-top"><b>Internet Explorer has encountered a problem and needs to close. We are sorry for the inconvenience.</b>{@html I.err.replace("viewBox", 'class="bigico" viewBox')}</div>
  <div>If you were in the middle of something, the information you were working on might be lost.</div>
  <div class="fieldset"><b>Please tell Microsoft about this problem.</b><div class="muted">Faulting module: {module}bar.dll, version 2.1.0.44</div></div>
  <div class="btns"><button class="xpbtn def" onclick={() => close("send")}>Send Error Report</button><button class="xpbtn" onclick={() => close("nosend")}>Don't Send</button></div>
</Dialog>
