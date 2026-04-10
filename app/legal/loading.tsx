// Override the global loading.tsx for legal pages — they have no async data
// so the global spinner should never show here.
export default function LegalLoading() {
  return null;
}
