// composer.js
export function composeFlexBubble(plugins) {
  const bubble = {
    type: "bubble"
  };

  plugins.forEach(p => {
    const result = p.toFlex();
    if (!result) return;

    // ===== HERO =====
    if (p.slot === "hero") {
      bubble.hero = result;
    }

    // ===== BODY =====
    if (p.slot === "body") {
      bubble.body ??= {
        type: "box",
        layout: "vertical",
        contents: []
      };

      if (Array.isArray(result)) {
        bubble.body.contents.push(...result);
      } else {
        bubble.body.contents.push(result);
      }
    }

    // ===== FOOTER =====
    if (p.slot === "footer") {
      bubble.footer ??= {
        type: "box",
        layout: "vertical",
        contents: []
      };

      bubble.footer.contents.push(result);
    }
  });

  return bubble;
}
