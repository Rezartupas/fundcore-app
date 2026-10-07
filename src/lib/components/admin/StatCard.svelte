<script lang="ts">
  let { title, value, subtitle, icon, highlight = false } = $props<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: any;
    highlight?: boolean;
  }>();

  let Icon = $derived(icon);
</script>

<div class="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3 flex flex-col justify-between {highlight ? 'ring-2 ring-blue-600/20' : ''}">
  <div class="flex items-start justify-between gap-4">
    <span class="text-xs font-bold text-slate-500 uppercase tracking-wider block">
      {title}
    </span>
    <div class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 shrink-0">
      <Icon class="w-5 h-5 text-blue-900" />
    </div>
  </div>

  <div>
    <h3 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
      {value}
    </h3>
    {#if subtitle}
      <p class="text-xs text-slate-500 font-medium mt-1">
        {subtitle}
      </p>
    {/if}
  </div>
</div>
