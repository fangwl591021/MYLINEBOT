// plugins/cta.js
export function CTAPlugin(state) {
  return {
    key: "cta_basic",
    slot: "footer",

    toFlex() {
      return {
        type: "box",
        layout: "vertical",
        contents: state.buttons
          .filter(b => b.enabled)
          .map(btn => ({
            type: "button",
            style: btn.style,
            action: buildAction(btn)
          }))
      };
    }
  };
}

function buildAction(btn) {
  if (btn.actionType === "uri") {
    return { type: "uri", label: btn.label, uri: btn.actionValue };
  }

  if (btn.actionType === "liff") {
    return { type: "uri", label: btn.label, uri: btn.actionValue };
  }

  if (btn.actionType === "postback") {
    return {
      type: "postback",
      label: btn.label,
      data: btn.actionValue
    };
  }

  return { type: "message", label: btn.label, text: btn.label };
}
