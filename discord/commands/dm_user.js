const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('dm_user')
        .setDescription('Send a direct message to a user.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to send a DM to')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('message')
                .setDescription('The message to send')
                .setRequired(true)),
    
    callback: async (interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have permissions to use this command.', ephemeral: true });
        }

        const target = interaction.options.getUser('target');
        const message = interaction.options.getString('message');

        // Acknowledge the interaction quickly
        await interaction.deferReply({ ephemeral: true });

        try {
            await target.send(message);
            await interaction.editReply({ content: `Successfully sent a DM to ${target.tag}.` });
        } catch (error) {
            console.error(`Could not send DM to ${target.tag}.`, error);
            await interaction.editReply({ content: `Failed to send a DM to ${target.tag}.` });
        }
    },
};
