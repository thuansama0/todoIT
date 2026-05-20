/** Local file or content URI from ImagePicker — not a remote https URL. */
export function isLocalPickedImageUri(uri: string): boolean {
  const u = uri.trim().toLowerCase()
  if (!u) return false
  if (u.startsWith("http://") || u.startsWith("https://")) return false
  if (u.startsWith("data:")) return false
  return true
}
