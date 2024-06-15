const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('unlockdown')
        .setDescription('Remove lockdown from a channel.')
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('The channel to remove lockdown from')
                .setRequired(true)),
    
    callback: async (interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ content: 'You missing this permission : `Manage Channels`.', ephemeral: true });
        }

        const channel = interaction.options.getChannel('channel');

        if (channel.type !== ChannelType.GuildText) {
            return interaction.reply({ content: 'You can only remove lockdown from text channels.', ephemeral: true });
        }

        try {
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: true });
            return interaction.reply({ content: `${channel.name} has been unlocked.`, ephemeral: true });
        } catch (error) {
            console.error('Error unlocking channel:', error);
            return interaction.reply({ content: 'An error occurred while trying to unlock the channel.',erros, ephemeral: true });
        }
    },
};
