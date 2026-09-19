<script>
  import Dialog from "../Dialog.svelte";
  import { I } from "../../lib/icons.js";
  import { ui } from "../../lib/state.svelte.js";
  let { dlg, close } = $props();
  const answer = hide => { ui.hideNonsecure = hide; close(hide ? "no" : "yes"); };
</script>

<Dialog {dlg} {close} title="Security Information" icon={I.lock} w={380}>
  <div class="row">{@html I.warn.replace("viewBox", 'class="bigico" viewBox')}<div style="padding-top:2px">This page contains both secure and nonsecure items.<br /><br />Do you want to display the nonsecure items?</div></div>
  <div class="btns"><button class="xpbtn def" onclick={() => answer(false)}>Yes</button><button class="xpbtn" onclick={() => answer(true)}>No</button><button class="xpbtn">More Info</button></div>
</Dialog>
