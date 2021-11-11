import InfiniteClient from "../client";
import { DirectoryTypes } from "../types";
import recursiveRead from "./recursive-read";

export default class Handler {

    constructor(public client: InfiniteClient, public dirs?: DirectoryTypes) { }

    public addDirs(dirs: DirectoryTypes) {
        if (!dirs) this.dirs = dirs;
        else throw new Error("`dirs` is already defined, and overwrite option is not implemented yet")
    }

    public async loadCommands(dir: string = this.dirs?.commands!) {
        recursiveRead(dir, (err, result) => {
            if (err) throw err;
            result?.forEach(async (path) => {
                const command = (await import(path)).default;
                this.client.commands.set(command.data.name, command)
            })
        })
    }

    public async loadSlashCommands(dir: string = this.dirs?.slashCommands!) {
        recursiveRead(dir, (err, result) => {
            if (err) throw err;
            result?.forEach(async (path) => {
                const command = (await import(path)).default;
                this.client.slashCommands.set(command.data.name, command)
            })
        })
    }

    public async loadEvents(dir: string = this.dirs?.events!) {
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