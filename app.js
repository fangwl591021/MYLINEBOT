// app.js
import { composeFlexBubble } from "./composer.js";
import { HeroPlugin } from "./plugins/hero.js";
import { ContentPlugin } from "./plugins/content.js";
import { CTAPlugin } from "./plugins/cta.js";

const output = document.getElementById("output");

// ===== 後台狀態（現在是記憶體，之後可存）=====
const state = {
  hero: {
    mode: "image",
    aspectRatio: "16:9",
    imageUrl: "",
    link: ""
  },
  content: {
    blocks: []
  },
  cta: {
    buttons: []
  }
};

// ===== 綁定後台操作（最小可用）=====
document.getElementById("gen").onclick = () => {
  // ⚠️ 這裡先寫死，下一步再接 UI
  state.hero.imageUrl = "https://via.placeholder.com/800x450";
  state.hero.link = "https://example.com";

  state.content.blocks = [
    {
      blockType: "title",
      text: "康立 AI 元年",
      size: "lg",
      align: "start"
    },
    {
      blockType: "text",
      text: "從一張電子名片開始，打造你的 AI 商務分身。",
      size: "md",
      align: "start",
      wrap: true
    }
  ];

  state.cta.buttons = [
    {
      label: "立即了解",
      style: "primary",
      actionType: "uri",
      actionValue: "https://example.com",
      enabled: true
    }
  ];

  render();
};

// ===== 組裝 + 預覽 =====
function render() {
  const plugins = [];

  if (state.hero) plugins.push(HeroPlugin(state.hero));
  if (state.content) plugins.push(ContentPlugin(state.content));
  if (state.cta) plugins.push(CTAPlugin(state.cta));

  const bubble = composeFlexBubble(plugins);

  output.textContent = JSON.stringify(
    { type: "flex", altText: "Flex Preview", contents: bubble },
    null,
    2
  );
}
