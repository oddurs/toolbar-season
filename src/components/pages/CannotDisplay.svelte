<script>
  import { I } from "../../lib/icons.js";
  import { refresh, back } from "../../lib/actions.js";
  let { url } = $props();
</script>

<div class="cannot">
  <div class="cannot-head">{@html I.info.replace("viewBox", 'style="width:32px;height:32px;flex:none" viewBox')}<h1>The page cannot be displayed</h1></div>
  <p>The page you are looking for is currently unavailable. The Web site might be experiencing technical difficulties, or you may need to adjust your browser settings.</p>
  <hr />
  <p>Please try the following:</p>
  <ul>
    <li>Click the <button class="linkish" onclick={refresh}>Refresh</button> button, or try again later.</li>
    <li>If you typed the page address in the Address bar, make sure that it is spelled correctly.</li>
    <li>To check your connection settings, click the <b>Tools</b> menu, and then click <b>Internet Options</b>.</li>
    <li>Click <button class="linkish" onclick={back}>Back</button> to try another link.</li>
  </ul>
  <p class="muted">Cannot find server or DNS Error<br />Internet Explorer</p>
  <p class="muted" style="font-size:10px">{url}</p>
</div>
