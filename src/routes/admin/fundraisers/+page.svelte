<script lang="ts">
  import { UserCheck, FileText, CheckCircle2, XCircle, Shield } from 'lucide-svelte';

  let { data } = $props();
</script>

<div class="space-y-6 max-w-7xl mx-auto">
  <div>
    <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
      Verifikasi Penggalang Dana (Fundraiser)
    </h1>
    <p class="text-xs sm:text-sm text-slate-500 mt-1">
      Tinjau dokumen identitas dan latar belakang pemohon sebelum diizinkan membuat campaign mandiri.
    </p>
  </div>

  <div class="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200/60">
          <tr>
            <th class="py-3.5 px-4">Nama Pemohon</th>
            <th class="py-3.5 px-4">Nomor KTP / NIK</th>
            <th class="py-3.5 px-4">Tujuan / Alasan Pengajuan</th>
            <th class="py-3.5 px-4">Dokumen Pendukung</th>
            <th class="py-3.5 px-4">Status</th>
            <th class="py-3.5 px-4 text-right">Keputusan</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          {#each data.applications as app}
            <tr class="hover:bg-slate-50/60 transition-colors">
              <td class="py-4 px-4 font-bold text-slate-900">
                {app.applicantName}
              </td>

              <td class="py-4 px-4 font-mono text-slate-600">
                {app.idCardNumber}
              </td>

              <td class="py-4 px-4 text-slate-700 max-w-xs leading-normal">
                {app.reason}
              </td>

              <td class="py-4 px-4">
                <a
                  href={app.documentUrl}
                  target="_blank"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 font-semibold hover:bg-blue-100 transition-colors"
                >
                  <FileText class="w-3.5 h-3.5" />
                  Lihat Berkas
                </a>
              </td>

              <td class="py-4 px-4">
                {#if app.status === 'pending'}
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                    Menunggu Review
                  </span>
                {:else if app.status === 'approved'}
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Disetujui
                  </span>
                {:else}
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200">
                    Ditolak
                  </span>
                {/if}
              </td>

              <td class="py-4 px-4 text-right">
                {#if app.status === 'pending'}
                  <div class="flex items-center justify-end gap-2">
                    <form method="POST" action="?/review" class="inline">
                      <input type="hidden" name="id" value={app.id} />
                      <input type="hidden" name="status" value="approved" />
                      <button
                        type="submit"
                        class="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                      >
                        Setujui
                      </button>
                    </form>

                    <form method="POST" action="?/review" class="inline">
                      <input type="hidden" name="id" value={app.id} />
                      <input type="hidden" name="status" value="rejected" />
                      <button
                        type="submit"
                        class="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      >
                        Tolak
                      </button>
                    </form>
                  </div>
                {:else}
                  <span class="text-slate-400 font-medium">Selesai Ditinjau</span>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
