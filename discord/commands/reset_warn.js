const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');

const warningsFilePath = path.resolve(__dirname, '..', 'warnings.json');
const warnings = JSON.parse(fs.readFileSync(warningsFilePath, 'utf8'));

const saveWarnings = () => {
    fs.writeFileSync(warningsFilePath, JSON.stringify(warnings, null, 2));
};

module.exports = {
    command: new SlashCommandBuilder()
        .setName('resetwarns')
        .setDescription('Reset warnings for a member.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The member to reset warnings for')
                .setRequired(true)),
    
    callback: async (interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: 'You you missing this Permission : `Moderate Members`.', ephemeral: true });
        }

        const target = interaction.options.getUser('target');

        if (!warnings[target.id]) {
            return interaction.reply({ content: 'This user has no warnings.', ephemeral: true });
        }

        delete warnings[target.id];
        saveWarnings();

        return interaction.reply({ content: `${target.tag}'s warnings have been reset.` });
    },
};
