const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');

const quarantineFilePath = path.resolve(__dirname, '..', 'quarantine.json');

// Load quarantine data
let quarantineData = {};
if (fs.existsSync(quarantineFilePath)) {
    quarantineData = JSON.parse(fs.readFileSync(quarantineFilePath, 'utf8'));
}

const saveQuarantineData = () => {
    fs.writeFileSync(quarantineFilePath, JSON.stringify(quarantineData, null, 2));
};

module.exports = {
    command: new SlashCommandBuilder()
        .setName('set_quarantine')
        .setDescription('Quarantine a user.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to quarantine')
                .setRequired(true)),
    
    callback: async (interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have permissions to use this command.', ephemeral: true });
        }

        const target = interaction.options.getUser('target');
        const member = interaction.guild.members.cache.get(target.id);

        if (!member) {
            return interaction.reply({ content: 'That user is not in the server.', ephemeral: true });
        }

        const quarantineRole = interaction.guild.roles.cache.find(role => role.name === 'Quarantine');
        if (!quarantineRole) {
            return interaction.reply({ content: 'Quarantine role does not exist. Please create it first using /create_quarantine_role.', ephemeral: true });
        }

        try {
            quarantineData[member.id] = member.roles.cache.map(role => role.id);
            saveQuarantineData();

            await member.roles.set([quarantineRole]);

            try {
                await target.send('You have been put in quarantine.');
            } catch (error) {
                console.error(`Could not send DM to ${target.tag}.`);
            }

            return interaction.reply({ content: `${target.tag} has been put in quarantine.`, ephemeral: true });
        } catch (error) {
            console.error('Error setting quarantine:', error);
            return interaction.reply({ content: 'An error occurred while setting quarantine.', ephemeral: true });
        }
    },
};
