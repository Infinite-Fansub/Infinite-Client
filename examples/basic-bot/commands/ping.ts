import { SlashCommandBuilder } from "@discordjs/builders";
import { ISlashCommand } from "../../../src/index";

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replys with pong!"),
    execute: async (interaction) => {
        interaction.reply("Pong!")
    }
} as ISlashCommand