const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('lockdown')
        .setDescription('Lockdown a channel.')
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('The channel to lockdown')
                .setRequired(true)),
    
    callback: async (interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ content: 'You missing this Permission :`ManageChannels`.', ephemeral: true });
        }

        const channel = interaction.options.getChannel('channel');

        if (channel.type !== ChannelType.GuildText) {
            return interaction.reply({ content: 'You can only lockdown text channels.', ephemeral: true });
        }

        try {
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: false });
            return interaction.reply({ content: `${channel.name} has been locked down.`, ephemeral: true });
        } catch (error) {
            console.error('Error locking down channel:', error);
            return interaction.reply({ content: 'An error occurred while trying to lockdown the channel.',error, ephemeral: true });
        }
    },
};
