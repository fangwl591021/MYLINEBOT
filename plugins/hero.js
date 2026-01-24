// plugins/hero.js
export function HeroPlugin(state) {
  return {
    key: "hero_basic",
    slot: "hero",

    toFlex() {
      if (state.mode === "none") return null;

      if (state.mode === "image") {
        return {
          type: "image",
          url: state.imageUrl,
          size: "full",
          aspectRatio: state.aspectRatio,
          aspectMode: "cover",
          action: state.link
            ? { type: "uri", uri: state.link }
            : undefined
        };
      }

      if (state.mode === "video") {
        return {
          type: "video",
          url: state.videoUrl,
          previewUrl: state.previewUrl,
          aspectRatio: state.aspectRatio,
          altContent: {
            type: "image",
            url: state.previewUrl,
            size: "full",
            aspectRatio: state.aspectRatio,
            aspectMode: "cover",
            backgroundColor: "#000000"
          }
        };
      }
    }
  };
}
