<script lang="ts">
    const { url }: { url: string } = $props();

    function getYouTubeVideoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);

    // Case: https://www.youtube.com/watch?v=VIDEOID
    if (parsedUrl.hostname.includes("youtube.com") && parsedUrl.searchParams.has("v")) {
      return parsedUrl.searchParams.get("v");
    }

    // Case: https://youtu.be/VIDEOID
    if (parsedUrl.hostname === "youtu.be") {
      return parsedUrl.pathname.slice(1);
    }

    // Case: https://www.youtube.com/embed/VIDEOID
    if (parsedUrl.pathname.startsWith("/embed/")) {
      return parsedUrl.pathname.split("/")[2];
    }

    // Case: https://www.youtube.com/shorts/VIDEOID
    if (parsedUrl.pathname.startsWith("/shorts/")) {
      return parsedUrl.pathname.split("/")[2];
    }

    return null;
  } catch {
    return null;
  }
}
</script>

<div class="relative m-5 overflow-hidden rounded-2xl shadow-lg aspect-video">
  <iframe
    src={`https://www.youtube.com/embed/${getYouTubeVideoId(url)}`}
    class="absolute inset-0 h-full w-full select-none"
    oncontextmenu={(e) => e.preventDefault()}
    allow=""
    ></iframe>
</div>
