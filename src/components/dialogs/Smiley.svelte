<script>
  import Dialog from "../Dialog.svelte";
  import { I, smiley } from "../../lib/icons.js";
  import { activeX } from "../../lib/actions.js";
  let { dlg, close, name, n } = $props();
</script>

<Dialog {dlg} {close} title="Smiley Centrale" icon={I.info} w={340}>
  <div class="row">{@html smiley(n).replace('class="smiley"', 'class="bigico"')}<div>Insert “{name}” smiley? Premium smileys need the Smiley Centrale Plus pack.</div></div>
  <div class="btns"><button class="xpbtn def" onclick={() => { close("ok"); activeX(); }}>Get Plus Pack</button><button class="xpbtn" onclick={() => close("no")}>Maybe Later</button></div>
</Dialog>
