const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField, GuildMember } = require('discord.js');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a member from the server.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The member to timeout')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('duration')
                .setDescription('Duration of the timeout in minutes')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for timeout')
                .setRequired(false)),
    
    callback: async (interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: 'You missing this permission :`Moderate Members`.', ephemeral: true });
        }

        const target = interaction.options.getUser('target');
        const duration = interaction.options.getInteger('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        const member = interaction.guild.members.cache.get(target.id);
        if (!member) {
            return interaction.reply({ content: 'That user is not in the server.', ephemeral: true });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: 'I do not have permissions to timeout members.', ephemeral: true });
        }

        if (member.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
            console.error(`Role hierarchy prevents timeout: ${target.tag} has a higher or equal role than the bot.`);
            return interaction.reply({ content: 'user has a higher or equal role than the bot..', ephemeral: true });
        }

        const timeoutDuration = duration * 60 * 1000; 
        const timeoutEmbed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('You have been timed out')
            .setDescription(`You have been timed out from ${interaction.guild.name} for ${duration} minutes.`)
            .addFields(
                { name: 'Reason', value: reason }
            );

        try {
            await target.send({ embeds: [timeoutEmbed] });
        } catch (error) {
            console.error(`Could not send DM to ${target.tag}.`);
        }

        try {
            await member.timeout(timeoutDuration, reason);

            const confirmationEmbed = new EmbedBuilder()
                .setColor('#FFA500')
                .setTitle('Member Timed Out')
                .setDescription(`${target.tag} has been timed out for ${duration} minutes.`)
                .addFields(
                    { name: 'Reason', value: reason }
                );

            return interaction.reply({ embeds: [confirmationEmbed] });
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Error')
                .setDescription('An error occurred while trying to timeout the member.',error)
                .addFields(
                    { name: 'Error', value: error.message }
                );

            return interaction.reply({ embeds: [errorEmbed] });
        }
    },
};
