<script>
  // A page that is only dancing hamsters, as was the custom.
  const hamster = `<svg viewBox="0 0 40 40"><ellipse cx="20" cy="25" rx="13" ry="11" fill="#e0a060"/><ellipse cx="20" cy="28" rx="8" ry="6" fill="#fbe3c0"/><circle cx="20" cy="14" r="10" fill="#e0a060"/><circle cx="12" cy="7" r="3.5" fill="#e0a060"/><circle cx="28" cy="7" r="3.5" fill="#f4b8b8"/><circle cx="16" cy="13" r="1.6" fill="#000"/><circle cx="24" cy="13" r="1.6" fill="#000"/><ellipse cx="20" cy="18" rx="2" ry="1.3" fill="#c55"/></svg>`;
  let rows = $state(4);
</script>

<div class="ham">
  <div class="ham-title">THE HAMSTER PARTY!!!</div>
  <p>Turn up your speakers!!! (there is no sound, your MIDI plug-in is out of date)</p>
  {#each Array(rows) as _, r}
    <div class="ham-row">{#each Array(12) as _, i}<span class="h" style:animation-delay="{((i + r) % 4) * 0.12}s">{@html hamster}</span>{/each}</div>
  {/each}
  <button class="xpbtn" onclick={() => (rows = Math.min(rows + 2, 30))}>MORE HAMSTERS</button>
  <p class="fine">Hamsters served: {rows * 12} · This page has been forwarded 4,812,339 times</p>
</div>
