const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('remove_quarantine')
        .setDescription('Remove a user from quarantine.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to remove from quarantine')
                .setRequired(true)),
    
    callback: async (interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You missin this Permission : `Administator`.', ephemeral: true });
        }

        const target = interaction.options.getUser('target');
        const member = interaction.guild.members.cache.get(target.id);

        if (!member) {
            return interaction.reply({ content: 'That user is not in the server.', ephemeral: true });
        }

        const quarantineRole = interaction.guild.roles.cache.find(role => role.name === 'Quarantine');
        if (!quarantineRole) {
            return interaction.reply({ content: 'Quarantine role does not exist. Please create one using /create_quarantine_role.', ephemeral: true });
        }

        try {
            if (member.roles.cache.has(quarantineRole.id)) {
                await member.roles.remove(quarantineRole);

                try {
                    await target.send('You have been removed from quarantine.');
                } catch (error) {
                    console.error(`Could not send DM to ${target.tag}.`);
                }

                return interaction.reply({ content: `${target.tag} has been removed from quarantine.`, ephemeral: true });
            } else {
                return interaction.reply({ content: 'This user was not in quarantine.', ephemeral: true });
            }
        } catch (error) {
            console.error('Error removing quarantine:', error);
            return interaction.reply({ content: 'An error occurred while removing quarantine.',error, ephemeral: true });
        }
    },
};
