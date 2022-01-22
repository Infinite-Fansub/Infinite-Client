import { Routes, RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v9";
import { Client, Interaction, Message } from "discord.js";
import { REST } from "@discordjs/rest";
import { connect } from "mongoose";
import { Event, ICommand, ISlashCommand, IClientOptions, DatabaseTypes } from "./typings/index";
import Handler from "./utils/handler";

export class InfiniteClient extends Client {

    private djsRest: REST;
    declare public options: IClientOptions;
    public prefix: string = "!";
    public commands: Map<string, ICommand> = new Map();
    public slashCommands: Map<string, ISlashCommand> = new Map();
    public events: Map<string, Event<any>> = new Map();
    public handler: Handler = new Handler(this);

    constructor(token: string, options: IClientOptions) {
        super(options);
        this.token = token;
        this.login(this.token).then(() => {
            this.handler?.addDirs({
                commands: this.options.dirs?.commands,
                slashCommands: this.options.dirs?.slashCommands,
                events: this.options.dirs?.events
            });

            this.handler.dirs.slashCommands && this.handler.loadSlashCommands();
            this.handler.dirs.commands && this.handler.loadCommands();
            this.handler.dirs.events && this.handler.loadEvents();
        })

        this.djsRest = new REST({ version: "9" }).setToken(this.token);

        this.once("ready", this.registerSlashCommands);
        this.on("interactionCreate", async (interaction) => this.onInteraction(interaction));
        this.on("messageCreate", async (message) => this.onMessage(message));
    }

    private buildDB(): void {
        if (!this.options.useDatabase) return console.error("Some options might not work without a database")

        const type = typeof this.options.databaseType === "object"
            ? this.options.databaseType.type
            : this.options.databaseType

        switch (type) {
            case "mongo":
                this.mongoHandler()
                break
            case "json":
                this.jsonHandler()
                break
            default:
                this.jsonHandler()
        }
    }

    private async mongoHandler(): Promise<void> {
        if (typeof this.options.databaseType !== "object") return;
        await connect(this.options.databaseType.mongoPath)
    }

    private jsonHandler(): void {

    }

    private async onInteraction(interaction: Interaction) {
        if (!interaction.isCommand()) return;
        const command = this.slashCommands.get(interaction.commandName);
        if (!command) return;
        try {
            if (command.enabled === false) return interaction.reply("Command Disabled");
            await command.execute(interaction, this);
        } catch (err) {
            console.error(err);
        }
    }

    private async onMessage(message: Message) {
        if (message.author.bot || message.channel.type == "DM") return;
        if (message.content.startsWith(this.prefix)) {
            if (message.content.trim().split(/ /g)[0].length <= this.prefix.length) return;
            const args = message.content.replace(/(\r\n|\n|\r)/g, " ").slice(this.prefix.length).trim().split(/ /g);
            const cmd = args.shift()?.toLowerCase();
            if (typeof cmd != "string") return console.log(`CMD is not a string\nCMD:\n${cmd}`);

            if (!this.commands.has(cmd)) return;
            const command = this.commands.get(cmd);
            if (!command) return;
            try {
                if (command?.enabled === false) return;
                await command.execute({ message, args, command: cmd, client: this })
            } catch (err) {
                console.error(err);
            }
        }
    }

    private async registerSlashCommands() {
        try {
            this.slashCommands.forEach(async (command) => {
                if (!command.post || command.post === "ALL") {
                    (await this.guilds.fetch()).map(async (guild) => {
                        await this.postCommand("Guild", this.user?.id ?? "", command.data.toJSON(), guild.id)
                    })
                } else if (Array.isArray(command.post)) {
                    command.post.forEach(async (guild) => {
                        await this.postCommand("Guild", this.user?.id ?? "", command.data.toJSON(), guild)
                    })
                } else if (!(command.post === "GLOBAL")) {
                    await this.postCommand("Guild", this.user?.id ?? "", command.data.toJSON(), command.post)
                } else {
                    await this.postCommand("Global", this.user?.id ?? "", command.data.toJSON())
                }
            })
        } catch (err) {
            throw new Error(`There was an error while trying to load (/) commands\n${err}`)
        }
    }

    private async postCommand(type: "Global" | "Guild", userId: string, commands: RESTPostAPIApplicationCommandsJSONBody, guildId?: string) {
        console.log(commands)
        const route = type === "Guild" ? Routes.applicationGuildCommands : Routes.applicationCommands
        await this.djsRest.put(route(userId, guildId ?? ""), { body: [commands] })
        return this.emit("loadedSlash", commands, type, this)
    }

    public async deleteSlashCommands() {

        // TODO: Make it possible to delete only specific commands
        try {
            const guild = await this.guilds.fetch()
            guild.map(async (g) => {
                if (!this.user) throw new Error("Client is not logged in");
                await this.djsRest.put(Routes.applicationGuildCommands(this.user.id, g.id), { body: [] })
                this.emit("deletedSlash", "Guild", this)
            })
            if (!this.user) throw new Error("Client is not logged in");
            await this.djsRest.put(Routes.applicationCommands(this.user.id), { body: [] })
            this.emit("deletedSlash", "Global", this)
        } catch (err) {
            console.error(err)
        }
    }

    public addCommands(path: string) {
        this.handler?.addDirs({ commands: path })
        this.handler.loadCommands()
    }

    public addSlashCommands(path: string) {
        this.handler?.addDirs({ slashCommands: path })
        this.handler.loadSlashCommands()
    }

    public addEvents(path: string) {
        this.handler?.addDirs({ events: path })
        this.handler.loadEvents()
    }
}