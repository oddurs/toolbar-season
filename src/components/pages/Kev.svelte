<script>
  import { ui } from "../../lib/state.svelte.js";

  const NOTES = {
    guestbook: "Guestbook entry #412: “cool site!!! check out mine” – xXDarkAngelXx. Entry #413: “Buy cheap meds online” – (spam bot)",
    cats: "Mittens, Mr. Whiskers, and Sir Fluffington III. Images not loaded (bandwidth limit exceeded).",
    links: "Kool Links: Hamster Dance · a flash cartoon about a guy with a strong bad attitude · All Your Base. (2 of 3 are 404 now.)",
    midi: "♪ Now playing: “My Heart Will Go On (Flute Mix).mid” ♪ There is no pause button.",
  };
  ui.kevCount++;
  const show = k => { ui.kevNote = NOTES[k]; ui.kevCount++; };
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
  <p class="note">{ui.kevNote}</p>
  <p class="counter">You are visitor # <span>{String(ui.kevCount).padStart(6, "0")}</span></p>
  <p class="ring">This site is a member of the Cool Kids Webring · [&lt;&lt; prev | next &gt;&gt;]</p>
  <p class="fine">© 1999-2005 kev · last updated: 3 years ago</p>
</div>
