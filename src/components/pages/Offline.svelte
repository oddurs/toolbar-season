<script>
  import { I } from "../../lib/icons.js";
  import { dialUp } from "../../lib/actions.js";
</script>

<div class="cannot">
  <div class="cannot-head">{@html I.info.replace("viewBox", 'style="width:32px;height:32px;flex:none" viewBox')}<h1>Web page unavailable while offline</h1></div>
  <p>The Web page you requested is not available offline. To view this page, click <b>Connect</b>.</p>
  <p><button class="xpbtn def" onclick={dialUp}>Connect</button></p>
  <p class="muted">Your toolbars are available offline. They are always available.</p>
</div>
