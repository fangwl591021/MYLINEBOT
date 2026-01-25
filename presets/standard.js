// /presets/standard.js
import { HeroPlugin } from "../plugins/hero.js";
import { ContentPlugin } from "../plugins/content.js";
import { CTAPlugin } from "../plugins/cta.js";

export function standardPreset(state) {
  return [
    HeroPlugin(state.hero),
    ContentPlugin(state.content),
    CTAPlugin(state.cta)
  ];
}
