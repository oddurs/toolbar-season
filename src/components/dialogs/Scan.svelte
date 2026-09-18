<script>
  // SpyScrub SE: finds everything, removes everything, for about a minute.
  import { onMount } from "svelte";
  import Dialog from "../Dialog.svelte";
  import { I } from "../../lib/icons.js";
  import { adware } from "../../lib/state.svelte.js";
  import { closeBar, showInfo, rand, pick } from "../../lib/actions.js";

  let { dlg, close } = $props();

  const found = adware();
  const keys = found.flatMap(b => [
    `HKLM\\Software\\${b.name.replace(/\W/g, "")}\\Toolbar`,
    `C:\\Program Files\\${b.name}\\${b.id}bar.dll`,
    `HKCU\\Software\\Microsoft\\Internet Explorer\\Toolbar\\{${(b.id + "0000-4f2a-9c0b").toUpperCase()}}`,
    `Tracking Cookie: ${b.id}.adserver.biz`,
  ]);
  let shown = $state([]), scanned = $state(0), threats = $state(0), done = $state(false), logEl = $state();
  let current = $state("Initializing definitions file (SE1R76 17.10.2005)…");

  $effect(() => { shown.length; logEl && (logEl.scrollTop = 1e6); });

  onMount(() => {
    let t;
    const tick = () => {
      scanned += Math.floor(rand(80, 400));
      if (shown.length < keys.length) { shown.push(keys[shown.length]); threats += Math.floor(rand(8, 40)); }
      current = pick(["Scanning memory…", "Scanning registry…", "Scanning Windows\\System32…", "Scanning cookies…", "Deep-scanning drive C:…"]);
      if (shown.length < keys.length || scanned < 2000) t = setTimeout(tick, 110);
      else { done = true; current = found.length ? "Scan complete. Your system is at risk." : "Scan complete. No toolbars found. Enjoy it while it lasts."; }
    };
    tick();
    return () => clearTimeout(t);
  });

  function removeAll() {
    close("ok");
    found.forEach(b => closeBar(b.id, { silent: true }));
    showInfo(`SpyScrub removed ${threats} critical objects and ${found.length} toolbars. Your browser is clean!`, null, "shield");
  }
</script>

<Dialog {dlg} {close} title="SpyScrub SE Personal - Scan" icon={I.shield} w={430}>
  <div class="row">{@html I.shield.replace("viewBox", 'class="bigico" viewBox')}<div><b>Performing smart system scan</b><br /><span class="muted">{current}</span></div></div>
  <div class="prog"><i style:width="{Math.min(100, (shown.length / Math.max(1, keys.length)) * 100)}%"></i></div>
  <div class="scanlog" bind:this={logEl}>{#each shown as k}<div style="color:#c00">✖ {k}</div>{/each}</div>
  <div><b>Objects scanned: {scanned.toLocaleString()} · Critical objects found: <span style="color:#c00">{threats}</span></b></div>
  <div class="btns">
    <button class="xpbtn def" disabled={!done || !found.length} onclick={removeAll}>Remove All</button>
    <button class="xpbtn" onclick={() => close("cancel")}>Cancel</button>
  </div>
</Dialog>
