export function formatRp(value) {
  const num = Number(value) || 0;
  if (!num) return "Rp 0";
  if (Math.abs(num) >= 1_000_000) {
    return `Rp ${Math.round(num / 1_000_000).toLocaleString("id-ID")}jt`;
  }
  if (Math.abs(num) >= 1_000) {
    return `Rp ${Math.round(num / 1_000).toLocaleString("id-ID")}rb`;
  }
  return `Rp ${num.toLocaleString("id-ID")}`;
}

export function formatRpFull(value) {
  return `Rp ${(Number(value) || 0).toLocaleString("id-ID")}`;
}

export function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
