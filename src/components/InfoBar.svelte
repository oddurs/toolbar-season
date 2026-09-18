<script>
  import { ui } from "../lib/state.svelte.js";
  import { I } from "../lib/icons.js";

  const onclick = e => ui.info.action?.(e);
  const onkeydown = e => (e.key === "Enter" || e.key === " ") && ui.info.action?.(e);
  const dismiss = e => { e.stopPropagation(); ui.info = null; };
</script>

{#if ui.info}
  <div class="infobar" role="button" tabindex="0" {onclick} {onkeydown}>
    {@html I[ui.info.icon]}
    <span>{ui.info.text}</span>
    <button class="ib-x" aria-label="Close Information Bar" onclick={dismiss}>×</button>
  </div>
{/if}
