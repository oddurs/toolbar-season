<script>
  import Dialog from "../Dialog.svelte";
  import { I } from "../../lib/icons.js";
  import { ui } from "../../lib/state.svelte.js";
  let { dlg, close, html } = $props();
  const text = $derived(`<html>\n<!-- toolbar partner id: 2231 -->\n<script src="http://ads.bannerclick-network.biz/pop.js"></scr` + `ipt>\n${html.trim().slice(0, 4000)}\n</html>`);
</script>

<Dialog {dlg} {close} title="{ui.url.split('/')[2] || 'blank'}[1] - Notepad" icon={I.page} w={520}>
  <textarea class="source" readonly aria-label="Page source">{text}</textarea>
</Dialog>
