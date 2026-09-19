<script>
  // A 2005 corporate site: a Flash preloader, an intro, and a Skip Intro button.
  import { onDestroy } from "svelte";
  import { activeX, rand } from "../../lib/actions.js";

  let loaded = $state(0);
  let skipped = $state(false);
  let t;
  const step = () => { loaded = Math.min(100, loaded + rand(2, 9)); if (loaded < 100) t = setTimeout(step, 140); };
  step();
  onDestroy(() => clearTimeout(t));
  const WORDS = ["Synergy.", "Vision.", "Solutions.", "Leverage.", "Paradigm.", "e-Business."];
</script>

<div class="syn">
  {#if !skipped}
    {#if loaded < 100}
      <div class="syn-load">LOADING... {Math.floor(loaded)}%<div class="syn-bar"><i style:width="{loaded}%"></i></div></div>
    {:else}
      <div class="syn-intro">
        {#each WORDS as w, i}<span style:animation-delay="{i * 0.9}s">{w}</span>{/each}
        <div class="syn-orb"></div>
      </div>
    {/if}
    <button class="syn-skip" onclick={() => (skipped = true)}>[ SKIP INTRO ]</button>
  {:else}
    <div class="syn-site">
      <h2>SynergyVision Solutions, Inc.</h2>
      <p>Welcome. This site requires <b>Macromedia Flash Player 7</b> or higher. You have Flash Player 6.</p>
      <button class="xpbtn def" onclick={() => activeX()}>Get Flash Player</button>
      <p class="fine">Get Flash Player also installs a toolbar. That's just how it is now.</p>
    </div>
  {/if}
</div>
