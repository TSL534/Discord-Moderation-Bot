const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

const afkFilePath = 'guildafk.json'; // was making it so it saved it in a json and shows the text but to lazzy :D

let afkUsers = {};
if (fs.existsSync(afkFilePath)) {
    afkUsers = JSON.parse(fs.readFileSync(afkFilePath, 'utf8'));
}

const saveAfkUsers = () => {
    fs.writeFileSync(afkFilePath, JSON.stringify(afkUsers, null, 2));
};

module.exports = {
    command: new SlashCommandBuilder()
        .setName('remove_afk')
        .setDescription('Remove AFK status and restore original nickname.'),
    
    callback: async (interaction) => {
        const member = interaction.member;

        if (!member.manageable) {
            return interaction.reply({ content: 'I cannot change your Nickname .', ephemeral: true });
        }

        const afkInfo = afkUsers[member.id];

        if (!afkInfo) {
            return interaction.reply({ content: 'You are not AFK.', ephemeral: true });
        }

        try {
            await member.setNickname(afkInfo.originalNickname);
            delete afkUsers[member.id];
            saveAfkUsers();

            return interaction.reply({ content: 'Your AFK status has been removed.', ephemeral: true });
        } catch (error) {
            console.error('Error removing AFK status:', error);
            return interaction.reply({ content: 'An error occurred while removing AFK status.',error, ephemeral: true });
        }
    },
    afkUsers,
    saveAfkUsers,
};
