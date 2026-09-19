<script>
  // BuddyBonz on screen: slides in, blinks, waves, talks with a flapping mouth,
  // sings with the lyrics lighting up, can be dragged around, and has his own
  // right-click menu. Click him and he giggles.
  import { ui } from "../lib/state.svelte.js";
  import { say, joke, fact, chatter, sing, tickle, hide } from "../lib/buddy.js";
  import { openMenu, closeMenu, activeX, alertDlg, doSearch } from "../lib/actions.js";
  import { EXTRA_BARS } from "../lib/toolbars.js";
  import { DAISY } from "../lib/sound.js";

  const b = $derived(ui.buddy);
  const visible = $derived(b && (b.here || b.leaving) && !ui.ended && !ui.crashed);

  // The bubble types itself out, like the real thing.
  let shown = $state(0);
  $effect(() => {
    const line = b?.line;
    shown = 0;
    if (!line) return;
    const t = setInterval(() => { shown += 2; if (shown >= line.length) clearInterval(t); }, 28);
    return () => clearInterval(t);
  });

  // Drag him around; a click without a drag tickles him.
  let el = $state();
  function onpointerdown(e) {
    if (e.button !== 0) return;
    e.preventDefault();
    const r = el.getBoundingClientRect(), sx = e.clientX - r.left, sy = e.clientY - r.top;
    let moved = false;
    const move = ev => {
      if (!moved && Math.hypot(ev.clientX - e.clientX, ev.clientY - e.clientY) < 5) return;
      moved = true;
      b.x = Math.max(0, Math.min(innerWidth - r.width, ev.clientX - sx));
      b.y = Math.max(120, Math.min(innerHeight - r.height, ev.clientY - sy));
    };
    const up = () => { removeEventListener("pointermove", move); removeEventListener("pointerup", up); if (!moved) tickle(); };
    addEventListener("pointermove", move);
    addEventListener("pointerup", up);
  }

  const MENU = () => [
    { label: "Tell me a joke", fn: joke },
    { label: "Tell me a fact", fn: fact },
    { label: "Sing a song", fn: sing },
    { label: "What's today's date?", fn: () => say("Today is Monday, October 17, 2005. Isn't that neat?") },
    { label: "Search the web...", fn: () => { say("Searching the web with my special search engine!"); doSearch("portal", "free smileys"); } },
    "-",
    { label: "BuddyBonz Options...", fn: () => alertDlg("<b>BuddyBonz Options</b><br><br>☑ Tell me jokes<br>☑ Sing to me<br>☑ Change my home page<br>☑ Share my browsing with trusted partners<br>☑ Start BuddyBonz when Windows starts<br><br><i>These options cannot be changed.</i>", { title: "BuddyBonz" }) },
    { label: "Hide", fn: hide },
  ];
  function oncontextmenu(e) {
    e.preventDefault();
    closeMenu();
    openMenu(e.clientX, e.clientY, MENU());
  }
  const offerToolbar = () => { say("Yay! Installing my toolbar now! You won't regret it!"); activeX(EXTRA_BARS.find(x => x.id === "bonzibar")); };
</script>

