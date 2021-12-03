import { Color, ColorSpace, DirectGradient, JoinedGradient, colorConsole, Interpolation } from "colours.js";
import { DefaultColors, Emojis } from "../types";
import { getCurrentMemoryHeap } from "./memory-heap"

class Logger {
    private emoji: string = "🌌";
    private errorEmoji: string = "❌";
    private defaultColors: DefaultColors = {
        color: Color.fromHex("#fc036b"),
        errorColor: Color.RED,
        gradientPrimary: Color.fromHex("#0048ff"),
        gradientSecondary: Color.fromHex("#c603fc")
    };

    setEmojis(emojis: Emojis) {
        if (emojis.emoji) this.emoji = emojis.emoji;
        if (emojis.errorEmoji) this.errorEmoji = emojis.errorEmoji;
    };

    date() {
        return colorConsole.uniform(colorConsole.uniform(`[${new Date().toLocaleTimeString()}]`, Color.WHITE, true), Color.BLACK)
    };

    defaultPrint(log: string, showMemory: boolean = false) {
        const forwardsGradient = new DirectGradient(this.defaultColors.gradientPrimary, this.defaultColors.gradientSecondary, ColorSpace.RGB, Interpolation.cubic)
        const backwardsGradient = new DirectGradient(this.defaultColors.gradientSecondary, this.defaultColors.gradientPrimary, ColorSpace.RGB, Interpolation.cubic)

        return showMemory
            ? console.log(`${colorConsole.gradient(getCurrentMemoryHeap(), forwardsGradient)} ${this.date()} ${this.emoji} ${colorConsole.gradient(log, backwardsGradient)}`)
            : console.log(`${this.date()} ${this.emoji} ${colorConsole.uniform(log, this.defaultColors.color)}`)
    };

    error(log: string, showMemory: boolean = false) {
        return showMemory
            ? console.error(`${colorConsole.uniform(getCurrentMemoryHeap(), this.defaultColors.errorColor)} ${this.date()} ${this.errorEmoji} ${colorConsole.uniform(log, this.defaultColors.errorColor)}`)
            : console.error(`${this.date()} ${this.errorEmoji} ${colorConsole.uniform(log, this.defaultColors.errorColor)}`)
    }
}

const log = new Logger()
log.defaultPrint("Try me bitch", true)
log.defaultPrint("Try me bitch")
log.error("Fail bitch", true)
log.error("Fail bitch")