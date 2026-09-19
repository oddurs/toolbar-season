<script>
  // Manage Add-ons, new in XP SP2. Disabling works. For a while.
  import Dialog from "../Dialog.svelte";
  import { I } from "../../lib/icons.js";
  import { isOn, isInstalled } from "../../lib/state.svelte.js";
  import { ALL_BARS } from "../../lib/toolbars.js";
  import { openBar, closeBar, openDialog } from "../../lib/actions.js";

  let { dlg, close } = $props();
  const rows = $derived(ALL_BARS.filter(b => !b.builtin && isInstalled(b.id)));
</script>

<Dialog {dlg} {close} title="Manage Add-ons" icon={I.ie} w={620} help>
  <div class="muted">View and manage add-ons that are installed on your computer. Disabling add-ons might prevent some Web pages from working.</div>
  <div class="addons">
    <table>
      <thead><tr><th>Name</th><th>Publisher</th><th>Status</th><th>How you got it</th></tr></thead>
      <tbody>
        {#each rows as b (b.id)}
          <tr>
            <td><label><input type="checkbox" checked={isOn(b.id)} onchange={e => (e.currentTarget.checked ? openBar(b.id) : closeBar(b.id))} /> {b.name}</label></td>
            <td>{b.publisher || "Bundle Partners Distribution LLC"}</td>
            <td>{#if isOn(b.id)}Enabled{:else}<i>Disabled</i>{/if}</td>
            <td class="muted">{b.bundled}</td>
          </tr>
        {:else}
          <tr><td colspan="4" class="muted">No add-ons are installed. Somehow.</td></tr>
        {/each}
      </tbody>
    </table>
  </div>
  <div class="btns">
    <span class="muted addons-hint">Disabled add-ons turn themselves back on. To remove one for good, uninstall it.</span>
    <button class="xpbtn" onclick={() => openDialog("arp")}>Uninstall...</button>
    <button class="xpbtn def" onclick={() => close("ok")}>OK</button>
  </div>
</Dialog>
