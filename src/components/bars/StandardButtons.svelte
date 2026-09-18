<script>
  import { ui } from "../../lib/state.svelte.js";
  import { act } from "../../lib/actions.js";
  import { I } from "../../lib/icons.js";

  const run = (name, e) => act[name]({ el: e.currentTarget });
</script>

<button class="tb big" onclick={e => run("back", e)} disabled={ui.idx <= 0} aria-label="Back">{@html I.back}<span>Back</span><span class="dd">▼</span></button>
<button class="tb big" onclick={e => run("fwd", e)} disabled={ui.idx >= ui.hist.length - 1} aria-label="Forward">{@html I.fwd}<span class="dd">▼</span></button>
<button class="tb" onclick={e => run("stop", e)} aria-label="Stop">{@html I.stop}</button>
<button class="tb" onclick={e => run("refresh", e)} aria-label="Refresh">{@html I.refresh}</button>
<button class="tb" onclick={e => run("home", e)} aria-label="Home">{@html I.home}</button>
<span class="sep"></span>
<button class="tb big" onclick={e => run("sidebar", e)}>{@html I.search}<span>Search</span></button>
<button class="tb big" onclick={e => run("favmenu", e)}>{@html I.fav}<span>Favorites</span></button>
<button class="tb big" onclick={e => run("media", e)} aria-label="Media">{@html I.media}</button>
<button class="tb big" onclick={e => run("history", e)} aria-label="History">{@html I.history}</button>
<span class="sep"></span>
<button class="tb big" onclick={e => run("mail", e)} aria-label="Mail">{@html I.mail}<span class="dd">▼</span></button>
<button class="tb big" onclick={e => run("print", e)} aria-label="Print">{@html I.print}</button>
