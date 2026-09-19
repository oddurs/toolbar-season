<script>
  // Add or Remove Programs, as it looked in XP SP2.
  import Dialog from "../Dialog.svelte";
  import { I } from "../../lib/icons.js";
  import { ui, isInstalled } from "../../lib/state.svelte.js";
  import { ALL_BARS } from "../../lib/toolbars.js";
  import { openDialog } from "../../lib/actions.js";

  let { dlg, close } = $props();
  let selected = $state(null);

  // BuddyBonz came bundled too: he's listed whenever he's around, toolbar or not.
  const BUDDY = { id: "bonzibar", name: "BuddyBonz", respawn: 20 };
  const rows = $derived([
    ...ALL_BARS.filter(b => !b.builtin && isInstalled(b.id) && b.id !== "bonzibar"),
    ...(ui.buddy || isInstalled("bonzibar") ? [BUDDY] : []),
  ]);
  // Stable fake numbers per program.
  const hash = s => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  const size = b => (b.id === "gooble" ? 2.1 : 4 + (hash(b.id) % 380) / 10).toFixed(2);
  const used = b => (b.id === "gooble" ? "frequently" : ["rarely", "rarely", "occasionally", "never (it uses itself)"][hash(b.id) % 4]);
</script>

<Dialog {dlg} {close} title="Add or Remove Programs" icon={I.cd} w={620}>
  <div class="arp">
    <nav>
      <span class="on">{@html I.cd}<b>Change or Remove Programs</b></span>
      <span>{@html I.down}Add New Programs</span>
      <span>{@html I.globe}Add/Remove Windows Components</span>
    </nav>
    <div class="arp-main">
      <div class="arp-top">Currently installed programs: <span class="muted">Sort by: Name ▾</span></div>
      <div class="arp-list">
        {#each rows as b (b.id)}
          <div class="arp-row" class:sel={selected === b.id} role="button" tabindex="0" onclick={() => (selected = b.id)} onkeydown={e => e.key === "Enter" && (selected = b.id)}>
            <div class="arp-line">{@html I.cd}<b>{b.name}</b><span class="arp-size">Size <b>{size(b)}MB</b></span></div>
            {#if selected === b.id}
              <div class="arp-detail">
                <span>Used <b>{used(b)}</b></span><span>Last Used On <b>10/17/2005</b></span>
                <span class="muted">To remove this program from your computer, click Remove.</span>
                <button class="xpbtn" onclick={e => { e.stopPropagation(); openDialog("uninstall", { bar: b }); }}>Remove</button>
              </div>
            {/if}
          </div>
        {:else}
          <div class="arp-empty">No toolbars are installed. Take a screenshot. It won't last.</div>
        {/each}
      </div>
    </div>
  </div>
  <div class="btns"><button class="xpbtn" onclick={() => close("ok")}>Close</button></div>
</Dialog>
