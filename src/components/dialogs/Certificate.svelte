<script>
  import Dialog from "../Dialog.svelte";
  import { I } from "../../lib/icons.js";
  let { dlg, close, removed = 0 } = $props();
</script>

<Dialog {dlg} {close} title="Certificate of Achievement" icon={I.shield} w={440}>
  <div class="cert">
    <div class="cert-h">Certificate of Toolbar Removal</div>
    <p>This certifies that</p>
    <div class="cert-name">smithfamily</div>
    <p>kept Internet Explorer free of third-party toolbars for<br /><b>one full minute</b>{removed ? `, and uninstalled ${removed} of them for good` : ""}.</p>
    <div class="cert-foot"><span>October 17, 2005</span><span class="sig">Mod_Steve<br /><small>TechGuyz Forums</small></span></div>
  </div>
  <div class="btns"><button class="xpbtn def" onclick={() => close("ok")}>Close</button></div>
</Dialog>
