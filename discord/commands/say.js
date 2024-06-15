const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Make the bot say something.')
        .addStringOption(option => 
            option.setName('message')
                .setDescription('The message to send')
                .setRequired(true)),
    
    callback: async (interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.MentionEveryone)) {
            return interaction.reply({ content: 'You missing the Premission : `Mention Everyone` .', ephemeral: true });
        }

        const message = interaction.options.getString('message');

        await interaction.deferReply({ ephemeral: true });

        await interaction.channel.send(message);

        return interaction.deleteReply();
    },
};
