import { Color, ColorSpace, DirectGradient, JoinedGradient, Interpolation } from "colours.js"

export function InfiniteGradient(inverted: boolean = false): DirectGradient {
    const primary = Color.fromHex("#0048FF");
    const secondary = Color.fromHex("#C603FC");

    return new DirectGradient(inverted ? secondary : primary, inverted ? primary : secondary, ColorSpace.RGB, Interpolation.cubic);
}

export function BlueWave(inverted: boolean = false): DirectGradient {
    const blue = Color.fromHex("#0000FF");
    const lightBlue = Color.fromHex("#00B3FF");

    return new DirectGradient(inverted ? lightBlue : blue, inverted ? blue : lightBlue, ColorSpace.HSL, Interpolation.linear, true);
}

export function PinkToPurple(inverted: boolean = false): DirectGradient {
    const pink = Color.fromHex("#FF00EF");
    const purple = Color.fromHex("#B300FF");

    return new DirectGradient(inverted ? purple : pink, inverted ? pink : purple, ColorSpace.HSV, Interpolation.cubic, true);
}