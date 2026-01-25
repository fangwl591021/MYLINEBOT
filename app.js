// app.js
import { composeFlexBubble } from "./composer.js";
import { standardPreset } from "./presets/standard.js";

const output = document.getElementById("output");
const genBtn = document.getElementById("gen");

// 表單
const heroImage = document.getElementById("heroImage");
const titleText = document.getElementById("titleText");
const bodyText  = document.getElementById("bodyText");
const ctaLabel  = document.getElementById("ctaLabel");
const ctaLink   = document.getElementById("ctaLink");

// ===== 後台狀態（只管資料）=====
const state = {
  type: "standard",
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

// ===== 綁定後台操作 =====
genBtn.onclick = () => {
  state.hero.imageUrl = heroImage.value || "https://via.placeholder.com/800x450";
  state.hero.link = ctaLink.value || "https://example.com";

  state.content.blocks = [
    {
      blockType: "title",
      text: titleText.value || "康立 AI 元年",
      size: "lg",
      align: "start"
    },
    {
      blockType: "text",
      text: bodyText.value || "從一張電子名片開始，打造你的 AI 商務分身。",
      size: "md",
      align: "start",
      wrap: true
    }
  ];

  state.cta.buttons = [
    {
      label: ctaLabel.value || "立即了解",
      style: "primary",
      actionType: "uri",
      actionValue: ctaLink.value || "https://example.com",
      enabled: true
    }
  ];

  render();
};

// ===== 組裝 + 預覽（唯一出口）=====
function render() {
  const plugins = standardPreset(state);
  const bubble = composeFlexBubble(plugins);

  output.textContent = JSON.stringify(
    { type: "flex", altText: "Flex Preview", contents: bubble },
    null,
    2
  );
}
