export function getYoutubeID(url: string) {
  let id: string | null | undefined;

  const patterns = [
    /youtu\.be\/([^#\&\?]{11})/, // youtu.be/<id>
    /\?v=([^#\&\?]{11})/, // ?v=<id>
    /\&v=([^#\&\?]{11})/, // &v=<id>
    /embed\/([^#\&\?]{11})/, // embed/<id>
    /\/v\/([^#\&\?]{11})/, // /v/<id>
  ];

  // If any pattern matches, return the ID
  patterns.forEach((pattern) => {
    if (pattern.test(url)) {
      const results = pattern.exec(url);
      id = results?.length ? results[1] : null;
    }
  });

  return id;
}
