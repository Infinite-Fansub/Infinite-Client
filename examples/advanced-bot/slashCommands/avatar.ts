import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, User } from "discord.js";
import { ISlashCommand } from "../../../src";

export default {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Sends the user avatar")
        .addUserOption(option => option.setName("user")
            .setDescription("The user you want the avatar from")
        ),
    execute: async (interaction) => {
        if (!(interaction.member.user instanceof User)) return;
        let user = interaction.options.getUser("user") || interaction.member.user;
        const embed = new MessageEmbed()
            .setTitle(`${user.username}'s Avatar`)
            .setImage(user.displayAvatarURL({ size: 2048, dynamic: true }))
            .setTimestamp()
        interaction.reply({ embeds: [embed] })
    }
} as ISlashCommand