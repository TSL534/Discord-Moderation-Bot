const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('create_mute_role')
        .setDescription('Create a mute role that cannot send messages in any channel.'),
    
    callback: async (interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You missing this Permission :`Administrator`', ephemeral: true });
        }

        const guild = interaction.guild;
        let muteRole = guild.roles.cache.find(role => role.name === 'Muted');

        if (muteRole) {
            return interaction.reply({ content: 'Mute role already exists.', ephemeral: true });
        }

        try {
            muteRole = await guild.roles.create({
                name: 'Muted',
                color: '#514f48',
                permissions: []
            });

            await Promise.all(guild.channels.cache.map(async (channel) => {
                if (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildNews) {
                    await channel.permissionOverwrites.edit(muteRole, {
                        SendMessages: false,
                        AddReactions: false
                    });
                } else if (channel.type === ChannelType.GuildVoice) {
                    await channel.permissionOverwrites.edit(muteRole, {
                        Speak: false
                    });
                }
            }));

            return interaction.reply({ content: 'Mute role has been created successfully.', ephemeral: true });
        } catch (error) {
            console.error('Error creating mute role:', error);
            return interaction.reply({ content: 'An error occurred while creating the mute role.',error, ephemeral: true });
        }
    },
};
