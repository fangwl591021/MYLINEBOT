// composer.js
export function composeFlexBubble(plugins) {
  const bubble = {
    type: "bubble"
  };

  plugins.forEach(p => {
    const result = p.toFlex();

    if (!result) return;

    if (p.slot === "hero") {
      bubble.hero = result;
    }

    if (p.slot === "body") {
      bubble.body ??= { type: "box", layout: "vertical", contents: [] };
      bubble.body.contents.push(result);
    }

    if (p.slot === "footer") {
      bubble.footer ??= { type: "box", layout: "vertical", contents: [] };
      bubble.footer.contents.push(result);
    }
  });

  return bubble;
}
