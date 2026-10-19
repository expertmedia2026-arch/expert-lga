const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function createLgaId() {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  const suffix = Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join(
    "",
  );
  return `LGA-${suffix}`;
}

export function isLgaId(value: string) {
  return /^LGA-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/.test(value);
}
