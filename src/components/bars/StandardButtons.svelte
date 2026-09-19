<script>
  import { ui } from "../../lib/state.svelte.js";
  import { act } from "../../lib/actions.js";
  import { I } from "../../lib/icons.js";

  const run = (name, e) => act[name]({ el: e.currentTarget });
</script>

<button class="tb big" onclick={e => run("back", e)} disabled={ui.idx <= 0} aria-label="Back" title="Back">{@html I.back}<span>Back</span><span class="dd">▼</span></button>
<button class="tb big" onclick={e => run("fwd", e)} disabled={ui.idx >= ui.hist.length - 1} aria-label="Forward" title="Forward">{@html I.fwd}<span class="dd">▼</span></button>
<button class="tb" onclick={e => run("stop", e)} aria-label="Stop" title="Stop">{@html I.stop}</button>
<button class="tb" onclick={e => run("refresh", e)} aria-label="Refresh" title="Refresh">{@html I.refresh}</button>
<button class="tb" onclick={e => run("home", e)} aria-label="Home" title="Home">{@html I.home}</button>
<span class="sep"></span>
<button class="tb big" onclick={e => run("sidebar", e)} title="Search">{@html I.search}<span>Search</span></button>
<button class="tb big" onclick={e => run("favmenu", e)} title="Favorites">{@html I.fav}<span>Favorites</span></button>
<button class="tb big" onclick={e => run("media", e)} aria-label="Media" title="Media">{@html I.media}</button>
<button class="tb big" onclick={e => run("history", e)} aria-label="History" title="History">{@html I.history}</button>
<span class="sep"></span>
<button class="tb big" onclick={e => run("mail", e)} aria-label="Mail" title="Mail">{@html I.mail}<span class="dd">▼</span></button>
<button class="tb big" onclick={e => run("print", e)} aria-label="Print" title="Print">{@html I.print}</button>
