import { Color, colorConsole } from "colours.js";
import { DefaultColors, Emojis } from "../types";
import { getCurrentMemoryHeap } from "./memory-heap";
import { InfiniteGradient } from "./colors/infinite"

class Logger {
    private emoji: string = "💫";
    private errorEmoji: string = "❌";
    private defaultColors: DefaultColors = {
        color: Color.fromHex("#FF00EF"),//Color.fromHex("#fc036b"),
        errorColor: Color.RED,
        gradientPrimary: Color.fromHex("#0048ff"),
        gradientSecondary: Color.fromHex("#c603fc")
    };

    public setEmojis(emojis: Emojis): void {
        if (emojis.emoji) this.emoji = emojis.emoji;
        if (emojis.errorEmoji) this.errorEmoji = emojis.errorEmoji;
    };

    public date(): string {
        return colorConsole.uniform(colorConsole.uniform(`[${new Date().toLocaleTimeString()}]`, Color.WHITE, true), Color.BLACK)
    };

    public infinitePrint(log: string, showMemory: boolean = true): void {

        return showMemory
            ? console.log(`${colorConsole.gradient(getCurrentMemoryHeap(), InfiniteGradient())} ${this.date()} ${this.emoji} ${colorConsole.gradient(log, InfiniteGradient(true))}`)
            : console.log(`${this.date()} ${this.emoji} ${colorConsole.gradient(log, InfiniteGradient())}`)
    };

    public defaultPrint(log: string, showMemory: boolean = true): void {
        return showMemory
            ? console.log(`${colorConsole.uniform(getCurrentMemoryHeap(), this.defaultColors.color)} ${this.date()} ${this.emoji} ${colorConsole.uniform(log, this.defaultColors.color)}`)
            : console.log(`${this.date()} ${this.emoji} ${colorConsole.uniform(log, this.defaultColors.color)}`)
    }

    public error(log: string, showMemory: boolean = true): void {
        return showMemory
            ? console.error(`${colorConsole.uniform(getCurrentMemoryHeap(), this.defaultColors.errorColor)} ${this.date()} ${this.errorEmoji} ${colorConsole.uniform(log, this.defaultColors.errorColor)}`)
            : console.error(`${this.date()} ${this.errorEmoji} ${colorConsole.uniform(log, this.defaultColors.errorColor)}`)
    }
}

export const logger = new Logger()