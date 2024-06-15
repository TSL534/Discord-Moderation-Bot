const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get the pfp of a user.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The users')
                .setRequired(false)),
    
    callback: async (interaction) => {
        const user = interaction.options.getUser('target') || interaction.user;
        const avatarEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`${user.username}'s avatar`)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

        await interaction.reply({ embeds: [avatarEmbed] });
    },
};
