const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('remove_role')
        .setDescription('Remove a role from a member.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The member to remove the role from')
                .setRequired(true))
        .addRoleOption(option => 
            option.setName('role')
                .setDescription('The role to remove')
                .setRequired(true)),
    
    callback: async (interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return interaction.reply({ content: 'You missing this Permission :`ManageRoles`.', ephemeral: true });
        }

        const target = interaction.options.getUser('target');
        const role = interaction.options.getRole('role');
        const member = interaction.guild.members.cache.get(target.id);

        if (!member) {
            return interaction.reply({ content: 'That user is not in the server.', ephemeral: true });
        }

        try {
            await member.roles.remove(role);
            return interaction.reply({ content: `${role.name} role has been removed from ${target.tag}.`, ephemeral: true });
        } catch (error) {
            console.error('Error removing role:', error);
            return interaction.reply({ content: 'An error occurred while trying to remove the role.',error, ephemeral: true });
        }
    },
};
