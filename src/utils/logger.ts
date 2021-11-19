import { Color } from "colours.js"

class logger {

    private emoji: string = "🌌";
    private errorEmoji: string = "❌";
    public language: string = "EN";

    constructor() {
        this.color = colors.color("#fc036b");
        this.gradPrim = colors.color("#0048ff");
        this.gradLast = colors.color("#c603fc");
        this.errorColor = colors.red;
    }
    setColor(color) {
        return this.color = color
    }
    setEmoji(emoji: string) {
        return this.emoji = emoji
    }
    time() {
        return colors.text(colors.text(`[${new Date().toLocaleTimeString()}]`, colors.white, true), colors.black)
    };
    defaultPrint(log: string, mem = false) {
        if (mem) {
            console.log(`${colors.customGrad(memory(), this.gradPrim, this.gradLast, colors.rgb, colors.cubic)} ${this.time()} ${this.emoji} ${colors.customGrad(log, this.gradLast, this.gradPrim, colors.rgb, colors.cubic)} ${colors.reset}`)
        } else {
            console.log(`${this.time()} ${this.emoji} ${colors.text(log, this.color)}`)
        }

    };
    costumPrint(log: string) {
        return console.log(log)
    };
    error(log: string, mem = true) {
        if (mem) {
            console.error(`${colors.text(memory(), this.errorColor)} ${this.time()} ${this.errorEmoji} ${colors.text(log, this.errorColor)}`)
        } else {
            console.error(`${this.time()} ${this.errorEmoji} ${colors.text(log, this.errorColor)}`)
        }
    };
}