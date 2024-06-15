const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a member from the server.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The member to ban')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for banning')
                .setRequired(false)),
    
    callback: async (interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: 'You missing the Permission : `BanMembers `', ephemeral: true });
        }

        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        const member = interaction.guild.members.cache.get(target.id);
        if (!member) {
            return interaction.reply({ content: 'The user is not in the server.', ephemeral: true });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: 'I need this Permission : `BanMembers`.', ephemeral: true });
        }

        if (member.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
            console.error(`The user: ${target.tag} has a higher or equal role than me.`);
            return interaction.reply({ content: 'The user has a higher or equal role than me.', ephemeral: true });
        }

        await interaction.deferReply();

        const dmEmbed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('You have been banned')
            .setDescription(`You have been banned from ${interaction.guild.name}.`)
            .addFields(
                { name: 'Reason', value: reason }
            );

        try {
            await target.send({ embeds: [dmEmbed] });
        } catch (error) {
            console.error(`Could not send DM to ${target.tag}.`);
        }

        try {
            await member.ban({ reason });

            const banEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Member Banned')
                .setDescription(`${target.tag} has been banned.`)
                .addFields(
                    { name: 'Reason', value: reason }
                );

            return interaction.editReply({ embeds: [banEmbed] });
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Error')
                .setDescription('An error occurred while trying to ban the member.',error)
                .addFields(
                    { name: 'Error', value: error.message }
                );

            return interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};
