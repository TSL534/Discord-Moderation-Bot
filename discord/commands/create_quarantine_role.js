const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, PermissionFlagsBits } = require('discord.js');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('create_quarantine_role')
        .setDescription('Create a quarantine role.'),
    
    callback: async (interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You missing this Permission : `Administrator`.', ephemeral: true });
        }

        try {
            const role = await interaction.guild.roles.create({
                name: 'Quarantine',
                color: '#ff0000',
                permissions: [],
                reason: 'Role for quarantined users'
            });

            await role.setPosition(interaction.guild.roles.highest.position - 1);

            interaction.guild.channels.cache.forEach(channel => {
                channel.permissionOverwrites.create(role, {
                    [PermissionFlagsBits.ViewChannel]: false,
                    [PermissionFlagsBits.SendMessages]: false,
                    [PermissionFlagsBits.ReadMessageHistory]: false
                });
            });

            return interaction.reply({ content: 'Quarantine role has been created successfully.', ephemeral: true });
        } catch (error) {
            console.error('Error creating quarantine role:', error);
            return interaction.reply({ content: 'An error occurred while creating the quarantine role.',error, ephemeral: true });
        }
    },
};
