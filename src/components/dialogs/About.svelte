<script>
  import Dialog from "../Dialog.svelte";
  import { adware } from "../../lib/state.svelte.js";
  let { dlg, close } = $props();
  const n = adware().length;
</script>

<Dialog {dlg} {close} title="About Internet Explorer" w={380}>
  <div class="about-banner">Internet Explorer 6</div>
  <div>Version: 6.0.2900.2180.xpsp_sp2_gdr.050301-1519<br />Cipher Strength: 128-bit<br />Product ID: 55274-640-1011873-23081<br />Update Versions: SP2; {n} toolbars</div>
  <div class="muted">Based on NCSA Mosaic. Distributed under a licensing agreement with Spyglass, Inc.<br />Warning: This computer program is protected by copyright law and by {n} other programs that will not let you uninstall them.</div>
  <div class="btns"><button class="xpbtn def" onclick={() => close("ok")}>OK</button></div>
</Dialog>
