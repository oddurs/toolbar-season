<script>
  // Each toolbar's own uninstaller, which would really rather you didn't.
  import { onDestroy } from "svelte";
  import Dialog from "../Dialog.svelte";
  import { I } from "../../lib/icons.js";
  import { uninstall, showInfo, rand } from "../../lib/actions.js";

  let { dlg, close, bar } = $props();
  const honest = $derived(bar.id === "gooble"); // the one you chose uninstalls cleanly
  let step = $state("confirm"); // confirm | survey | offer | removing | done
  let reason = $state("");
  let pct = $state(0);
  let leftovers = $state(false);

  let gone = false;
  onDestroy(() => (gone = true));

  const REASONS = ["I didn't install it", "It slows down my computer", "It shows too many ads", "I have too many toolbars", "My son told me to", "Other (please explain in 500 words or more)"];

  function remove() {
    step = "removing";
    const tick = () => {
      if (gone) return;
      pct = Math.min(100, pct + rand(4, 14));
      if (pct < 100) setTimeout(tick, 160);
      else { leftovers = uninstall(bar.id); step = "done"; }
    };
    tick();
  }
  function keep() {
    close("kept");
    showInfo(`Thank you for keeping ${bar.name}! 3 premium smileys have been added to a toolbar you don't have.`, null, "info");
  }
</script>

<Dialog {dlg} {close} title="{bar.name} Uninstall" icon={I.cd} w={400}>
  {#if step === "confirm"}
    <div class="row">{@html I.warn.replace("viewBox", 'class="bigico" viewBox')}<div style="padding-top:4px">Are you sure you want to completely remove <b>{bar.name}</b> and all of its components?</div></div>
    <div class="btns"><button class="xpbtn def" onclick={() => (honest ? remove() : (step = "survey"))}>Yes</button><button class="xpbtn" onclick={() => close("no")}>No</button></div>
  {:else if step === "survey"}
    <b>We're sorry to see you go!</b>
    <div class="muted">Please tell us why you are uninstalling {bar.name}. (Required)</div>
    <div class="survey">
      {#each REASONS as r}<label><input type="radio" name="why-{dlg.id}" value={r} bind:group={reason} /> {r}</label>{/each}
    </div>
    <div class="btns"><button class="xpbtn def" disabled={!reason} onclick={() => (step = "offer")}>Next &gt;</button><button class="xpbtn" onclick={() => close("cancel")}>Cancel</button></div>
  {:else if step === "offer"}
    <div class="offer">
      <b>WAIT! Don't go yet!</b>
      <p>Keep {bar.name} and get <b>3 FREE premium smileys</b>, plus our new Weather Alerts feature!</p>
    </div>
    <div class="btns">
      <button class="xpbtn def" onclick={keep}>Keep {bar.name} (Recommended)</button>
    </div>
    <div class="nothanks"><button class="linkish" onclick={remove}>no thanks, uninstall anyway</button></div>
  {:else if step === "removing"}
    <div>Removing {bar.name}…</div>
    <div class="prog"><i style:width="{pct}%"></i></div>
    <div class="muted">Deleting C:\Program Files\{bar.name}\…</div>
  {:else}
    <div class="row">{@html I.info.replace("viewBox", 'class="bigico" viewBox')}<div style="padding-top:4px">
      <b>{bar.name}</b> was successfully removed from your computer.
      {#if !honest}<br /><br />Some elements could not be removed. You can remove them manually.{/if}
      {#if leftovers}<br /><span class="muted">Left behind: {bar.name} Update Service (running)</span>{/if}
    </div></div>
    <div class="btns"><button class="xpbtn def" onclick={() => close("done")}>Finish</button></div>
  {/if}
</Dialog>
