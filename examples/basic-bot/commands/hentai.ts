// @ts-nocheck

import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { SlashCommandExecute } from "../../../src/types";
import choices from "../utils/choices";

import NekoClient from "nekos.life";

export default SlashCommandExecute({
    data: new SlashCommandBuilder()
        .setName("hentai")
        .setDescription("troll")
        .addStringOption(option =>
            option.setName("type")
                .setDescription("ok")
                .setRequired(true)
                .addChoices(choices.nekos.hentai)
        ),

    enabled: true,
    execute: async (interaction) => {
        if (!interaction.channel.nsfw) return interaction.reply("This command can only be used in NSFW channels")

        let type = interaction.options.getString("type").replace("type_", "")
        const neko = new NekoClient()
        const embed = new MessageEmbed()
            .setColor(0xeb347a)
            .setImage((await neko.nsfw[type]()).url)

        interaction.reply({ embeds: [embed] })
    }
})