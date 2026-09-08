export async function shareStudio(title: string, url = window.location.href): Promise<string> {
  try {
    if (navigator.share) { await navigator.share({ title, url }); return "Shared."; }
    if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(url); return "Link copied."; }
    return `Copy this link: ${url}`;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") return "Sharing cancelled.";
    return `Copy this link: ${url}`;
  }
}

export async function copyStudioLink(url: string): Promise<string> {
  try { if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(url); return "Link copied."; } }
  catch { /* Provide a selectable link when clipboard access is denied. */ }
  return `Copy this link: ${url}`;
}
