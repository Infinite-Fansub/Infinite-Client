import { InfiniteClient } from "../client";
import { DirectoryTypes } from "../types";
import recursiveRead from "./recursive-read";

export default class Handler {

    constructor(public client: InfiniteClient, public dirs: DirectoryTypes = {}) { }

    public addDirs(dirs: DirectoryTypes) {
        this.dirs.commands = dirs.commands
        this.dirs.slashCommands = dirs.slashCommands
        this.dirs.events = dirs.events
    }

    public loadCommands(dir: string = this.dirs?.commands!) {
        recursiveRead(dir)
            .forEach(async (path) => {
                const command = (await import(path)).default;
                this.client.commands.set(command.data.name, command)
            })
    }

    public loadSlashCommands(dir: string = this.dirs?.slashCommands!) {
        recursiveRead(dir)
            .forEach(async (path) => {
                const command = (await import(path)).default;
                this.client.slashCommands.set(command.data.name, command)
            })
    }

    public loadEvents(dir: string = this.dirs?.events!) {
        recursiveRead(dir)
            .forEach(async (path) => {
                const event = (await import(path)).default;
                this.client.events.set(event.event, event)
                this.client[event.type as "on" | "once"](event.event, (...args) => {
                    if (!event.enabled) return;
                    event.run(...args)
                })
            })
    }
}