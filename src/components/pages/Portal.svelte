<script>
  import Link from "../Link.svelte";
  import { KEV_URL, FORUM_URL } from "../../lib/state.svelte.js";
  import { go, openPop } from "../../lib/actions.js";
  let q = $state("");
</script>

<div class="portal">
  <div class="portal-head">
    <b>Home Search Portal</b>
    <span> · Your homepage was <u>automatically upgraded</u> for a better Internet experience!</span>
  </div>
  <div class="portal-body">
    <form onsubmit={e => { e.preventDefault(); go("search:" + q); }}>
      <input bind:value={q} aria-label="Search the Internet" /> <button>Search the Internet!</button>
    </form>
    <table cellpadding="4"><tbody><tr>
      <td class="hot">
        <b style="color:#c00">HOT Categories</b><br />
        <Link to="search:Casino">Online Casino</Link> · <Link to="search:Ringtones">Ringtones</Link> · <Link to="search:Mortgage">Mortgage Rates</Link><br />
        <Link to="search:Smileys">Free Smileys</Link> · <Link to="search:Screensavers">Free Screensavers</Link> · <Link to="search:Dating">Singles</Link>
      </td>
      <td class="popular">
        <b style="color:#036">Popular Searches</b><br />
        <Link to={FORUM_URL}>how to remove toolbars</Link><br />
        <Link to="search:why is my computer slow">why is my computer slow</Link><br />
        <Link to="search:homepage keeps changing">homepage keeps changing</Link>
      </td>
      <td class="winner" onclick={() => openPop("winner")}>
        <b class="blink" style="color:#c00">CONGRATULATIONS!!</b><br />You are our <b>1,000,000th</b> visitor!<br /><u style="color:#00c">Click here to claim</u>
      </td>
    </tr></tbody></table>
    <p>Also visit: <Link to={KEV_URL}>Kev's Awesome Homepage</Link> · <Link to={FORUM_URL}>TechGuyz Forums</Link> · <Link to="http://www.windowsupdate.fake/">Windows Update</Link> · <Link to="about:blank">about:blank</Link></p>
    <p class="fine">To change your homepage, go to Tools › Internet Options. (It won't work.) © 2005 Home Search Portal Ltd., a subsidiary of a subsidiary.</p>
  </div>
</div>
