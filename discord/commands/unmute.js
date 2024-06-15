const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmute a member.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The member to unmute')
                .setRequired(true)),
    
    callback: async (interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: 'You do not have permissions to unmute members.', ephemeral: true });
        }

        const target = interaction.options.getUser('target');
        const member = interaction.guild.members.cache.get(target.id);

        if (!member) {
            return interaction.reply({ content: 'That user is not in the server.', ephemeral: true });
        }

        let muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');

        if (!muteRole) {
            return interaction.reply({ content: 'Mute role does not exist.', ephemeral: true });
        }

        try {
            await member.roles.remove(muteRole);
            return interaction.reply({ content: `${target.tag} has been unmuted.`, ephemeral: true });
        } catch (error) {
            console.error('Error unmuting user:', error);
            return interaction.reply({ content: 'An error occurred while trying to unmute the member.', ephemeral: true });
        }
    },
};
