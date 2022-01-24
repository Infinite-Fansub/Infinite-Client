import { Color, ColorSpace, DirectGradient, JoinedGradient, colorConsole, Interpolation } from "colours.js"

export function fire(message: string, isBackground: boolean = false, inverted: boolean = false): string {
    const fire = new JoinedGradient(inverted ? Color.YELLOW : Color.RED,
        {
            color: Color.ORANGE,
            interpolation: inverted ? Interpolation.dec_quadratic : Interpolation.inc_quadratic,
            length: inverted ? 1 : 2
        },
        {
            color: inverted ? Color.RED : Color.YELLOW,
            space: ColorSpace.HSV
        }
    );

    return isBackground
        ? colorConsole.gradient(colorConsole.uniform(message, Color.BLACK), fire, true)
        : colorConsole.gradient(message, fire);
}

export function ice(message: string, isBackground: boolean = false, inverted: boolean = false): string {
    const ice = new DirectGradient(
        inverted ? Color.SILVER : Color.fromHex("#088fff"),
        inverted ? Color.fromHex("#088fff") : Color.SILVER,
        ColorSpace.RGB,
        inverted ? Interpolation.dec_quadratic : Interpolation.inc_quadratic
    );

    return isBackground
        ? colorConsole.gradient(colorConsole.uniform(message, Color.BLACK), ice, true)
        : colorConsole.gradient(message, ice);
}
export function rainbow(message: string, isBackground: boolean = false): string {
    const rainbow = new DirectGradient(Color.RED, Color.RED, ColorSpace.HSV, Interpolation.linear, true);

    return isBackground
        ? colorConsole.gradient(colorConsole.uniform(message, Color.BLACK), rainbow, true)
        : colorConsole.gradient(message, rainbow);
}
export function zebra(message: string, isBackground: boolean = false): string {
    return isBackground
        ? colorConsole.cyclicUniform(colorConsole.cyclicUniform(message, 1, true, Color.WHITE, Color.BLACK), 1, false, Color.BLACK, Color.WHITE)
        : colorConsole.cyclicUniform(message, 1, false, Color.WHITE, Color.BLACK);
}