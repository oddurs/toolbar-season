<script>
  import { ui, isOn, adware } from "../../lib/state.svelte.js";
  import { ALL_BARS } from "../../lib/toolbars.js";
  import { act, openDialog } from "../../lib/actions.js";

  let reply = $state("");
  // The moderator reads your post and answers based on what's still installed.
  function post(e) {
    e.preventDefault();
    const text = reply.trim();
    if (!text) return;
    ui.forumReplies.push({ who: "smithfamily", meta: "Junior Member<br>Posts: 1", text });
    reply = "";
    setTimeout(() => {
      const n = adware().length;
      ui.forumReplies.push({
        who: "Mod_Steve", meta: "Moderator<br>Posts: 14,884", mod: true,
        text: n > 3 ? `Thanks for the update. Your browser still has ${n} toolbars. Scanning only hides them: go to Tools › Add or Remove Programs and uninstall each one. Then post a fresh HijackThis log.`
          : n > 0 ? `Almost there. ${n} left. Watch out for the ones that come back on their own; their Update Service reinstalls them.`
          : "Your log looks clean now. Marking this thread [RESOLVED]. Stop clicking the smiley ads.",
      });
    }, 3000);
  }

  const bars = ALL_BARS.filter(b => !b.builtin && isOn(b.id));
  const log = bars.map(b => `O3 - Toolbar: ${b.name} - {${(b.id + "0000-4f2a-9c0b-2231").toUpperCase()}} - C:\\PROGRA~1\\${b.name.replace(/\W/g, "").slice(0, 8).toUpperCase()}\\${b.id}bar.dll`);
</script>

{#snippet entry(who, meta, alt, body)}
  <tr>
    <td class="who" class:alt><b>{who}</b><br /><span>{@html meta}</span></td>
    <td class="body">{@render body()}</td>
  </tr>
{/snippet}

<div class="forum">
  <div class="forum-head">TechGuyz Forums <span>› Security › Virus, Spyware &amp; Hijack Help</span></div>
  <div class="forum-body">
    <div class="thread">HELP!!! toolbars wont go away</div>
    <table><tbody>
      {#snippet p1()}I have {bars.length || "like 15"} toolbars and I didn't install ANY of them. My son says it's spyware. I can only see a little bit of the internet at the bottom. How do I get rid of them??? Please help I am not a computer person{/snippet}
      {@render entry("sk8rmom72", "Junior Member<br>Posts: 3", false, p1)}
      {#snippet p2()}Welcome to TechGuyz. Please download and run HijackThis, then post the log here. Do <b>not</b> fix anything yet.{/snippet}
      {@render entry("Mod_Steve", "Moderator<br>Posts: 14,882", true, p2)}
      {#snippet p3()}ok here it is
        <div class="hjt">Logfile of HijackThis v1.99.1<br />Scan saved at 9:14:02 PM, on 10/17/2005<br />Platform: Windows XP SP2 (WinNT 5.01.2600)<br />MSIE: Internet Explorer v6.00 SP2 (6.00.2900.2180)<br /><br />R1 - HKCU\Software\Microsoft\Internet Explorer\Main,Start Page = {ui.home}<br />{#each log as l}{l}<br />{:else}(no toolbars found... for now){/each}</div>
      {/snippet}
      {@render entry("sk8rmom72", "Junior Member<br>Posts: 4", false, p3)}
      {#snippet p4()}Switch to Firefox. Problem solved. /thread{/snippet}
      {@render entry("fox_fan", "Member<br>Posts: 611", true, p4)}
      {#snippet p5()}just format c: and reinstall windows lol{/snippet}
      {@render entry("xX_l33t_Xx", "Banned", false, p5)}
      {#snippet p6()}That is a nasty infection. Run <button class="linkish" onclick={act.scan}>SpyScrub SE</button>, then uninstall each one from <button class="linkish" onclick={() => openDialog("arp")}>Add or Remove Programs</button>. Scanning only hides them. Post a new log afterwards.{/snippet}
      {@render entry("Mod_Steve", "Moderator<br>Posts: 14,883", true, p6)}
      {#snippet p7()}UPDATE: I ran the scan and it removed everything!!! Thank you so much!!!<br /><br />UPDATE 2: they are back. Also there is a purple monkey now.{/snippet}
      {@render entry("sk8rmom72", "Junior Member<br>Posts: 5", false, p7)}
      {#each ui.forumReplies as r}
        {#snippet body()}{r.text}{/snippet}
        {@render entry(r.who, r.meta, !!r.mod, body)}
      {/each}
    </tbody></table>
    <form class="quickreply" onsubmit={post}>
      <b>Quick Reply</b>
      <textarea class="box" rows="3" bind:value={reply} maxlength="500" aria-label="Quick Reply"></textarea>
      <button class="xpbtn" disabled={!reply.trim()}>Post Quick Reply</button>
    </form>
  </div>
</div>
