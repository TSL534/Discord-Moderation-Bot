const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('guildinfo')
        .setDescription('Displays information about a specified guild or the current guild')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('ID of the guild to look up')
                .setRequired(false)),

    callback: async (interaction) => {
        const guildId = interaction.options.getString('id');
        const guild = guildId ? interaction.client.guilds.cache.get(guildId) : interaction.guild;

        if (!guild) {
            await interaction.reply({ content: 'Guild not found or the bot is not a member of this guild.', ephemeral: true });
            return;
        }

        let owner;
        try {
            owner = await guild.fetchOwner();
        } catch (error) {
            console.error('Error fetching guild owner:', error);
            owner = { user: { tag: 'Unknown' } };
        }

        const creationDate = `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`;

        const roles = guild.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(role => role.name)
            .slice(0, 10);

        const channelCount = guild.channels.cache.size;
        const textChannelCount = guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').size;
        const voiceChannelCount = guild.channels.cache.filter(c => c.type === 'GUILD_VOICE').size;
        const stageChannelCount = guild.channels.cache.filter(c => c.type === 'GUILD_STAGE_VOICE').size;
        const categoryChannelCount = guild.channels.cache.filter(c => c.type === 'GUILD_CATEGORY').size;
        const newsChannelCount = guild.channels.cache.filter(c => c.type === 'GUILD_NEWS').size;
        const storeChannelCount = guild.channels.cache.filter(c => c.type === 'GUILD_STORE').size;
        const threadChannelCount = guild.channels.cache.filter(c => ['GUILD_PUBLIC_THREAD', 'GUILD_PRIVATE_THREAD'].includes(c.type)).size;

        const memberCount = guild.memberCount;
        const botCount = guild.members.cache.filter(member => member.user.bot).size;
        const onlineCount = guild.members.cache.filter(member => member.presence?.status === 'online').size;

        const boostCount = guild.premiumSubscriptionCount;

        const verificationLevels = ['None', 'Low', 'Medium', 'High', 'Very High'];
        const verificationLevel = verificationLevels[guild.verificationLevel];

        const explicitContentFilterLevels = ['Disabled', 'Members without Roles', 'All Members'];
        const explicitContentFilter = explicitContentFilterLevels[guild.explicitContentFilter];

        const mfaLevel = guild.mfaLevel ? 'Enabled' : 'Disabled';

        const afkChannel = guild.afkChannel ? guild.afkChannel.name : 'None';
        const afkTimeout = `${guild.afkTimeout / 60} minutes`;

        const systemChannel = guild.systemChannel ? guild.systemChannel.name : 'None';

        const rulesChannel = guild.rulesChannel ? guild.rulesChannel.name : 'None';

        const publicUpdatesChannel = guild.publicUpdatesChannel ? guild.publicUpdatesChannel.name : 'None';

        const emojiCount = guild.emojis.cache.size;

        const bannerURL = guild.bannerURL() ? guild.bannerURL({ format: 'png', size: 1024 }) : 'None';

        const vanityURLCode = guild.vanityURLCode ? `discord.gg/${guild.vanityURLCode}` : 'None';

        // Create the first embed
        const embed1 = new EmbedBuilder()
            .setColor('#4B0082') // Dark Blue
            .setTitle(`Guild Information: ${guild.name}`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                { name: 'Guild Name', value: guild.name, inline: true },
                { name: 'Guild ID', value: guild.id, inline: true },
                { name: 'Owner', value: `${owner.user.tag}`, inline: true },
                { name: 'Member Count', value: `${memberCount}`, inline: true },
                { name: 'Bot Count', value: `${botCount}`, inline: true },
                { name: 'Online Members', value: `${onlineCount}`, inline: true },
                { name: 'Number of Roles', value: `${guild.roles.cache.size}`, inline: true },
                { name: 'Number of Channels', value: `${channelCount}`, inline: true },
                { name: 'Text Channels', value: `${textChannelCount}`, inline: true },
                { name: 'Voice Channels', value: `${voiceChannelCount}`, inline: true },
                { name: 'Stage Channels', value: `${stageChannelCount}`, inline: true },
                { name: 'Category Channels', value: `${categoryChannelCount}`, inline: true },
                { name: 'News Channels', value: `${newsChannelCount}`, inline: true },
                { name: 'Store Channels', value: `${storeChannelCount}`, inline: true },
                { name: 'Thread Channels', value: `${threadChannelCount}`, inline: true }
            );

        // Create the second embed
        const embed2 = new EmbedBuilder()
            .setColor('#4B0082') // Dark Blue
            .addFields(
                { name: 'Creation Date', value: creationDate, inline: false },
                { name: 'Boost Count', value: `${boostCount}`, inline: true },
                { name: 'Verification Level', value: `${verificationLevel}`, inline: true },
                { name: 'Explicit Content Filter', value: `${explicitContentFilter}`, inline: true },
                { name: 'MFA Level', value: `${mfaLevel}`, inline: true },
                { name: 'AFK Channel', value: `${afkChannel}`, inline: true },
                { name: 'AFK Timeout', value: `${afkTimeout}`, inline: true },
                { name: 'System Channel', value: `${systemChannel}`, inline: true },
                { name: 'Rules Channel', value: `${rulesChannel}`, inline: true },
                { name: 'Public Updates Channel', value: `${publicUpdatesChannel}`, inline: true },
                { name: 'Emoji Count', value: `${emojiCount}`, inline: true },
                { name: 'Banner URL', value: `${bannerURL}`, inline: false },
                { name: 'Vanity URL', value: `${vanityURLCode}`, inline: false },
                { name: 'Top Roles', value: roles.join(', '), inline: false }
            )
            .setFooter({ text: 'Guild Information', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed1, embed2] });
    }
};
