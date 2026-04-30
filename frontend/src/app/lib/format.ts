/**
 * Shared formatting utilities — satu tempat, semua file pakai ini.
 */

/** Format angka ke Rupiah Indonesia, cth: 850000 → "Rp 850.000" */
export function formatRupiah(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}

/** Format singkat: 1_500_000 → "1.5jt", 850_000 → "850rb" */
export function formatK(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}rb`;
  return `${n}`;
}
