import { defaultConfig } from "@tamagui/config/v4";
import { createTamagui, createTokens } from "tamagui";

// custom styles
const customTokens = createTokens({
  color: {
    purple1: "#5741D9",
    purple2: "#654ED9",
    purple3: "#735BD9",
    purple4: "#8169D9",
    purple5: "#8F77D9",
    purple6: "#9D85D9",
    purple7: "#AB93D9",
    purple8: "#B9A1D9",
    purple9: "#C7AFD9",
    purple10: "#D5BDD9",
    purple11: "#E3CBD9",
    purple12: "#F1D9D9",
    purple13: "#FFE7D9",
    purple14: "#FFF5D9",
    purple15: "#FFFFD9",
    purple16: "#FFFFD9",
    purple17: "#FFFFD9",
  },
  radius: defaultConfig.tokens.radius,
  zIndex: defaultConfig.tokens.zIndex,
  space: defaultConfig.tokens.space,
  size: defaultConfig.tokens.size,
});

const baseTheme = defaultConfig.themes.light_blue;

const config = {
  ...defaultConfig,
  tokens: customTokens,
  theme: {
    ...defaultConfig.themes,
    // override the base theme
    purple: {
      ...baseTheme,
      background: "#904BFF",
      backgroundHover: "#904BFF",
      backgroundPress: "#904BFF",
      backgroundFocus: "#904BFF",
      backgroundTransparent: "#904BFF",
      backgroundTransparentHover: "#904BFF",
      backgroundTransparentPress: "#904BFF",
      color: "#FFFFFF",
      borderColor: "#904BFF",
      borderColorHover: "#904BFF",
      borderColorPress: "#904BFF",
      borderColorFocus: "#904BFF",
      borderColorTransparent: "#904BFF",
      borderColorTransparentHover: "#904BFF",
      borderColorTransparentPress: "#904BFF",
    },
  },
};
export const tamaguiConfig = createTamagui(config);

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}
