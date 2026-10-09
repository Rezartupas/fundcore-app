<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import BottomNav from '$lib/components/BottomNav.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let { data, children } = $props();
</script>

<div class="min-h-screen bg-slate-200">
  <div class="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-white shadow-xl">
    <Header settings={data.settings} />
    <div class="flex-1">{@render children()}</div>
    <Footer settings={data.settings} />
    <BottomNav />
  </div>
</div>
