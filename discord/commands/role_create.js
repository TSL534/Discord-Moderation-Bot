const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('create_role')
        .setDescription('creat a roles.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Creates a role')
                .addStringOption(option =>
                    option.setName('name')
                        .setDescription('The name of the new role')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('color')
                        .setDescription('The color of the new role (hex code)')
                        .setRequired(false))
                .addBooleanOption(option =>
                    option.setName('mentionable')
                        .setDescription('Whether the role is mentionable')
                        .setRequired(false))
                .addBooleanOption(option =>
                    option.setName('hoist')
                        .setDescription('Whether the role should be displayed separately in the sidebar')
                        .setRequired(false))),
    
    callback: async (interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You missing this Permission : `Administrator`', ephemeral: true });
        }

        const name = interaction.options.getString('name');
        const color = interaction.options.getString('color') || null;
        const mentionable = interaction.options.getBoolean('mentionable') || false;
        const hoist = interaction.options.getBoolean('hoist') || false;

        try {
            const role = await interaction.guild.roles.create({
                name,
                color,
                mentionable,
                hoist,
                reason: 'Role created via command'
            });

            return interaction.reply({ content: `Role **${name}** has been created successfully .`, ephemeral: true });
        } catch (error) {
            console.error('Error creating role:', error);
            return interaction.reply({ content: 'An error occurred while creating the role.',error, ephemeral: true });
        }
    },
};
