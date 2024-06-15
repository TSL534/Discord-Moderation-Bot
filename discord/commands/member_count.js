const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('member_count')
        .setDescription('Display the number of members in the server.'),
    
    callback: async (interaction) => {
        const { guild } = interaction;

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Member Count')
            .setDescription(`The server has ${guild.memberCount} members.`);

        await interaction.reply({ embeds: [embed] });
    },
};
