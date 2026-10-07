export interface TemplateVariables {
  nama: string;
  nominal: number | string;
  campaign: string;
  link_bayar?: string;
  batas_bayar?: string;
  link_campaign?: string;
  nama_cs?: string;
  nama_situs?: string;
}

export function interpolateTemplate(template: string, vars: TemplateVariables): string {
  let result = template;

  const formattedNominal =
    typeof vars.nominal === 'number'
      ? vars.nominal.toLocaleString('id-ID')
      : String(vars.nominal);

  const replacements: Record<string, string> = {
    '{nama}': vars.nama || 'Orang Baik',
    '{nominal}': formattedNominal,
    '{campaign}': vars.campaign || 'Program Kebaikan',
    '{link_bayar}': vars.link_bayar || '',
    '{batas_bayar}': vars.batas_bayar || '24 jam ke depan',
    '{link_campaign}': vars.link_campaign || '',
    '{nama_cs}': vars.nama_cs || 'Tim FundCore',
    '{nama_situs}': vars.nama_situs || 'FundCore'
  };

  for (const [key, val] of Object.entries(replacements)) {
    result = result.replaceAll(key, val);
  }

  return result;
}
