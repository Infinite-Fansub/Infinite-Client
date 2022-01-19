import { Color } from "colours.js/dst";

export interface Emojis {
    emoji?: string;
    errorEmoji?: string;
};

export interface DefaultColors {
    color: Color;
    errorColor: Color;
    gradientPrimary: Color;
    gradientSecondary: Color;
};