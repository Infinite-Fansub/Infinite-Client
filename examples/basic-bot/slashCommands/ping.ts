import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { ISlashCommand } from "../../../src";

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replys with pong!"),
    execute: async (interaction) => {
        const embed = new MessageEmbed().setImage(interaction.user.avatarURL())
        interaction.reply({ embeds: [embed] })
    }
} as ISlashCommand