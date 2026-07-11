/** Accepts a full YouTube URL (watch, youtu.be, embed, shorts, v/) or a bare 11-char ID. */
export function extractYouTubeId(input: string): string {
  const trimmed = input.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/|v\/))([A-Za-z0-9_-]{11})/);
  return match ? match[1] : trimmed;
}

export function isValidYouTubeId(value: string): boolean {
  return /^[A-Za-z0-9_-]{11}$/.test(value);
}
