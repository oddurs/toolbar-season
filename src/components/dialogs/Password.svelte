<script>
  import Dialog from "../Dialog.svelte";
  import { I } from "../../lib/icons.js";
  let { dlg, close } = $props();
</script>

<Dialog {dlg} {close} title="AutoComplete" icon={I.lock} w={400}>
  <div class="row">{@html I.info.replace("viewBox", 'class="bigico" viewBox')}<div style="padding-top:2px">Do you want Windows to remember this password, so that you don't have to type it again the next time you use this page?</div></div>
  <label class="chk"><input type="checkbox" /> Don't offer to remember any more passwords</label>
  <div class="btns"><button class="xpbtn def" onclick={() => close("yes")}>Yes</button><button class="xpbtn" onclick={() => close("no")}>No</button></div>
</Dialog>
