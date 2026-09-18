<script>
  import { ui, isOn, KEV_URL } from "../lib/state.svelte.js";
  import { closeBar, doSearch } from "../lib/actions.js";
  import Link from "./Link.svelte";

  let q = $state("");
  const mode = $derived(ui.sideMode || (isOn("sidefind") ? "sidefind" : null));
  const seen = $derived([...new Set(ui.hist)].reverse());

  function close() {
    if (mode === "sidefind") closeBar("sidefind");
    ui.sideMode = null;
  }
  const find = () => doSearch(mode === "sidefind" ? "sidefind" : "msm", q);
</script>

{#if mode}
  <aside class="side">
    <div class="side-h">
      {#if mode === "sidefind"}<span><b style="color:#0a8a8a">SideFind</b> Search</span>
      {:else if mode === "history"}<span>History</span>
      {:else}<span>Search Companion</span>{/if}
      <button class="band-x" aria-label="Close Explorer Bar" onclick={close}>×</button>
    </div>
    <div class="side-b">
      {#if mode === "history"}
        <div class="muted">Today</div>
        {#each seen as u}<Link to={u}>{u.replace(/^http:\/\//, "")}</Link>{/each}
        <div class="muted" style="margin-top:6px">Last Week</div>
        <Link to={KEV_URL}>www.geocitiez.com</Link>
        <Link to="http://www.homestar.fake/">www.homestar.fake</Link>
      {:else}
        <div>{mode === "sidefind" ? "Search the Internet with SideFind!" : "What do you want to search for?"}</div>
        <input class="box side-q" aria-label="Search" bind:value={q} onkeydown={e => e.key === "Enter" && find()} />
        <button class="xpbtn" onclick={find}>{mode === "sidefind" ? "Find It!" : "Search"}</button>
        {#if mode === "sidefind"}
          <div class="ad"><b style="color:#c00">Sponsored</b>
            <Link pop="winner">Win a FREE MP3 Player!</Link><Link pop="singles">Local Singles</Link><Link pop="screensaver">Free Screensavers</Link>
          </div>
          <div class="ad"><b>SideFind Top Searches</b>
            <Link to="search:ringtones">ringtones</Link><Link to="search:lyrics">song lyrics</Link><Link to="http://forums.techguyz.fake/showthread.php?t=41742">how to remove sidefind</Link>
          </div>
          <div class="muted" style="font-size:10px">SideFind replaced your Search Companion so you could search better.</div>
        {/if}
      {/if}
    </div>
  </aside>
{/if}
