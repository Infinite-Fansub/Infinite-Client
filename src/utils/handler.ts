import InfiniteClient from "../client";
import recursiveRead from "./recursive-read";

export default class Handler {

    constructor(public client: InfiniteClient, public dirs: { commands?: string, slashCommands?: string, events?: string }) { }

    public async loadCommands(dir: string = this.dirs.commands!) {
        recursiveRead(dir, (err, result) => {
            if (err) throw err;
            result?.forEach(async (path) => {
                const command = (await import(path)).default;
                this.client.commands.set(command.data.name, command)
            })
        })
    }

    public async loadSlashCommands(dir: string = this.dirs.slashCommands!) {
        recursiveRead(dir, (err, result) => {
            if (err) throw err;
            result?.forEach(async (path) => {
                const command = (await import(path)).default;
                this.client.slashCommands.set(command.data.name, command)
            })
        })
    }

    public async loadEvents(dir: string = this.dirs.events!) {
        recursiveRead(dir, (err, result) => {
            if (err) throw err;
            result?.forEach(async (path) => {
                const event = (await import(path)).default;
                this.client.events.set(event.event, event)
                this.client[event.type as "on" | "once"](event.event, (...args) => {
                    if (!event.enabled) return;
                    event.run(...args)
                })
            })
        })
    }
}