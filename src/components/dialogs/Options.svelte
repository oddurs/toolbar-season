<script>
  import Dialog from "../Dialog.svelte";
  import { I } from "../../lib/icons.js";
  import { ui } from "../../lib/state.svelte.js";
  import { setHome } from "../../lib/actions.js";

  let { dlg, close } = $props();
  let home = $state(ui.home);
  const tabs = ["General", "Security", "Privacy", "Content", "Connections", "Programs", "Advanced"];
</script>

<Dialog {dlg} {close} title="Internet Options" icon={I.globe} w={400} help>
  <div class="tabs">{#each tabs as t, i}<span class:on={i === 0}>{t}</span>{/each}</div>
  <div class="fieldset">
    <b>Home page</b>
    <div class="muted">You can change which page to use for your home page.</div>
    <label>Address: <input class="box" id="opt-home" style="width:280px" bind:value={home} /></label>
    <div class="btns" style="justify-content:flex-start">
      <button class="xpbtn" onclick={() => (home = ui.url)}>Use Current</button>
      <button class="xpbtn" onclick={() => (home = "about:blank")}>Use Blank</button>
    </div>
  </div>
  <div class="fieldset"><b>Temporary Internet files</b><div class="muted">Pages you view on the Internet are stored in a special folder for quick viewing later. (4,211 MB)</div></div>
  <div class="btns">
    <button class="xpbtn def" onclick={() => { setHome(home); close("ok"); }}>OK</button>
    <button class="xpbtn" onclick={() => close("cancel")}>Cancel</button>
    <button class="xpbtn" onclick={() => setHome(home)}>Apply</button>
  </div>
</Dialog>
