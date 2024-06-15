const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('remove_nickname')
        .setDescription('Remove your own nickname or someone else\'s nickname.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to remove the nickname for')
                .setRequired(false)),
    
    callback: async (interaction) => {
        const targetUser = interaction.options.getUser('user');
        let member;

        if (targetUser) {
            member = interaction.guild.members.cache.get(targetUser.id);
        } else {
            member = interaction.member;
        }

        if (!member.manageable) {
            return interaction.reply({ content: 'I cannot change the nickname of this user due to insufficient permissions.', ephemeral: true });
        }

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
            return interaction.reply({ content: 'You missing this Permission :`ManageNicknames`.', ephemeral: true });
        }

        try {
            await member.setNickname(null); 
            return interaction.reply({ content: `Successfully removed the nickname of ${targetUser ? targetUser.username : 'yourself'}.`, ephemeral: true });
        } catch (error) {
            console.error('Error removing nickname:', error);
            return interaction.reply({ content: 'An error occurred while removing the nickname.',error, ephemeral: true });
        }
    },
};
