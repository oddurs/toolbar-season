<script>
  // Display Properties › Desktop. Locked while PC Speed Doctor holds the wallpaper.
  import Dialog from "../Dialog.svelte";
  import { I } from "../../lib/icons.js";
  import { ui, isInstalled } from "../../lib/state.svelte.js";

  let { dlg, close } = $props();
  const locked = ui.wallpaper === "infected" && isInstalled("speeddr");
  const CHOICES = [
    ["none", "(None)"],
    ["bliss", "Bliss"],
    ...(ui.wallpaper === "ad" ? [["ad", "congratulations[1].bmp"]] : []),
  ];
  let pick = $state(ui.wallpaper === "infected" ? "bliss" : ui.wallpaper);
  const apply = () => (ui.wallpaper = pick);
  const tabs = ["Themes", "Desktop", "Screen Saver", "Appearance", "Settings"];
</script>

{#if locked}
  <Dialog {dlg} {close} title="Display Properties" icon={I.err} w={380}>
    <div class="row">{@html I.err.replace("viewBox", 'class="bigico" viewBox')}<div style="padding-top:4px">Display Properties has been disabled by your administrator.<br /><br /><span class="muted">Administrator: PC Speed Doctor</span></div></div>
    <div class="btns"><button class="xpbtn def" onclick={() => close("ok")}>OK</button></div>
  </Dialog>
{:else}
  <Dialog {dlg} {close} title="Display Properties" icon={I.globe} w={400} help>
    <div class="tabs">{#each tabs as t}<span class:on={t === "Desktop"}>{t}</span>{/each}</div>
    <div class="monitor"><div class="screen wp-{pick}"></div></div>
    <label for="wp-list">Background:</label>
    <select id="wp-list" size="4" class="wp-list" bind:value={pick}>
      {#each CHOICES as [value, label]}<option {value}>{label}</option>{/each}
    </select>
    <div class="btns">
      <button class="xpbtn def" onclick={() => { apply(); close("ok"); }}>OK</button>
      <button class="xpbtn" onclick={() => close("cancel")}>Cancel</button>
      <button class="xpbtn" onclick={apply}>Apply</button>
    </div>
  </Dialog>
{/if}
