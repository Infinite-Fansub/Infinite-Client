import { Client, Collection, Interaction, Message } from "discord.js";
import { Event, ICommand, ISlashCommand, IClientOptions, DatabaseTypes } from "./typings/index";
import Handler from "./utils/handler";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { connect } from "mongoose";

export class InfiniteClient extends Client {

    private djsRest: REST;
    declare public options: IClientOptions;
    public prefix: string;
    public commands: Collection<string, ICommand> = new Collection();
    public slashCommands: Collection<string, ISlashCommand> = new Collection();
    public events: Collection<string, Event<any>> = new Collection();
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
            this.registerSlashCommands()
        })

        this.djsRest = new REST({ version: "9" }).setToken(this.token);
        this.prefix = "!";

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
            const guild = await this.guilds.fetch()
            guild.map(async (g) => {
                if (!this.user) throw new Error("Client is not logged in");
                const cmdJson = this.slashCommands.map((command) => command.data).map((command) => command.toJSON())
                await this.djsRest.put(Routes.applicationGuildCommands(this.user.id, g.id), { body: cmdJson })
                this.emit("loadedSlash", cmdJson)
            })
        } catch (err) {
            console.error(err)
        }
    }

    public async deleteSlashCommands() {

        // TODO: Make it possible to delete only specific commands
        try {
            const guild = await this.guilds.fetch()
            guild.map(async (g) => {
                if (!this.user) throw new Error("Client is not logged in");
                await this.djsRest.put(Routes.applicationGuildCommands(this.user.id, g.id), { body: [] })
                this.emit("deletedSlash")
            })
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