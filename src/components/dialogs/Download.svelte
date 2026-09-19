<script>
  // File Download (XP SP2): security warning, a download at 56k speed, then
  // the unverified-publisher warning. Time runs 40x faster than 2005 did.
  import { onDestroy } from "svelte";
  import Dialog from "../Dialog.svelte";
  import { I } from "../../lib/icons.js";
  import { TEST } from "../../lib/state.svelte.js";
  import { installBar, rand } from "../../lib/actions.js";

  let { dlg, close, file, bar } = $props();
  const kb = 1800 + Math.floor(rand(0, 900));
  const RATE = 5.0; // KB/sec, on a good night
  const SPEEDUP = TEST ? 4000 : 40;
  const host = $derived(file.toLowerCase().replace(/[_\d].*$/, "").replace(/\W/g, ""));

  let step = $state("ask"); // ask | copying | saved | publisher
  let copied = $state(0);
  let autoClose = $state(false);
  let saving = $state(false);
  let timer;
  onDestroy(() => clearInterval(timer));

  const mb = k => (k / 1024).toFixed(2) + " MB";
  const left = $derived(Math.max(0, Math.ceil((kb - copied) / RATE)));
  const pct = $derived(Math.floor((copied / kb) * 100));

  function start(save) {
    saving = save;
    step = "copying";
    timer = setInterval(() => {
      copied = Math.min(kb, copied + RATE * SPEEDUP * 0.1 * rand(0.6, 1.3));
      if (copied >= kb) { clearInterval(timer); step = saving && !autoClose ? "saved" : "publisher"; }
    }, 100);
  }
  function run() { close("run"); installBar(bar, `${file} finished installing. ${bar.name} has been added to Internet Explorer.`); }
  const title = $derived(
    step === "copying" ? `${pct}% of ${file} Completed` :
    step === "saved" ? "Download complete" :
    step === "publisher" ? "Internet Explorer - Security Warning" : "File Download - Security Warning");
</script>

<Dialog {dlg} {close} {title} icon={step === "copying" || step === "saved" ? I.down : I.shield} w={400}>
  {#if step === "ask"}
    <p style="margin:0">Do you want to run or save this file?</p>
    <div class="dl-file">
      {@html I.cd.replace("viewBox", 'class="bigico" viewBox')}
      <div class="dl-grid">
        <span>Name:</span><u>{file}</u>
        <span>Type:</span><span>Application, {mb(kb)}</span>
        <span>From:</span><span>download.{host}.biz</span>
      </div>
    </div>
    <div class="btns"><button class="xpbtn def" onclick={() => start(false)}>Run</button><button class="xpbtn" onclick={() => start(true)}>Save</button><button class="xpbtn" onclick={() => close("cancel")}>Cancel</button></div>
    <div class="row dl-warn">{@html I.warn.replace("viewBox", 'style="width:18px;height:18px;flex:none" viewBox')}<span class="muted">While files from the Internet can be useful, this file type can potentially harm your computer. If you do not trust the source, do not run or save this software.</span></div>
  {:else if step === "copying"}
    <div class="dl-anim" aria-hidden="true"><span class="folder"></span><span class="paper"></span><span class="folder"></span></div>
    <div><b>{file}</b> from download.{host}.biz</div>
    <div class="prog"><i style:width="{pct}%"></i></div>
    <div class="dl-grid">
      <span>Estimated time left:</span><span>{Math.floor(left / 60)} min {left % 60} sec ({mb(copied)} of {mb(kb)} copied)</span>
      <span>Download to:</span><span>{saving ? "C:\\Documents and Settings\\smithfamily\\Desktop" : "Temporary Folder"}</span>
      <span>Transfer rate:</span><span>{RATE.toFixed(1)} KB/Sec</span>
    </div>
    <label class="chk"><input type="checkbox" bind:checked={autoClose} /> Close this dialog box when download completes</label>
    <div class="btns"><button class="xpbtn" disabled>Open</button><button class="xpbtn" disabled>Open Folder</button><button class="xpbtn" onclick={() => close("cancel")}>Cancel</button></div>
  {:else if step === "saved"}
    <div class="row">{@html I.down.replace("viewBox", 'class="bigico" viewBox')}<div style="padding-top:4px"><b>Download Complete</b><br />Saved: {file} from download.{host}.biz<br />Downloaded: {mb(kb)} in {Math.round(kb / RATE / 60)} min</div></div>
    <div class="btns"><button class="xpbtn def" onclick={() => (step = "publisher")}>Run</button><button class="xpbtn">Open Folder</button><button class="xpbtn" onclick={() => close("close")}>Close</button></div>
  {:else}
    <p style="margin:0">The publisher could not be verified. Are you sure you want to run this software?</p>
    <div class="dl-file">
      {@html I.shieldX.replace("viewBox", 'class="bigico" viewBox')}
      <div class="dl-grid"><span>Name:</span><u>{file}</u><span>Publisher:</span><b>Unknown Publisher</b></div>
    </div>
    <div class="btns"><button class="xpbtn" onclick={run}>Run</button><button class="xpbtn def" onclick={() => close("dontrun")}>Don't Run</button></div>
    <div class="row dl-warn">{@html I.warn.replace("viewBox", 'style="width:18px;height:18px;flex:none" viewBox')}<span class="muted">This file does not have a valid digital signature that verifies its publisher. You should only run software from publishers you trust.</span></div>
  {/if}
</Dialog>
