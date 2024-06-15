const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('loadbackup')
        .setDescription('Load a backup to restore channels and roles.'),
    
    callback: async (interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You missing this permission : `Administrator`.', ephemeral: true });
        }

        const guildId = interaction.guild.id;
        const backupFilePath = path.resolve(__dirname, '..', 'backups', guildId, `${guildId}.json`);

        if (!fs.existsSync(backupFilePath)) {
            return interaction.reply({ content: 'No backup found for this server.Try to make one whit `/creat_backup`', ephemeral: true });
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('confirm-loadbackup')
                    .setLabel('Confirm')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('cancel-loadbackup')
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Secondary)
            );

        await interaction.reply({ content: 'Are you sure you want to load the backup? This will overwrite existing channels and roles.', components: [row], ephemeral: true });

        const filter = i => i.customId === 'confirm-loadbackup' || i.customId === 'cancel-loadbackup';
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
            if (i.customId === 'confirm-loadbackup') {
                try {
                    const startEmbed = new EmbedBuilder()
                        .setColor('#00FF00')
                        .setTitle('Backup Restoration')
                        .setDescription('loading the backup this could take some times .');

                    await i.update({ embeds: [startEmbed], components: [], ephemeral: true });

                    const botMember = await interaction.guild.members.fetch(interaction.client.user.id);
                    if (!botMember.permissions.has([PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ManageRoles])) {
                        await interaction.followUp({ content: 'I missing one of thes Permissions :`ManageChannels` , `ManageRoles` ', ephemeral: true });
                        return;
                    }

                    const backupData = JSON.parse(fs.readFileSync(backupFilePath, 'utf8'));

                    // Delete all existing roles except @everyone and bot's highest role
                    const botHighestRole = botMember.roles.highest;
                    const roleDeletions = interaction.guild.roles.cache
                        .filter(role => role.id !== interaction.guild.id && role.id !== botHighestRole.id && role.position < botHighestRole.position)
                        .map(role => 
                            role.delete().catch(err => console.warn(`Failed to delete role ${role.name}: ${err.message}`))
                        );
                    await Promise.all(roleDeletions);

                    // Restore roles except @everyone and bot's highest role
                    for (const roleData of backupData.roles) {
                        if (roleData.id !== interaction.guild.id && roleData.id !== botHighestRole.id) {
                            try {
                                await interaction.guild.roles.create({
                                    name: roleData.name,
                                    color: roleData.color,
                                    hoist: roleData.hoist,
                                    position: roleData.position,
                                    permissions: BigInt(roleData.permissions),
                                    mentionable: roleData.mentionable
                                });
                            } catch (err) {
                                if (err.code === 50013) {
                                    console.warn(`Failed to create role ${roleData.name} due to missing permissions.`);
                                } else {
                                    throw err;
                                }
                            }
                        }
                    }

                    const channelDeletions = interaction.guild.channels.cache.map(channel => 
                        channel.delete().catch(err => console.warn(`Failed to delete channel ${channel.name}: ${err.message}`))
                    );
                    await Promise.all(channelDeletions);

                    for (const channelData of backupData.channels) {
                        await interaction.guild.channels.create({
                            name: channelData.name,
                            type: channelData.type,
                            parent: channelData.parentID,
                            position: channelData.position,
                            topic: channelData.topic,
                            nsfw: channelData.nsfw,
                            bitrate: channelData.bitrate,
                            userLimit: channelData.userLimit,
                            rateLimitPerUser: channelData.rateLimitPerUser
                        });
                    }
                } catch (error) {
                    console.error('Error loading backup:', error);
                    try {
                        await interaction.followUp({ content: 'An error occurred while loading the backup.',error, ephemeral: true });
                    } catch (updateError) {
                        console.error('Error updating interaction:', updateError);
                    }
                }
            } else if (i.customId === 'cancel-loadbackup') {
                try {
                    await i.update({ content: 'Backup load cancelled.', components: [], ephemeral: true });
                } catch (updateError) {
                    console.error('Error updating interaction:', updateError);
                }
            }
        });

        collector.on('end', collected => {
            if (!collected.size) {
                interaction.editReply({ content: 'Backup load timed out.', components: [] });
            }
        });
    },
};
