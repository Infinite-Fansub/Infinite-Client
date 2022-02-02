import { Routes } from "discord-api-types/v9";
import { Client, Interaction, Message, ChannelType } from "discord.js";
import { REST } from "@discordjs/rest";
import { connect } from "mongoose";
import { createClient, RedisClientType } from "redis";
import { Event, ICommand, ISlashCommand, IClientOptions } from "./typings/index";
import Handler from "./utils/handler";

export class InfiniteClient extends Client {

    private djsRest: REST;
    declare public options: IClientOptions;
    public prefix: string = "!";
    public commands: Map<string, ICommand> = new Map();
    public slashCommands: Map<string, ISlashCommand> = new Map();
    public events: Map<string, Event<any>> = new Map();
    public handler: Handler = new Handler(this);
    public redis?: RedisClientType<any, any>;

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

        this.on("ready", async () => await this.registerSlashCommands());
        this.on("interactionCreate", async (interaction) => this.onInteraction(interaction));
        this.on("messageCreate", async (message) => this.onMessage(message));
    }

    private buildDB(): void {
        if (!this.options.useDatabase) return console.error("Some options might not work without a database")

        const type = typeof this.options.databaseType === "object" ? this.options.databaseType.type : this.options.databaseType;

        switch (type) {
            case "mongo":
                this.mongoHandler()
                break
            case "redis":
                this.redisHandler()
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
        if (this.options.databaseType.path instanceof Object) return;
        await connect(this.options.databaseType.path)
    }

    private async redisHandler(): Promise<void> {
        if (this.options.databaseType === "json") return;
        let url: string = "";
        if (typeof this.options.databaseType?.path === "object") {
            const uriParts = this.options.databaseType?.path
            url = `${uriParts.username}:${uriParts.password}@${uriParts.entrypoint.match(/:\d$/) ? uriParts.entrypoint : `${uriParts.entrypoint}:${uriParts.port}`}`
        } else if (typeof this.options.databaseType?.path === "string") {
            url = this.options.databaseType.path
        }

        const client = createClient({ url })
        client.on("error", (err) => { throw new Error(err) })
        this.redis = client
    }

    private jsonHandler(): void {
        throw new Error("NOT_IMPLEMENTED")
    }

    private async onInteraction(interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return;
        const command = this.slashCommands.get(interaction.commandName);
        if (!command) return;
        try {
            if (command.enabled ?? true) await command.execute(interaction, this);
            else interaction.reply("Command Disabled");
        } catch (err) {
            console.error(err);
        }
    }

    private async onMessage(message: Message) {
        if (message.author.bot || message.channel.type === ChannelType.DM) return;
        if (message.content.startsWith(this.prefix)) {
            const args = message.content.slice(this.prefix.length).trim().split(/\s+/g);
            const cmd = args.shift()?.toLowerCase();
            if (!cmd) return console.log(`CMD is not a string\nCMD:\n${cmd}`);

            if (!this.commands.has(cmd)) return;
            const command = this.commands.get(cmd);
            if (!command) return;
            try {
                if (command?.enabled ?? true) await command.execute({ message, args, command: cmd, client: this })
            } catch (err) {
                console.error(err);
            }
        }
    }

    private async registerSlashCommands() {
        const allSlashCommands = [...this.slashCommands.values()];

        const globalCommands = allSlashCommands.filter((command) => command.post === "GLOBAL");
        const globalJson = globalCommands.map((command) => command.data.toJSON());

        await this.djsRest.put(Routes.applicationCommands(this.user?.id ?? ""), { body: globalJson })
            .then(() => this.emit("loadedSlash", globalJson, "Global", this));

        (await this.guilds.fetch()).forEach(async (_, guildId) => {
            const guildCommands = allSlashCommands.filter((command) => command.post === "ALL" || command.post === guildId || Array.isArray(command.post) && command.post.includes(guildId));
            const guildJson = guildCommands.map((command) => command.data.toJSON());

            await this.djsRest.put(Routes.applicationGuildCommands(this.user?.id ?? "", guildId), { body: guildJson })
                .then(() => this.emit("loadedSlash", guildJson, guildId, this));
        });
    }

    // public async deleteSlashCommands() {

    //     TODO: Make it possible to delete only specific commands
    //     try {
    //         const allGuilds = await this.guilds.fetch()
    //         allGuilds.map(async (guild) => {
    //             if (!this.user) throw new Error("Client is not logged in");
    //             await this.djsRest.put(Routes.applicationGuildCommands(this.user.id, guild.id), { body: [] })
    //             this.emit("deletedSlash", "Guild", this)
    //         })
    //         if (!this.user) throw new Error("Client is not logged in");
    //         await this.djsRest.put(Routes.applicationCommands(this.user.id), { body: [] })
    //         this.emit("deletedSlash", "Global", this)
    //     } catch (err) {
    //         console.error(err)
    //     }
    // }

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