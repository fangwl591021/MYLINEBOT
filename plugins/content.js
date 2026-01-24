// plugins/content.js
export function ContentPlugin(state) {
  return {
    key: "content_basic",
    slot: "body",

    toFlex() {
      return state.blocks.map(block => {
        // ===== Title =====
        if (block.blockType === "title") {
          return {
            type: "text",
            text: block.text,
            weight: "bold",
            size: block.size,
            align: block.align,
            wrap: true
          };
        }

        // ===== Text =====
        if (block.blockType === "text") {
          return {
            type: "text",
            text: block.text,
            size: block.size,
            align: block.align,
            wrap: block.wrap
          };
        }

        // ===== Image =====
        if (block.blockType === "image") {
          return {
            type: "image",
            url: block.imageUrl,
            size: "full",
            aspectRatio: block.aspectRatio,
            aspectMode: block.aspectMode,
            margin: "md"
          };
        }

        // ===== Divider =====
        if (block.blockType === "divider") {
          return {
            type: "separator",
            margin: block.margin || "md"
          };
        }

        return null;
      }).filter(Boolean);
    }
  };
}
