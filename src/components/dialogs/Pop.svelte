<script>
  // Pop-up ad windows. Every "claim" button leads to an install prompt.
  import { onMount } from "svelte";
  import Dialog from "../Dialog.svelte";
  import { I } from "../../lib/icons.js";
  import { activeX, openPop, rand } from "../../lib/actions.js";
  import { byId } from "../../lib/toolbars.js";

  let { dlg, close, kind, exit = false } = $props();

  const SPECS = {
    winner: { title: "CONGRATULATIONS!!!", url: "http://www.prize-center-claims.biz/win.asp?id=1000000", w: 380 },
    monkey: { title: "Punch the Monkey and WIN $20!", url: "http://ads.bannerclick-network.biz/punch/", w: 420 },
    singles: { title: "Lonely?", url: "http://www.friendfinder-connect.biz/?src=toolbar", w: 330 },
    scare: { title: "WARNING!", url: "http://www.free-pc-scan-now.biz/alert.html", w: 380 },
    screensaver: { title: "FREE 3D Aquarium Screensaver!", url: "http://www.popular-screensavers.biz/aquarium3d.asp", w: 360 },
    mail: { title: "Inbox (1)", url: "http://mail.hotmoil.com/cgi-bin/HoTMaiL", w: 360 },
    im: { title: "xXsk8rboiXx - Conversation", url: null, w: 320, icon: I.person },
    camera: { title: "X11 Wireless Camera - Only $79.99!", url: "http://ads.x11cam-direct.biz/popunder.html?src=toolbar", w: 360 },
  };
  const spec = $derived(SPECS[kind]);
  const title = $derived(exit ? "WAIT! Before you go... - Microsoft Internet Explorer" : spec.url ? `${spec.title} - Microsoft Internet Explorer` : spec.title);
  const claim = () => { close("claim"); activeX(); };

  // Punch the Monkey
  let punches = $state(0), monkeyX = $state(0), arena = $state();
  function punch() {
    punches++;
    if (punches === 3) setTimeout(() => { close("won"); activeX(); }, 600);
  }

  // Instant messenger
  let log = $state([]), msg = $state(""), logEl = $state();
  const LINES = ["hey", "a/s/l?", "check out my new smileys!!! :D", "u should get the smiley toolbar its free", "brb mom needs the phone line", "ok back", "did u install it yet"];
  function send() { if (!msg.trim()) return; log.push({ me: true, t: msg }); msg = ""; }
  $effect(() => { log.length; logEl && (logEl.scrollTop = 1e6); });

  onMount(() => {
    const timers = [];
    if (kind === "monkey") {
      const hop = () => { monkeyX = rand(0, (arena?.clientWidth || 300) - 54); timers.push(setTimeout(hop, 500)); };
      hop();
    }
    if (kind === "im") {
      let i = 0;
      const next = () => {
        if (i >= LINES.length) return;
        log.push({ me: false, t: LINES[i++] });
        if (i === 4) timers.push(setTimeout(() => activeX(byId("mws")), 900));
        timers.push(setTimeout(next, rand(1800, 3500)));
      };
      timers.push(setTimeout(next, 700));
    }
    return () => timers.forEach(clearTimeout);
  });
</script>

