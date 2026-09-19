<script>
  import { ui } from "../lib/state.svelte.js";
  import { activeX, buddy, BUDDY_LINES, pick } from "../lib/actions.js";
  import { EXTRA_BARS } from "../lib/toolbars.js";
  import { BUDDY_SVG } from "../lib/icons.js";

  let bye = $state(false);
  function yes() { ui.buddy.line = null; activeX(EXTRA_BARS.find(b => b.id === "bonzibar")); }
  function goAway() { bye = true; setTimeout(() => { bye = false; ui.buddy.line = null; }, 1800); }
</script>

{#if ui.buddy && !ui.ended}
  {#key ui.buddy.n}
    <div class="buddy bounce">
      <button class="buddy-body" aria-label="BuddyBonz" onclick={() => buddy()}>{@html BUDDY_SVG}</button>
      {#if ui.buddy.line}
        <div class="bubble">
          {#if bye}OK! I'll be right here if you need me. :){:else}
            {ui.buddy.line}
            <div class="btns">
              <button class="xpbtn" onclick={yes}>Yes!</button>
              <button class="xpbtn" onclick={() => buddy(pick(BUDDY_LINES))}>Tell me more</button>
              <button class="xpbtn" onclick={goAway}>Go away</button>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  {/key}
{/if}
