<script>
  // Windows XP's "Connect Dial-up Connection". Dial plays the handshake.
  import { onDestroy } from "svelte";
  import Dialog from "../Dialog.svelte";
  import { I } from "../../lib/icons.js";
  import { connected, offline } from "../../lib/actions.js";
  import { modem, wakeAudio } from "../../lib/sound.js";
  import { TEST } from "../../lib/state.svelte.js";

  let { dlg, close } = $props();
  let phase = $state(-1);
  let save = $state(true);
  const STEPS = ["Dialing 555-0142...", "Verifying username and password...", "Registering your computer on the network...", "Connected at 44.0 Kbps."];
  const timers = [];
  onDestroy(() => timers.forEach(clearTimeout));

  function dial() {
    wakeAudio();
    phase = 0;
    // Let the resumed audio context start before scheduling the handshake.
    timers.push(setTimeout(() => {
      const len = TEST ? 0 : Math.max(modem(), 4.5) * 1000;
      timers.push(setTimeout(() => (phase = 1), len * 0.55));
      timers.push(setTimeout(() => (phase = 2), len * 0.85));
      timers.push(setTimeout(() => (phase = 3), len));
      timers.push(setTimeout(() => { close("ok"); connected(); }, len + 700));
    }, 60));
  }
  function cancel() { close("cancel"); offline(); }
</script>

<Dialog {dlg} close={cancel} title="Connect Dial-up Connection" icon={I.globe} w={330} help>
  {#if phase < 0}
    <div class="dialup-art">{@html I.globe.replace("viewBox", 'style="width:44px;height:44px" viewBox')}<span class="wire"></span><svg viewBox="0 0 40 30" style="width:44px;height:33px"><rect x="2" y="8" width="36" height="14" rx="2" fill="#d8d4c4" stroke="#6b6858"/><circle cx="8" cy="15" r="1.4" fill="#3fae24"/><circle cx="13" cy="15" r="1.4" fill="#3fae24"/><circle cx="18" cy="15" r="1.4" fill="#e8b21c"/></svg></div>
    <div class="dialup-form">
      <label for="du-user">User name:</label><input id="du-user" class="box" value="smithfamily" />
      <label for="du-pass">Password:</label><input id="du-pass" class="box" type="password" value="hunter22" />
      <span></span><label class="chk"><input type="checkbox" bind:checked={save} /> Save this user name and password</label>
      <label for="du-dial">Dial:</label><input id="du-dial" class="box" value="555-0142" />
    </div>
    <div class="btns">
      <button class="xpbtn def" onclick={dial}>Dial</button>
      <button class="xpbtn" onclick={cancel}>Cancel</button>
      <button class="xpbtn">Properties</button>
    </div>
  {:else}
    <div class="row">{@html I.globe.replace("viewBox", 'class="bigico" viewBox')}<div style="padding-top:8px">{STEPS[phase]}</div></div>
    <div class="btns"><button class="xpbtn" onclick={cancel}>Cancel</button></div>
  {/if}
</Dialog>
