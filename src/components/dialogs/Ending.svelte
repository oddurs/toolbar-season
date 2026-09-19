<script>
  // The two endings, with what happened to you and a line to paste somewhere.
  import Dialog from "../Dialog.svelte";
  import { I } from "../../lib/icons.js";
  import { ui, toolbarCount } from "../../lib/state.svelte.js";

  let { dlg, close, kind } = $props();
  const URL = "oddurs.github.io/toolbar-season";
  const START = 13; // the toolbars that were already there when you dialed in
  const total = toolbarCount(); // as the caption counts them, at the moment it ended
  const clock = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const plural = (n, one, many = one + "s") => `${n} ${n === 1 ? one : many}`;

  const s = $derived(ui.stats);
  const rows = $derived([
    ["Toolbars already installed when you dialed in", START],
    ["Toolbars you agreed to", s.agreed],
    ["Toolbars that installed themselves", s.self],
    ["Toolbars that came back after you removed them", s.returned],
    ["Toolbars you uninstalled for good", s.removed],
    ["Pop-ups that got through", s.ads],
    ["Pop-ups “blocked”", ui.blocked],
    ["Searches sent somewhere else", s.hijacked],
    ["Longest time toolbar-free", clock(ui.bestClean)],
  ]);
  const share = $derived((
    kind === "collapse"
      ? [
          `Toolbar Season (IE6, 2005): I ended up with ${total} toolbars and no web page at all.`,
          s.self && `${plural(s.self, "toolbar")} installed themselves.`,
          s.agreed ? `I clicked Install on ${s.agreed}.` : "I never clicked Install once.",
          URL,
        ]
      : [
          "Toolbar Season (IE6, 2005): I got Internet Explorer down to zero toolbars and kept it clean for a full minute.",
          s.removed && `It took ${plural(s.removed, "uninstall")}.`,
          s.returned && `${plural(s.returned, "toolbar")} came back first.`,
          URL,
        ]
  ).filter(Boolean).join(" "));

  let copied = $state(false);
  let box = $state();
  async function copy() {
    try { await navigator.clipboard.writeText(share); copied = true; }
    catch { box.select(); copied = document.execCommand?.("copy") ?? false; }
  }
</script>

<Dialog {dlg} {close} title={kind === "collapse" ? "Internet Explorer" : "Certificate of Achievement"} icon={kind === "collapse" ? I.ie : I.shield} w={460}>
  {#if kind === "collapse"}
    <div class="row">{@html I.err.replace("viewBox", 'class="bigico" viewBox')}<div>
      <b class="end-h">There is no room left to display this page.</b>
      <p>All {total} toolbars are installed, and the web page is 0% of the window. Internet Explorer is now a toolbar browser.</p>
    </div></div>
  {:else}
    <div class="cert">
      <div class="cert-h">Certificate of Toolbar Removal</div>
      <p>This certifies that</p>
      <div class="cert-name">smithfamily</div>
      <p>kept Internet Explorer free of third-party toolbars for<br /><b>one full minute</b>.</p>
      <div class="cert-foot"><span>October 17, 2005</span><span class="sig">Mod_Steve<br /><small>TechGuyz Forums</small></span></div>
    </div>
  {/if}

  <table class="end-stats"><tbody>
    {#each rows as [label, n]}<tr><td>{label}</td><td>{n}</td></tr>{/each}
  </tbody></table>

  <textarea class="end-share" readonly rows="3" aria-label="Your result" bind:this={box}>{share}</textarea>
  <div class="btns">
    <button class="xpbtn def" onclick={copy}>{copied ? "Copied" : "Copy result"}</button>
    <button class="xpbtn" onclick={() => location.reload()}>Start over</button>
    <button class="xpbtn" onclick={() => close("keep")}>Keep browsing</button>
  </div>
</Dialog>
