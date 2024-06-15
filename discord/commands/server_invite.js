const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('server_invite')
        .setDescription('Create an invite link for the server.'),
    
    callback: async (interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.CreateInstantInvite)) {
            return interaction.reply({ content: 'You missing the Permission : `Creat InstaInvite`.', ephemeral: true });
        }

        try {
            const invite = await interaction.channel.createInvite({ maxAge: 0, maxUses: 0 });
            return interaction.reply({ content: `Here is your invite link: ${invite.url}`, ephemeral: true });
        } catch (error) {
            console.error('Error creating invite link:', error);
            return interaction.reply({ content: 'An error occurred while trying to create the invite link.', ephemeral: true });
        }
    },
};
