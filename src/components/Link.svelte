<script>
  // A page link: navigates (to), opens an ad (pop), or runs something (run).
  // Hovering shows where it goes in the status bar, as IE did.
  import { ui } from "../lib/state.svelte.js";
  import { go, openPop, setStatus, rand } from "../lib/actions.js";
  import { normalize } from "../lib/pages.js";

  let { to, pop, run, style, children } = $props();
  const target = $derived(to ? normalize(to, ui.url) : `http://ads.bannerclick-network.biz/click.asp?id=${Math.floor(rand(1e5, 1e6))}`);

  function onclick(e) {
    e.preventDefault();
    if (run) run();
    else if (pop) openPop(pop);
    else go(to);
  }
</script>

<a href={target} class:visited={!!ui.visited[target]} {style} {onclick} onmouseenter={() => !ui.loading && setStatus(target)} onmouseleave={() => !ui.loading && setStatus()}>{@render children()}</a>
