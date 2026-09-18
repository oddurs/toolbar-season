<script>
  import Link from "../Link.svelte";
  import { KEV_URL, FORUM_URL } from "../../lib/state.svelte.js";
  let { q, host } = $props();

  const slug = $derived(q.toLowerCase().replace(/\W+/g, "") || "stuff");
  const sponsored = $derived([
    [`Cheap ${q} - Compare Prices!`, `Find great deals on ${q}. Shop, compare and save!`, "winner"],
    [`${q} at eBuy`, `Looking for ${q}? Find exactly what you want today.`, "winner"],
    [`FREE ${q} Download`, "100% free, no spyware* (*some spyware).", "screensaver"],
    [`Singles Interested in ${q}`, `Meet local singles who also searched for ${q}.`, "singles"],
    [`Remove ${q} Now - Free Scan`, `Your PC may be infected with ${q}. Run a free scan!`, "scare"],
  ]);
</script>

<div class="results">
  <div class="results-head">
    <b>{host}</b>
    <span>Results 1 - 10 of about 48,200,000 for <b>{q}</b>.</span>
  </div>
  <div class="sponsored">
    <div class="tiny">Sponsored Links</div>
    {#each sponsored as [t, d, pop], i}
      <div class="hit"><Link {pop}><b>{t}</b></Link><br /><span class="desc">{d}</span><br /><span class="green">www.{slug}-deals{i}.biz</span></div>
    {/each}
  </div>
  <div class="tiny">Web Results</div>
  <div class="hit"><Link to={FORUM_URL}><b>HELP!!! toolbars wont go away</b> - TechGuyz Forums</Link><br /><span class="desc">...i have like 15 toolbars and i didnt install ANY of them. my son says its spyware. how do i...</span></div>
  <div class="hit"><Link to={KEV_URL}><b>Kev's Homepage</b> - {q} and other cool stuff</Link><br /><span class="desc">...welcome to my page!!! it has <b>{q}</b> and also my cats. sign my guestbook...</span></div>
  <div class="hit"><Link to="http://www.{slug}.com/">{q} - Official Site</Link><br /><span class="desc">This result was bumped to the bottom by Sponsored Results™.</span></div>
</div>
