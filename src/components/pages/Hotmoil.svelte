<script>
  // Hotmoil: a secure sign-in page with an insecure banner ad, and an inbox
  // where every message came from a toolbar.
  import { ui, INBOX_URL } from "../../lib/state.svelte.js";
  import { go, openPop, alertDlg } from "../../lib/actions.js";

  let { mode } = $props();
  let email = $state("smithfamily@hotmoil.com");

  const MAIL = [
    ["Aunt Linda", "FW: FW: fw: FW: Re: This is so TRUE!!!!!", "10/17/2005", () => openPop("mail")],
    ["Smiley Centrale", "NEW Halloween smileys are here!!!", "10/17/2005"],
    ["MyWebSurch", "Your weekly search summary (you searched 0 times)", "10/16/2005"],
    ["Prize Center", "CONGRATULATIONS smithfamily, you have WON", "10/16/2005", () => openPop("winner")],
    ["WeatherBugg Alerts", "WEATHER ALERT: it is weather outside", "10/16/2005"],
    ["eBuy", "3 items you're watching are ending soon!", "10/15/2005"],
    ["xXsk8rboiXx", "did u get the smiley thing yet", "10/15/2005", () => openPop("im")],
    ["PC Speed Doctor", "Your PC is running at 34% speed", "10/14/2005", () => openPop("scare")],
    ["Hotmoil Staff", "Your mailbox is almost full (2 MB)", "10/14/2005"],
    ["Kev", "check out my site i updated it (3 years ago)", "10/13/2005"],
  ];
  const open = m => (m[3] ? m[3]() : alertDlg(`<b>${m[1]}</b><br><br>This message has been blocked because it contained images. <u>Click here to show images</u> (all of them are ads).`, { title: m[0] }));
</script>

{#if mode === "signin"}
  <div class="hm">
    <div class="hm-banner">
      {#if ui.hideNonsecure}<span class="broken">✖</span>{:else}<b>REFINANCE NOW!</b> Rates as low as 3.9%! <u>Click here</u>{/if}
    </div>
    <div class="hm-card">
      <div class="hm-logo"><span>✿</span> Hotmoil</div>
      <form onsubmit={e => { e.preventDefault(); go(INBOX_URL); }}>
        <label>E-mail address: <input class="box" bind:value={email} aria-label="E-mail address" /></label>
        <label>Password: <input class="box" type="password" value="hunter22" aria-label="Password" /></label>
        <label class="chk"><input type="checkbox" checked /> Sign me in automatically.</label>
        <button class="xpbtn def">Sign In</button>
      </form>
      <p class="fine">Sign in with your .NET Passport. Your password is safe with us and 14 toolbars.</p>
    </div>
  </div>
{:else}
  <div class="hm-inbox">
    <div class="hm-bar"><b>✿ Hotmoil</b> <span>smithfamily@hotmoil.com</span><span class="full">Mailbox 98% full (2 MB)</span></div>
    <table>
      <thead><tr><th>From</th><th>Subject</th><th>Date</th></tr></thead>
      <tbody>
        {#each MAIL as m}
          <tr onclick={() => open(m)}><td><b>{m[0]}</b></td><td>{m[1]}</td><td>{m[2]}</td></tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}
