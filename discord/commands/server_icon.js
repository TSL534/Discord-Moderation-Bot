const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('server_icon')
        .setDescription('Get the servers icon .'),
    
    callback: async (interaction) => {
        const { guild } = interaction;
        const serverIconEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`${guild.name}'s icon`)
            .setImage(guild.iconURL({ dynamic: true, size: 1024 }))
            .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

        await interaction.reply({ embeds: [serverIconEmbed] });
    },
};
