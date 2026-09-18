<script>
  import { KEV_URL } from "../../lib/state.svelte.js";
  import { act, go, openPop } from "../../lib/actions.js";
  import { I } from "../../lib/icons.js";

  const ico = svg => svg.replace("viewBox", 'class="ico" viewBox');
  const links = [
    ["Customize Links", I.page, () => act.why()],
    ["Free Hotmoil", I.page, () => act.mail()],
    ["Windows Media", I.page, () => act.media()],
    ["Kev's Page", I.page, () => go(KEV_URL)],
    null,
    ["Cheap Tickets!!", I.globe, () => openPop("winner")],
    ["Casino $500 FREE", I.dice, () => openPop("winner")],
    ["Smileys", I.globe, () => openPop("screensaver")],
    ["Ringtones", I.note, () => openPop("scare")],
  ];
</script>

<span class="lbl muted">Links</span>
{#each links as l}
  {#if l}
    <button class="tb" onclick={l[2]}>{@html ico(l[1])}{l[0]}</button>
  {:else}
    <span class="sep"></span>
  {/if}
{/each}
