import { Client, ClientOptions, Collection, Interaction, Message } from "discord.js";
import { EventOptions, ICommand, ISlashCommand } from "./types";
import Handler from "./utils/handler";
import { join } from "path"
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

export default class InfiniteClient extends Client {

    private djsRest: REST;
    public prefix: string;
    public commands: Collection<string, ICommand> = new Collection();
    public slashCommands: Collection<string, ISlashCommand> = new Collection();
    public events: Collection<string, EventOptions> = new Collection();
    public handler: Handler = new Handler(this, {
        // commands: join(__dirname, "..", "commands"),
        slashCommands: join(__dirname, "..", "src/commands"),
        events: join(__dirname, "..", "events")
    });

    constructor(token: string, options: ClientOptions) {
        super(options);
        this.token = token
        this.djsRest = new REST({ version: "9" }).setToken(this.token);
        this.prefix = "!";

        this.on("interactionCreate", async (interaction) => this.onInteraction(interaction));
        this.on("messageCreate", async (message) => this.onMessage(message));
    }

    private async onInteraction(interaction: Interaction) {
        if (!interaction.isCommand()) return;
        const command = this.slashCommands.get(interaction.commandName);
        if (!command) return;
        try {
            if (!command.enabled) return interaction.reply("Command Disabled");
            await command.execute(interaction);
        } catch (err) {
            console.error(err);
        }
    }

    private async onMessage(message: Message) {
        if (message.author.bot || message.channel.type == "DM") return;
        if (message.content.startsWith(this.prefix)) {
            if (message.content.trim().split(/ /g)[0].length <= this.prefix.length) return;
            const args = message.content.slice(this.prefix.length).trim().split(/ /g);
            const cmd = args.shift()?.toLowerCase();
            if (typeof cmd != "string") return console.log(`CMD is not a string\nCMD:\n${cmd}`);

            if (!this.commands.has(cmd)) return;
            const command = this.commands.get(cmd);
            try {
                if (!command?.enabled) return;
                await command.execute(message, args, cmd)
            } catch (err) {
                console.error(err);
            }
        }
    }

    /*
    * @TODO: get the client id and guild id without needing the config.json
    */

    // private async registerSlashCommands() {
    //     const cmdJson = this.slashCommands.map((command) => command.data)//.map((command) => command.toJSON())
    //     try {
    //         await this.djsRest.put(Routes.applicationGuildCommands(id, guild), { body: cmdJson })
    //         console.log(this.slashCommands.map((command) => command.data))
    //         console.log(cmdJson)
    //     } catch (err) {
    //         console.error(err)
    //     }
    // }

    public setPrefix(prefix: string) {
        this.prefix = prefix
    }

    public async start(): Promise<string> {
        if (!this.token) throw new Error("A token was not provided");
        await this.handler.loadSlashCommands();
        // await this.registerSlashCommands();
        return await this.login(this.token);
    }

}