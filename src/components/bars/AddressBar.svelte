<script>
  import { ui, KEV_URL, HOME_URL } from "../../lib/state.svelte.js";
  import { go, openMenu } from "../../lib/actions.js";
  import { I } from "../../lib/icons.js";

  let typed = $state("");
  let wrap = $state();
  $effect(() => { typed = ui.url; });

  function history() {
    const r = wrap.getBoundingClientRect();
    const urls = [...new Set([...ui.hist, HOME_URL, KEV_URL, "http://www.homestar.fake/"])].reverse().slice(0, 10);
    openMenu(r.left, r.bottom, urls.map(u => ({ label: u, fn: () => go(u) })));
  }
</script>

<span class="lbl muted">A<u>d</u>dress</span>
<div class="addrwrap" bind:this={wrap}>
  {@html I.page.replace("viewBox", 'class="ico" viewBox')}
  <input id="addr" spellcheck="false" autocomplete="off" aria-label="Address" bind:value={typed} onkeydown={e => e.key === "Enter" && go(typed)} />
  <button class="ddbtn" aria-label="Previously typed addresses" onclick={history}>▼</button>
</div>
<button class="tb go" onclick={() => go(typed)}>{@html I.go}Go</button>
