export function getYouTubeVideoId(url: string): string | null {
  try {
    const u = new URL(url);

    // youtu.be/<id>
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id || null;
    }

    // youtube.com/watch?v=<id>
    const v = u.searchParams.get("v");
    if (v) return v;

    // youtube.com/shorts/<id>
    const shortsMatch = u.pathname.match(/\/shorts\/([^/]+)/);
    if (shortsMatch?.[1]) return shortsMatch[1];

    // youtube.com/embed/<id>
    const embedMatch = u.pathname.match(/\/embed\/([^/]+)/);
    if (embedMatch?.[1]) return embedMatch[1];

    return null;
  } catch {
    return null;
  }
}

export function getYouTubeThumb(videoId: string) {
  // other common options: "mqdefault.jpg", "sddefault.jpg", "maxresdefault.jpg"
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
