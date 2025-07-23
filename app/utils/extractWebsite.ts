export function extractWebsite(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, "");
  } catch (e) {
    return ""; // Invalid URL
  }
}
