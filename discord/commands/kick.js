const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a member from the server.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The member to kick')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for kicking')
                .setRequired(false)),
    
    callback: async (interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply({ content: 'You missing this Permission : `KickMembers`.', ephemeral: true });
        }

        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        const member = interaction.guild.members.cache.get(target.id);
        if (!member) {
            return interaction.reply({ content: 'That user is not in the server.', ephemeral: true });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply({ content: 'I missing this permission : `KickMembers`.', ephemeral: true });
        }

        if (member.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
            console.error(`The user ${target.tag} has a higher or equal role than the bot.`);
            return interaction.reply({ content: 'Error :The user has a higher or equal role than the bot .', ephemeral: true });
        }

        const dmEmbed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('You have been kicked')
            .setDescription(`You have been kicked from ${interaction.guild.name}.`)
            .addFields(
                { name: 'Reason', value: reason }
            );

        try {
            await target.send({ embeds: [dmEmbed] });
        } catch (error) {
            console.error(`Could not send DM to ${target.tag}.`, error);
        }

        try {
            await member.kick(reason);

            const kickEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Member Kicked')
                .setDescription(`${target.tag} has been kicked.`)
                .addFields(
                    { name: 'Reason', value: reason }
                );

            return interaction.reply({ embeds: [kickEmbed] });
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Error')
                .setDescription('An error occurred while trying to kick the member.',error)
                .addFields(
                    { name: 'Error', value: error.message }
                );

            return interaction.reply({ embeds: [errorEmbed] });
        }
    },
};
