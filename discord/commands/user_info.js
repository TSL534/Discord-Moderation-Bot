const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Get information about a user.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The user to get information about')
                .setRequired(true)),
    
    callback: async (interaction) => {
        const target = interaction.options.getUser('target');
        const member = interaction.guild.members.cache.get(target.id);

        if (!member) {
            return interaction.reply({ content: 'That user is not in the server.', ephemeral: true });
        }

        const highestRole = member.roles.highest;

        const presence = member.presence ? member.presence.status : 'offline';

        const nickname = member.nickname || 'None';

        const accountCreatedAt = target.createdAt.toDateString();
        const serverJoinedAt = member.joinedAt.toDateString();

        const joinedDaysAgo = Math.floor((Date.now() - member.joinedTimestamp) / (1000 * 60 * 60 * 24));

        const roles = member.roles.cache
            .filter(role => role.id !== interaction.guild.id) // Exclude @everyone role
            .map(role => role.name)
            .join(', ') || 'None';

        const userInfoEmbed = new EmbedBuilder()
            .setColor(139)
            .setTitle(`${target.tag}'s Information`)
            .setThumbnail(target.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'Username', value: target.username, inline: true },
                { name: 'Discriminator', value: `#${target.discriminator}`, inline: true },
                { name: 'ID', value: target.id, inline: true },
                { name: 'Bot', value: target.bot ? 'Yes' : 'No', inline: true },
                { name: 'Presence', value: presence, inline: true },
                { name: 'Highest Role', value: highestRole.name, inline: true },
                { name: 'Nickname', value: nickname, inline: true },
                { name: 'Created At', value: accountCreatedAt, inline: true },
                { name: 'Joined Server At', value: serverJoinedAt, inline: true },
                { name: 'Days Since Joining', value: `${joinedDaysAgo} days`, inline: true },
                { name: 'Roles', value: roles }
            )
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        return interaction.reply({ embeds: [userInfoEmbed] });
    },
};
