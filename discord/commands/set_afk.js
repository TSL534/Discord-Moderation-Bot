const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

const afkFilePath = 'guildafk.json';

let afkUsers = {};
if (fs.existsSync(afkFilePath)) {
    afkUsers = JSON.parse(fs.readFileSync(afkFilePath, 'utf8'));
}

const saveAfkUsers = () => {
    fs.writeFileSync(afkFilePath, JSON.stringify(afkUsers, null, 2));
};

module.exports = {
    command: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Set yourself as AFK.'),
    
    callback: async (interaction) => {
        const member = interaction.member;

        if (!member.manageable) {
            return interaction.reply({ content: 'I cannot change your nickname due to insufficient permissions.', ephemeral: true });
        }

        const originalNickname = member.nickname || member.user.username;
        const afkNickname = `[AFK] ${originalNickname}`;

        try {
            await member.setNickname(afkNickname);

            afkUsers[member.id] = {
                timestamp: Date.now(),
                originalNickname: originalNickname
            };
            saveAfkUsers();

            return interaction.reply({ content: 'You are now AFK.', ephemeral: true });
        } catch (error) {
            console.error('Error setting AFK:', error);
            return interaction.reply({ content: 'An error occurred while setting AFK.', ephemeral: true });
        }
    },
    afkUsers,
    saveAfkUsers,
};
