const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('backup')
        .setDescription('Create a backup of all channels and roles.'),
    
    callback: async (interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You missing this permission :`Administrator`.', ephemeral: true });
        }

        const guildId = interaction.guild.id;
        const botMember = await interaction.guild.members.fetch(interaction.client.user.id);
        const backupData = {
            channels: [],
            roles: []
        };

        interaction.guild.channels.cache.forEach(channel => {
            backupData.channels.push({
                id: channel.id.toString(),
                name: channel.name,
                type: channel.type,
                parentID: channel.parentId ? channel.parentId.toString() : null,
                position: channel.position,
                topic: channel.topic,
                nsfw: channel.nsfw,
                bitrate: channel.bitrate,
                userLimit: channel.userLimit,
                rateLimitPerUser: channel.rateLimitPerUser
            });
        });

        // Get all roles except @everyone, bot's highest role, bot roles, and server booster role
        interaction.guild.roles.cache.forEach(role => {
            if (
                role.id !== interaction.guild.id && 
                role.id !== botMember.roles.highest.id && 
                !role.managed && 
                role.tags?.premiumSubscriberRole === undefined
            ) {
                backupData.roles.push({
                    id: role.id.toString(),
                    name: role.name,
                    color: role.hexColor,
                    hoist: role.hoist,
                    position: role.position,
                    permissions: role.permissions.bitfield.toString(),
                    managed: role.managed,
                    mentionable: role.mentionable
                });
            }
        });

        const backupDir = path.resolve(__dirname, '..', 'backups', guildId);
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        const backupFilePath = path.resolve(backupDir, `${guildId}.json`);

        try {
            fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2));
            await interaction.reply({ content: `Backup has been created successfully.`, ephemeral: true });
        } catch (error) {
            console.error('Error writing backup file:', error);
            await interaction.reply({ content: 'An error occurred while creating the backup.',error, ephemeral: true });
        }
    },
};
