<script>
  // Windows Update v5, whose one critical update is, of course, a toolbar.
  import { onDestroy } from "svelte";
  import { activeX, rand } from "../../lib/actions.js";
  import { byId } from "../../lib/toolbars.js";

  let phase = $state("welcome"); // welcome | scanning | results
  let pct = $state(0);
  let t;
  onDestroy(() => clearTimeout(t));

  function scan() {
    phase = "scanning";
    const step = () => { pct = Math.min(100, pct + rand(3, 11)); if (pct < 100) t = setTimeout(step, 180); else phase = "results"; };
    step();
  }
</script>

<div class="wu">
  <div class="wu-head"><span class="wu-flag"></span><b>Windows Update</b></div>
  <div class="wu-body">
    <aside>
      <div class="wu-side-h">Windows Update</div>
      <span>Home</span><span>Review your update history</span><span>Restore hidden updates</span><span>Change settings</span><span>Get help and support</span>
    </aside>
    <main>
      {#if phase === "welcome"}
        <h2>Welcome to Windows Update</h2>
        <p>Get the latest updates available for your computer's operating system, software, and hardware.</p>
        <div class="wu-choices">
          <button class="wu-btn" onclick={scan}><b>Express</b><br />Get high-priority updates<br /><span>(Recommended)</span></button>
          <button class="wu-btn" onclick={scan}><b>Custom</b><br />Select optional updates for your computer</button>
        </div>
        <p class="muted">Windows Update requires that you validate your copy of Windows. Validating is quick and easy and it will not install a toolbar. (It will install a toolbar.)</p>
      {:else if phase === "scanning"}
        <h2>Checking for the latest updates for your computer...</h2>
        <div class="prog" style="max-width:300px"><i style:width="{pct}%"></i></div>
      {:else}
        <h2>High-priority updates for your computer</h2>
        <div class="wu-update">
          <label><input type="checkbox" checked disabled /> <b>Toolbar Compatibility Update for Internet Explorer 6 (KB2231)</b></label>
          <p>A problem has been identified that could cause your computer to have fewer than 20 toolbars. After you install this item, you may have to restart your computer, and then restart it again.</p>
          <button class="xpbtn def" onclick={() => activeX(byId("coupon"))}>Install Updates (1)</button>
        </div>
      {/if}
    </main>
  </div>
</div>
