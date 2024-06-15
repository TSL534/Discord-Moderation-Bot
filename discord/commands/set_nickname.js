const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('set_nickname')
        .setDescription('Set your own nickname or someone elses nickname.')
        .addStringOption(option => 
            option.setName('nickname')
                .setDescription('The new nickname')
                .setRequired(true))
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to change the nickname for')
                .setRequired(false)),
    
    callback: async (interaction) => {
        const targetUser = interaction.options.getUser('user');
        const newNickname = interaction.options.getString('nickname');
        let member;

        if (targetUser) {
            member = interaction.guild.members.cache.get(targetUser.id);
        } else {
            member = interaction.member;
        }

        if (!member.manageable) {
            return interaction.reply({ content: 'I need this Permission to do this : `Manage Nicknames`.', ephemeral: true });
        }

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
            return interaction.reply({ content: 'You missing this Permission : `Manage Nicknames`.', ephemeral: true });
        }

        try {
            await member.setNickname(newNickname);
            return interaction.reply({ content: `Successfully changed the nickname of ${targetUser ? targetUser.username : 'yourself'} to ${newNickname}.`, ephemeral: true });
        } catch (error) {
            console.error('Error changing nickname:', error);
            return interaction.reply({ content: 'An error occurred while changing the nickname.',error, ephemeral: true });
        }
    },
};
