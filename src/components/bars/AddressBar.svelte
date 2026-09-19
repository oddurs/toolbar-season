<script>
  import { ui, KNOWN_URLS, hijacker } from "../../lib/state.svelte.js";
  import { go, openMenu, doSearch } from "../../lib/actions.js";
  import { ENGINES } from "../../lib/pages.js";
  import { I } from "../../lib/icons.js";

  let typed = $state("");
  let wrap = $state();
  let open = $state(false);
  let sel = $state(-1);
  let rect = $state({ left: 0, top: 0, width: 0 });
  $effect(() => { typed = ui.url; });

  const bare = u => u.replace(/^https?:\/\/(www\.)?/i, "");
  // IE AutoComplete: sites you've been to, plus one "suggestion" someone paid for.
  const suggestions = $derived.by(() => {
    const q = bare(typed.trim().toLowerCase());
    if (!q) return [];
    const urls = [...new Set([...ui.hist, ...KNOWN_URLS])].filter(u => bare(u).toLowerCase().includes(q)).slice(0, 6).map(u => ({ label: u, go: () => go(u) }));
    const engine = hijacker() || "portal";
    return [...urls, { label: `Search for “${typed.trim()}” with ${ENGINES[engine]}`, sponsored: true, go: () => doSearch(engine, typed) }];
  });

  function oninput() {
    rect = wrap.getBoundingClientRect();
    open = true;
    sel = -1;
  }
  function submit() {
    open = false;
    if (sel >= 0) suggestions[sel].go();
    else go(typed);
  }
  function onkeydown(e) {
    if (e.key === "Enter") return submit();
    if (e.key === "Escape") return (open = false);
    if (!open || !suggestions.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); sel = (sel + 1) % suggestions.length; }
    if (e.key === "ArrowUp") { e.preventDefault(); sel = (sel - 1 + suggestions.length) % suggestions.length; }
  }
  function history() {
    const r = wrap.getBoundingClientRect();
    const urls = [...new Set([...ui.hist, ...KNOWN_URLS])].reverse().slice(0, 10);
    openMenu(r.left, r.bottom, urls.map(u => ({ label: u, fn: () => go(u) })));
  }
</script>

<span class="lbl muted">A<u>d</u>dress</span>
<div class="addrwrap" bind:this={wrap}>
  {@html I.page.replace("viewBox", 'class="ico" viewBox')}
  <input
    id="addr"
    spellcheck="false"
    autocomplete="off"
    aria-label="Address"
    aria-autocomplete="list"
    aria-expanded={open && suggestions.length > 0}
    bind:value={typed}
    {oninput}
    {onkeydown}
    onblur={() => (open = false)}
  />
  <button class="ddbtn" aria-label="Previously typed addresses" onclick={history}>▼</button>
</div>
<button class="tb go" onclick={() => go(typed)}>{@html I.go}Go</button>

{#if open && suggestions.length}
  <div class="autocomplete" role="listbox" style:left="{rect.left}px" style:top="{rect.bottom}px" style:width="{rect.width}px">
    {#each suggestions as s, i}
      <div
        class="ac-item"
        class:hot={i === sel}
        class:spons={s.sponsored}
        role="option"
        aria-selected={i === sel}
        tabindex="-1"
        onmousedown={e => { e.preventDefault(); sel = i; submit(); }}
      >{s.label}</div>
    {/each}
  </div>
{/if}