{#if visible}
  <div
    class="buddy {b.mood}"
    class:leaving={b.leaving}
    class:placed={b.x !== null}
    style:left={b.x !== null ? `${b.x}px` : null}
    style:top={b.y !== null ? `${b.y}px` : null}
    bind:this={el}
  >
    {#if b.line || b.song}
      <div class="bubble" role="status" aria-live="polite">
        {#if b.song}
          <div class="lyrics">♪ {#each DAISY as [syl], i}<span class:sung={i <= b.song.at} class:now={i === b.song.at}>{syl}</span>{/each} ♪</div>
        {:else}
          <span class="said">{b.line.slice(0, shown)}</span><span class="unsaid">{b.line.slice(shown)}</span>
        {/if}
        <div class="btns">
          <button class="xpbtn" onclick={joke}>Joke</button>
          <button class="xpbtn" onclick={sing}>Sing</button>
          {#if !ui.installed.bonzibar}<button class="xpbtn" onclick={offerToolbar}>Get my toolbar!</button>{/if}
          <button class="xpbtn" onclick={hide}>Hide</button>
        </div>
      </div>
    {/if}
    <button class="buddy-body" aria-label="BuddyBonz. Drag to move, click to tickle, right-click for options." {onpointerdown} {oncontextmenu}>
      <svg viewBox="0 0 110 132" aria-hidden="true">
        <g class="b-all">
          <!-- feet and body -->
          <ellipse cx="38" cy="126" rx="13" ry="5" fill="#5a2a8c" />
          <ellipse cx="72" cy="126" rx="13" ry="5" fill="#5a2a8c" />
          <ellipse cx="55" cy="94" rx="35" ry="33" fill="#7b3fb8" />
          <ellipse cx="55" cy="101" rx="21" ry="23" fill="#b58be0" />
          <!-- left arm hangs; right arm waves -->
          <path d="M24 78 C10 88 10 106 20 114" stroke="#6a33a3" stroke-width="11" stroke-linecap="round" fill="none" />
          <circle cx="21" cy="114" r="7" fill="#c9a6ef" />
          <g class="b-arm">
            <path d="M86 78 C100 88 100 106 90 114" stroke="#6a33a3" stroke-width="11" stroke-linecap="round" fill="none" />
            <circle cx="89" cy="114" r="7" fill="#c9a6ef" />
          </g>
          <!-- head -->
          <circle cx="26" cy="40" r="9" fill="#7b3fb8" /><circle cx="26" cy="40" r="5" fill="#c9a6ef" />
          <circle cx="84" cy="40" r="9" fill="#7b3fb8" /><circle cx="84" cy="40" r="5" fill="#c9a6ef" />
          <circle cx="55" cy="40" r="29" fill="#7b3fb8" />
          <path d="M55 20 C47 12 40 17 45 23 M55 20 C63 12 70 17 65 23" stroke="#5a2a8c" stroke-width="3" fill="none" stroke-linecap="round" />
          <!-- face -->
          <circle cx="45" cy="36" r="10.5" fill="#d8bff5" />
          <circle cx="65" cy="36" r="10.5" fill="#d8bff5" />
          <ellipse cx="55" cy="52" rx="19" ry="14" fill="#d8bff5" />
          <path class="b-brow" d="M33 28 Q45 21 55 28 Q65 21 77 28" stroke="#4a1f78" stroke-width="3.2" fill="none" stroke-linecap="round" />
          <circle cx="46" cy="37" r="5.6" fill="#fff" /><circle cx="64" cy="37" r="5.6" fill="#fff" />
          <circle class="b-pupil" cx="47" cy="38" r="2.7" fill="#111" /><circle class="b-pupil" cx="65" cy="38" r="2.7" fill="#111" />
          <circle cx="48" cy="36.8" r=".9" fill="#fff" /><circle cx="66" cy="36.8" r=".9" fill="#fff" />
          <rect class="b-lid" x="39.5" y="30.8" width="13" height="12.5" rx="6" fill="#7b3fb8" />
          <rect class="b-lid" x="57.5" y="30.8" width="13" height="12.5" rx="6" fill="#7b3fb8" />
          <ellipse cx="55" cy="47" rx="6" ry="3.6" fill="#3a1260" />
          <circle cx="52.5" cy="47.5" r="1.1" fill="#7b3fb8" /><circle cx="57.5" cy="47.5" r="1.1" fill="#7b3fb8" />
          <!-- mouths: one shows at a time -->
          <path class="b-closed" d="M44 55 Q55 64 66 55" stroke="#3a1260" stroke-width="2.6" fill="none" stroke-linecap="round" />
          <g class="b-open"><ellipse cx="55" cy="58" rx="8.5" ry="6.5" fill="#3a1260" /><ellipse cx="55" cy="61.5" rx="5" ry="2.6" fill="#e0607e" /></g>
          <path class="b-sad" d="M45 61 Q55 53 65 61" stroke="#3a1260" stroke-width="2.6" fill="none" stroke-linecap="round" />
        </g>
      </svg>
    </button>
  </div>
{/if}
