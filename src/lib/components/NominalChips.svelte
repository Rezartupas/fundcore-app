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

  let customInputStr = $state(value > 0 ? value.toLocaleString('id-ID') : '');

  $effect(() => {
    const parsed = parseInt(customInputStr.replace(/\D/g, ''), 10) || 0;
    if (value !== parsed) {
      customInputStr = value > 0 ? value.toLocaleString('id-ID') : '';
    }
  });

  function handlePresetClick(amount: number) {
    value = amount;
    customInputStr = amount.toLocaleString('id-ID');
  }

  function handleCustomInput(e: Event) {
    const target = e.target as HTMLInputElement;
    const raw = target.value.replace(/\D/g, '');
    const num = parseInt(raw, 10) || 0;
    value = num;
    customInputStr = num > 0 ? num.toLocaleString('id-ID') : '';
    target.value = customInputStr;
  }
</script>

<div class="space-y-3">
  <div>
    <span class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
      Pilih Nominal Donasi
    </span>

    <!-- Chips Grid -->
    <div class="grid grid-cols-3 sm:grid-cols-5 gap-2">
      {#each presets as preset}
        {@const isActive = value === preset}
        <button
          type="button"
          onclick={() => handlePresetClick(preset)}
          class="min-h-[44px] py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all flex items-center justify-center text-center active:scale-95 cursor-pointer {isActive
            ? 'shadow-xs font-extrabold border-slate-900'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'}"
          style={isActive
            ? 'background-color: var(--color-accent); color: var(--color-accent-text); border-color: var(--color-accent-text);'
            : ''}
          aria-pressed={isActive}
        >
          Rp {preset.toLocaleString('id-ID')}
        </button>
      {/each}
    </div>
  </div>

  <!-- Custom Input Field with Rp Prefix -->
  <div class="space-y-1.5">
    <label for="custom-nominal-input" class="block text-xs font-semibold text-slate-700">
      Atau Masukkan Nominal Lainnya
    </label>
    <div class="relative min-h-[48px] h-12 rounded-2xl border border-slate-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-900 focus-within:border-transparent transition-all flex items-center">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <span class="text-sm font-bold text-slate-500">Rp</span>
      </div>
      <input
        id="custom-nominal-input"
        type="text"
        inputmode="numeric"
        value={customInputStr}
        oninput={handleCustomInput}
        placeholder="Contoh: 50.000 (min. 1.000)"
        class="block w-full h-full pl-12 pr-4 text-base sm:text-lg font-black text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
      />
    </div>
  </div>

  {#if value < min && value > 0}
    <p class="text-xs text-rose-600 font-semibold" role="alert">
      Minimal donasi adalah Rp {min.toLocaleString('id-ID')}.
    </p>
  {/if}
</div>
