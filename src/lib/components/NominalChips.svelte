<script lang="ts">
  let {
    value = $bindable(50000),
    min = 1000,
    presets = [10000, 25000, 50000, 100000, 250000]
  } = $props<{
    value: number;
    min?: number;
    presets?: number[];
  }>();

  let customInputStr = $state(value.toLocaleString('id-ID'));

  function handlePresetClick(amount: number) {
    value = amount;
    customInputStr = amount.toLocaleString('id-ID');
  }

  function handleCustomInput(e: Event) {
    const raw = (e.target as HTMLInputElement).value.replace(/\D/g, '');
    const num = parseInt(raw, 10) || 0;
    value = num;
    customInputStr = num > 0 ? num.toLocaleString('id-ID') : '';
  }
</script>

<div class="space-y-3">
  <label for="custom-nominal-input" class="block text-xs font-bold text-slate-700 uppercase tracking-wider">
    Pilih Nominal Donasi
  </label>

  <!-- Chips Grid -->
  <div class="grid grid-cols-3 sm:grid-cols-5 gap-2">
    {#each presets as preset}
      <button
        type="button"
        onclick={() => handlePresetClick(preset)}
        class="py-3 px-2 rounded-xl text-xs sm:text-sm font-bold border transition-all text-center active:scale-95 {value === preset ? 'shadow-xs border-amber-500' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}"
        style={value === preset ? 'background-color: var(--color-accent); color: var(--color-accent-text);' : ''}
      >
        Rp {preset.toLocaleString('id-ID')}
      </button>
    {/each}
  </div>

  <!-- Custom Input Field with Rp Prefix -->
  <div class="relative rounded-2xl border border-slate-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-900 focus-within:border-transparent transition-all">
    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <span class="text-sm font-bold text-slate-400">Rp</span>
    </div>
    <input
      id="custom-nominal-input"
      type="text"
      inputmode="numeric"
      value={customInputStr}
      oninput={handleCustomInput}
      placeholder="Nominal lainnya (min. 1.000)"
      class="block w-full pl-12 pr-4 py-3.5 text-base sm:text-lg font-black text-slate-900 placeholder-slate-400 focus:outline-hidden"
    />
  </div>

  {#if value < min && value > 0}
    <p class="text-xs text-rose-600 font-medium">
      Minimal donasi adalah Rp {min.toLocaleString('id-ID')}.
    </p>
  {/if}
</div>
