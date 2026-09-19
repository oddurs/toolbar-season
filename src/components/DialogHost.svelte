<script>
  import { ui } from "../lib/state.svelte.js";
  import { closeDialog } from "../lib/actions.js";
  import Alert from "./dialogs/Alert.svelte";
  import ActiveX from "./dialogs/ActiveX.svelte";
  import Pop from "./dialogs/Pop.svelte";
  import Scan from "./dialogs/Scan.svelte";
  import Addons from "./dialogs/Addons.svelte";
  import Options from "./dialogs/Options.svelte";
  import About from "./dialogs/About.svelte";
  import Why from "./dialogs/Why.svelte";
  import Crash from "./dialogs/Crash.svelte";
  import Source from "./dialogs/Source.svelte";
  import Smiley from "./dialogs/Smiley.svelte";
  import DialUp from "./dialogs/DialUp.svelte";
  import Arp from "./dialogs/Arp.svelte";
  import Uninstall from "./dialogs/Uninstall.svelte";

  const KINDS = { alert: Alert, activex: ActiveX, pop: Pop, scan: Scan, addons: Addons, options: Options, about: About, why: Why, crash: Crash, source: Source, smiley: Smiley, dialup: DialUp, arp: Arp, uninstall: Uninstall };
</script>

{#each ui.dialogs as dlg (dlg.id)}
  {@const Kind = KINDS[dlg.kind]}
  <Kind {...dlg.props} {dlg} close={why => closeDialog(dlg.id, why)} />
{/each}
