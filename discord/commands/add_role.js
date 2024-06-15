const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('add_role')
        .setDescription('Add a role to a member.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The member to add the role to')
                .setRequired(true))
        .addRoleOption(option => 
            option.setName('role')
                .setDescription('The role to add')
                .setRequired(true)),
    
    callback: async (interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return interaction.reply({ content: 'You missing this permission : `ManageRoles ` ', ephemeral: true });
        }

        const target = interaction.options.getUser('target');
        const role = interaction.options.getRole('role');
        const member = interaction.guild.members.cache.get(target.id);

        if (!member) {
            return interaction.reply({ content: 'This user is not in the Server.', ephemeral: true });
        }

        try {
            await member.roles.add(role);
            return interaction.reply({ content: `${role.name}  has been added to ${target.tag}.`, ephemeral: true });
        } catch (error) {
            console.error('Error adding role:', error);
            return interaction.reply({ content: 'An error occurred while trying to add the role.',error, ephemeral: true });
        }
    },
};
