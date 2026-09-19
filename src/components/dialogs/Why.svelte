<script>
  import Dialog from "../Dialog.svelte";
  import { I } from "../../lib/icons.js";
  let { dlg, close } = $props();
</script>

<Dialog {dlg} {close} title="What is this?" icon={I.info} w={440}>
  <div class="why">
    <p><b>Toolbar Season</b> is Internet Explorer 6 on Windows XP, October 2005, when a free screensaver came with a toolbar and the toolbar came with three more.</p>
    <p>Toolbar makers paid for every install, so every free download had one pre-ticked on the fourth screen of the installer. They changed your home page and your search engine, showed you ads, and watched where you went. Most people had several. Nobody remembers installing any of them.</p>
    <p>Close them, scan for them, uninstall them. They come back. It ends one of two ways: the toolbars take the last of the page, or you keep the browser clean for one full minute.</p>
    <p class="muted">Every name here is a parody. Sound is on; the switch is bottom left.</p>
  </div>
  <div class="btns"><button class="xpbtn def" onclick={() => close("ok")}>OK</button></div>
</Dialog>
