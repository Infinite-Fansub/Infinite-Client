import { SlashCommandBuilder } from "@discordjs/builders";
import { ISlashCommand } from "../../../src";

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replys with pong!")
        .addStringOption(option => option.setName("test")
            .setDescription("this is a test")
            .addChoice("1", "type_1")
        ),
    execute: async (interaction) => {
        console.log(interaction.memberPermissions)
        interaction.reply("Pong!")
    }
} as ISlashCommand