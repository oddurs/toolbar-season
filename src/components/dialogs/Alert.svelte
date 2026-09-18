<script>
  import Dialog from "../Dialog.svelte";
  import { I } from "../../lib/icons.js";
  let { dlg, close, msg, title, icon = "info" } = $props();
</script>

<Dialog {dlg} {close} {title} w={340}>
  <div class="row">{@html I[icon].replace("viewBox", 'class="bigico" viewBox')}<div style="padding-top:6px">{@html msg}</div></div>
  <div class="btns"><button class="xpbtn def" onclick={() => close("ok")}>OK</button></div>
</Dialog>
