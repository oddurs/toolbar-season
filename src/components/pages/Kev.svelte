<script>
  import { onDestroy } from "svelte";
  import { ui } from "../../lib/state.svelte.js";
  import { canon } from "../../lib/sound.js";

  const NOTES = {
    cats: "Mittens, Mr. Whiskers, and Sir Fluffington III. Images not loaded (bandwidth limit exceeded).",
    links: "Kool Links: Hamster Dance · a flash cartoon about a guy with a strong bad attitude · All Your Base. (2 of 3 are 404 now.)",
  };
  const SEED = [
    { name: "xXDarkAngelXx", home: "www.geocitiez.com/darkangel666", msg: "cool site!!! check out mine", date: "08/02/2003" },
    { name: "kev's mom", home: "", msg: "Very nice Kevin. Please call your grandmother.", date: "12/25/2003" },
    { name: "(spam bot)", home: "www.cheap-meds-online.biz", msg: "Buy cheap meds online!!! Best prices!!!", date: "10/01/2005" },
  ];

  let panel = $state(null); // "guestbook" | "midi" | note key
  let playing = $state(false);
  let stop = null;
  let form = $state({ name: "", home: "", msg: "" });

  ui.kevCount++;
  try { ui.guestbook = JSON.parse(localStorage.getItem("toolbar-season:guestbook") || "[]"); } catch {}
  const entries = $derived([...SEED, ...ui.guestbook].reverse());

  function show(k) { panel = panel === k ? null : k; ui.kevCount++; }
  function save() { try { localStorage.setItem("toolbar-season:guestbook", JSON.stringify(ui.guestbook.slice(-30))); } catch {} }
  function sign(e) {
    e.preventDefault();
    if (!form.msg.trim()) return;
    ui.guestbook.push({ name: form.name.trim() || "Anonymous", home: form.home.trim(), msg: form.msg.trim().slice(0, 300), date: "10/17/2005" });
    save();
    form = { name: "", home: "", msg: "" };
    // Every guestbook got spam within seconds.
    setTimeout(() => {
      ui.guestbook.push({ name: "(spam bot)", home: "www.ringtone-kingdom.biz", msg: "nice site!!! get FREE ringtones for your cell phone!!!", date: "10/17/2005" });
      save();
    }, 2500);
  }
  function toggleMidi() {
    if (playing) { stop?.(); playing = false; return; }
    stop = canon();
    playing = true;
  }
  onDestroy(() => stop?.());
</script>

<div class="kev">
  <div class="marquee"><span>~*~ WeLcOmE tO kEv'S hOmEpAgE ~*~</span></div>
  <p style="color:#f0f">best viewed in Internet Explorer at 800x600 · <span class="blink" style="color:#f00">UNDER CONSTRUCTION</span></p>
  <p>
    <button onclick={() => show("guestbook")}>Sign My Guestbook!!</button> ·
    <button onclick={() => show("cats")}>My Cats</button> ·
    <button onclick={() => show("links")}>Kool Links</button> ·
    <button onclick={() => show("midi")}>MIDI Jukebox</button>
  </p>

  {#if panel === "guestbook"}
    <div class="gb">
      <form onsubmit={sign}>
        <label>Name: <input class="box" bind:value={form.name} maxlength="40" /></label>
        <label>Homepage: <input class="box" bind:value={form.home} maxlength="60" placeholder="http://" /></label>
        <label>Message: <textarea class="box" bind:value={form.msg} maxlength="300" rows="2"></textarea></label>
        <button class="xpbtn" disabled={!form.msg.trim()}>Sign it!</button>
      </form>
      <div class="gb-list">
        {#each entries as g}
          <div class="gb-entry"><b>{g.name}</b>{#if g.home} · <u>{g.home}</u>{/if} <span class="gb-date">{g.date}</span><br />{g.msg}</div>
        {/each}
      </div>
    </div>
  {:else if panel === "midi"}
    <div class="midi">
      <div class="midi-player">
        <button class="midi-btn" aria-label={playing ? "Stop" : "Play"} onclick={toggleMidi}>{playing ? "■" : "▶"}</button>
        <div class="midi-track"><i class:on={playing}></i></div>
        <span>canon_in_d.mid</span>
      </div>
      <p class="note">{ui.muted ? "Your sound is off (bottom left). Kev would be so disappointed." : playing ? "♪ Now playing: “Canon in D (GeoCities Mix).mid” ♪ There is no volume control." : "Press play. Kev insists."}</p>
    </div>
  {:else if panel}
    <p class="note">{NOTES[panel]}</p>
  {/if}

  <p class="counter">You are visitor # <span>{String(ui.kevCount).padStart(6, "0")}</span></p>
  <p class="ring">This site is a member of the Cool Kids Webring · [&lt;&lt; prev | next &gt;&gt;]</p>
  <p class="fine">© 1999-2005 kev · last updated: 3 years ago</p>
</div>
