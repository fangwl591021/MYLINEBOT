// app.js
import { composeFlexBubble } from "./composer.js";
import { HeroPlugin } from "./plugins/hero.js";
import { ContentPlugin } from "./plugins/content.js";
import { CTAPlugin } from "./plugins/cta.js";

const plugins = [
  HeroPlugin({
    mode: "image",
    aspectRatio: "16:9",
    imageUrl: "https://via.placeholder.com/800x450",
    link: "https://example.com"
  }),

  ContentPlugin({
    blocks: [
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
    ]
  }),

  CTAPlugin({
    buttons: [
      {
        label: "立即了解",
        style: "primary",
        actionType: "uri",
        actionValue: "https://example.com",
        enabled: true
      },
      {
        label: "詢問 AI",
        style: "secondary",
        actionType: "postback",
        actionValue: "action=ask_ai",
        enabled: true
      }
    ]
  })
];

const bubble = composeFlexBubble(plugins);

document.getElementById("output").textContent =
  JSON.stringify({ type: "flex", altText: "Flex Preview", contents: bubble }, null, 2);
