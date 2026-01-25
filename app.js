// app.js
import { composeFlexBubble } from "./composer.js";
import { standardPreset } from "./presets/standard.js";

const output = document.getElementById("output");
const genBtn = document.getElementById("gen");

// ===== 後台狀態（只管資料，不管結構）=====
const state = {
  type: "standard", // 之後可切換 preset
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
genBtn.onclick = () => {
  // ⚠️ 目前先寫死，之後再接 UI
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

// ===== 組裝 + 預覽（唯一出口）=====
function render() {
  let plugins = [];

  switch (state.type) {
    case "standard":
      plugins = standardPreset(state);
      break;

    default:
      console.error("Unknown preset type:", state.type);
      return;
  }

  const bubble = composeFlexBubble(plugins);

  output.textContent = JSON.stringify(
    {
      type: "flex",
      altText: "Flex Preview",
      contents: bubble
    },
    null,
    2
  );
}
