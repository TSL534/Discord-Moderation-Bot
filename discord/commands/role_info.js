const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('role_info')
        .setDescription('Get information about a role.')
        .addRoleOption(option => 
            option.setName('role')
                .setDescription('The role to get information about')
                .setRequired(true)),
    
    callback: async (interaction) => {
        const role = interaction.options.getRole('role');

        const embed = new EmbedBuilder()
            .setColor(role.color)
            .setTitle(`${role.name} Information`)
            .addFields(
                { name: 'Role Name', value: role.name },
                { name: 'Role ID', value: role.id },
                { name: 'Color', value: role.hexColor },
                { name: 'Mentionable', value: role.mentionable ? 'Yes' : 'No' },
                { name: 'Position', value: `${role.position}` },
                { name: 'Permissions', value: role.permissions.toArray().join(', ') }
            );

        await interaction.reply({ embeds: [embed] });
    },
};
