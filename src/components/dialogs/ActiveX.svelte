<script>
  import Dialog from "../Dialog.svelte";
  import { I } from "../../lib/icons.js";
  import { installBar, activeX } from "../../lib/actions.js";
  let { dlg, close, bar, nag = 0 } = $props();

  function install() { close("ok"); installBar(bar); }
  // "No" is a suggestion.
  function decline() { close("no"); if (nag < 2 && Math.random() < 0.75) setTimeout(() => activeX(bar, nag + 1), 700); }
</script>

<Dialog {dlg} {close} title="Internet Explorer - Security Warning" icon={I.shield} w={420}>
  <div class="row">
    {@html I.shield.replace("viewBox", 'class="bigico" viewBox')}
    <div>
      <p style="margin:0 0 8px">Do you want to install this software?</p>
      <div class="fieldset" style="gap:3px">
        <div><b>Name:</b> <u style="color:#00c">{bar.name}</u></div>
        <div><b>Publisher:</b> <u style="color:#00c">Bundle Partners Distribution LLC</u></div>
      </div>
      {#if nag}
        <p style="margin:8px 0 0;color:#b00"><b>Are you sure?</b> {bar.name} is required to view this page correctly. {nag > 1 ? "This is the last time we will ask. (It is not.)" : ""}</p>
      {/if}
    </div>
  </div>
  <div class="row" style="border-top:1px solid #ccc;padding-top:8px">
    {@html I.warn.replace("viewBox", 'style="width:18px;height:18px;flex:none" viewBox')}
    <span class="muted">While files from the Internet can be useful, this file type can potentially harm your computer. Only install software from publishers you trust.</span>
  </div>
  <div class="btns"><button class="xpbtn def" onclick={install}>Install</button><button class="xpbtn" onclick={decline}>Don't Install</button></div>
</Dialog>
