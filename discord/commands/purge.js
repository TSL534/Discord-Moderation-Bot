const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Delete a specified number of messages from a channel.')
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('Number of messages to delete')
                .setRequired(true)),
    
    callback: async (interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({ content: 'You missing this Permission: `ManageMessages`.', ephemeral: true });
        }

        const amount = interaction.options.getInteger('amount');

        if (amount < 1 || amount > 100) {
            return interaction.reply({ content: 'You need to input a number between 1 and 100.', ephemeral: true });
        }

        try {
            await interaction.channel.bulkDelete(amount, true);
            return interaction.reply({ content: `Successfully deleted ${amount} messages.`, ephemeral: true });
        } catch (error) {
            console.error('Error purging messages:', error);
            return interaction.reply({ content: 'An error occurred while trying to delete messages in this channel.',error, ephemeral: true });
        }
    },
};