<Dialog {dlg} {close} {title} icon={spec.icon} w={spec.w} cls="pop">
  {#if spec.url}<div class="pop-addr">{@html I.page.replace("viewBox", 'style="width:14px;height:14px" viewBox')}{spec.url}</div>{/if}
  <div class="pop-page">
    {#if kind === "winner"}
      <div class="ad-winner">
        <div class="blink big">CONGRATULATIONS!</div>
        <div class="sub">You are the <u>1,000,000th</u> visitor!<br />You have WON a FREE* MP3 Player!</div>
        <button class="xpbtn def" style="font-weight:bold" onclick={claim}>CLAIM MY PRIZE &gt;&gt;</button>
        <div class="fine">*Requires purchase of 7 sponsor offers. Void where sensible.</div>
      </div>
    {:else if kind === "monkey"}
      <div class="ad-monkey">
        PUNCH THE MONKEY AND WIN $20! <span class="blink" style="color:#ff0">CLICK HIM!!</span>
        <div class="arena" bind:this={arena}>
          <button class="monkey" style:left="{monkeyX}px" aria-label="Punch the monkey" onclick={punch}>
            <svg viewBox="0 0 50 50"><circle cx="8" cy="22" r="7" fill="#8a5a2b"/><circle cx="42" cy="22" r="7" fill="#8a5a2b"/><circle cx="25" cy="25" r="18" fill="#8a5a2b"/><ellipse cx="25" cy="30" rx="12" ry="10" fill="#f0c89a"/><circle cx="19" cy="21" r="2.5" fill="#000"/><circle cx="31" cy="21" r="2.5" fill="#000"/><path d="M19 33c3 3 9 3 12 0" stroke="#000" stroke-width="2" fill="none"/></svg>
          </button>
        </div>
        <div style="margin-top:4px;font-size:11px">Punches: {punches}{punches >= 3 ? " — YOU WIN!" : ""}</div>
      </div>
    {:else if kind === "singles"}
      <div class="ad-singles">
        <b style="color:#c06;font-size:17px">3 Singles in Your Area</b><br />want to chat with <b>you</b> right now!<br /><br />
        <span style="font-size:11px">(They are all the same guy in Ohio.)</span><br /><br />
        <button class="xpbtn def" onclick={() => { close("claim"); openPop("im"); }}>Chat Now!</button>
      </div>
    {:else if kind === "scare"}
      <div class="ad-scare">
        <div class="row">{@html I.err.replace("viewBox", 'class="bigico" viewBox')}
          <div><b style="color:#c00;font-size:15px">Your computer may be infected!</b><br />Our scan has detected <b class="blink" style="color:#c00">(47) SPYWARE</b> programs on your PC. Click OK to remove them for FREE.</div>
        </div>
        <div class="btns" style="margin-top:10px"><button class="xpbtn def" onclick={claim}>OK</button><button class="xpbtn" onclick={claim}>Cancel</button></div>
        <div style="font-size:9px;color:#888;margin-top:6px">Both buttons do the same thing.</div>
      </div>
    {:else if kind === "screensaver"}
      <div class="ad-fish">
        <svg viewBox="0 0 120 34" style="width:150px;height:42px"><g fill="#ff9a1a"><ellipse cx="22" cy="17" rx="13" ry="8"/><path d="M8 17 0 9v16z"/></g><g fill="#ffe14a"><ellipse cx="62" cy="12" rx="10" ry="6"/><path d="M51 12l-7-6v12z"/></g><g fill="#6fd0ff"><ellipse cx="98" cy="20" rx="12" ry="8"/><path d="M85 20l-8-7v14z"/></g><circle cx="30" cy="15" r="1.6" fill="#000"/><circle cx="68" cy="11" r="1.3" fill="#000"/><circle cx="106" cy="18" r="1.5" fill="#000"/></svg>
        <b style="font-size:15px">FREE 3D Aquarium Screensaver</b><br />Turn your desktop into a relaxing ocean!<br />
        <button class="xpbtn def" style="margin-top:8px;color:#000" onclick={claim}>Download FREE</button>
        <div style="font-size:9px;opacity:.7;margin-top:6px">Includes MyWebSurch toolbar and 3 partner offers. By downloading you agree to a 41-page EULA.</div>
      </div>
    {:else if kind === "camera"}
      <div class="ad-cam">
        <svg viewBox="0 0 60 44" style="width:84px;height:62px"><rect x="6" y="8" width="44" height="30" rx="6" fill="#222"/><circle cx="28" cy="23" r="11" fill="#555" stroke="#999" stroke-width="2"/><circle cx="28" cy="23" r="5" fill="#0af"/><rect x="42" y="12" width="5" height="3" fill="#e33"/><path d="M50 18l8-4v18l-8-4z" fill="#444"/></svg>
        <div><b>The X11 Wireless Camera</b><br />See what's happening at home, from anywhere!<br /><span class="price">Only $79.99</span></div>
        <button class="xpbtn def" onclick={claim}>Order Now &gt;&gt;</button>
        <div class="fine-w">This window opened behind your browser. You're welcome.</div>
      </div>
    {:else if kind === "mail"}
      <div class="ad-mail">
        <b>From:</b> Aunt Linda<br /><b>Subject:</b> FW: FW: fw: FW: Re: This is so TRUE!!!!!<hr />
        &gt;&gt;&gt;&gt; Forward this to 10 people or you will have bad luck for 7 years. Bill Gates will pay you $245 for each forward!!<br /><br />
        <span class="muted">Mailbox is 98% full (2 MB). Upgrade to Hotmoil Plus for $19.95/yr.</span>
      </div>
    {:else if kind === "im"}
      <div class="ad-im">
        <div class="im-log" bind:this={logEl}>
          {#each log as l}<div><b style:color={l.me ? "#00c" : "#c00"}>{l.me ? "me" : "xXsk8rboiXx"} says:</b> {l.t}</div>{/each}
        </div>
        <div class="im-send">
          <input class="box" aria-label="Message" bind:value={msg} onkeydown={e => e.key === "Enter" && send()} />
          <button class="xpbtn" onclick={send}>Send</button>
        </div>
      </div>
    {/if}
  </div>
</Dialog>
