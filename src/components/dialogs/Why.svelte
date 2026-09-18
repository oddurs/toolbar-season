<script>
  import Dialog from "../Dialog.svelte";
  import { I } from "../../lib/icons.js";
  let { dlg, close } = $props();
</script>

<Dialog {dlg} {close} title="Why are there so many toolbars?" icon={I.info} w={430}>
  <div style="line-height:1.5">
    In 2005, toolbar companies paid software makers for every install. So free software came with a toolbar, pre-checked, on the fourth screen of the installer. The toolbars made money by changing your search engine and your home page, showing ads, and tracking where you went online.<br /><br />
    Try it: close some (the <b>×</b> at the right of each bar), drag them around by their grips, run <b>Tools › SpyScrub SE Scan</b>, or untick them in <b>Tools › Manage Add-ons</b>. Then wait and see how many come back.
  </div>
  <div class="btns"><button class="xpbtn def" onclick={() => close("ok")}>Close</button></div>
</Dialog>
