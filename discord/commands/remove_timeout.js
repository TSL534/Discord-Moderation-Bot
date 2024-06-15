const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('remove-timeout')
        .setDescription('Remove timeout from a member.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The member to remove timeout from')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for removing timeout')
                .setRequired(false)),
    
    callback: async (interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: 'You missing this Permission : `Moderate Members`.', ephemeral: true });
        }

        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        const member = interaction.guild.members.cache.get(target.id);
        if (!member) {
            return interaction.reply({ content: 'That user is not in the server.', ephemeral: true });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: 'I do not have permissions to remove timeout from members.', ephemeral: true });
        }

        if (member.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
            console.error(`Role hierarchy prevents removing timeout: ${target.tag} has a higher or equal role than the bot.`);
            return interaction.reply({ content: 'User has a higher or equal role than the bot .', ephemeral: true });
        }

        const removeTimeoutEmbed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('Your timeout has been removed')
            .setDescription(`Your timeout from ${interaction.guild.name} has been removed.`)
            .addFields(
                { name: 'Reason', value: reason }
            );

        try {
            await target.send({ embeds: [removeTimeoutEmbed] });
        } catch (error) {
            console.error(`Could not send DM to ${target.tag}.`);
        }

        try {
            await member.timeout(null, reason); 

            const confirmationEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('Member Timeout Removed')
                .setDescription(`Timeout for ${target.tag} has been removed.`)
                .addFields(
                    { name: 'Reason', value: reason }
                );

            return interaction.reply({ embeds: [confirmationEmbed] });
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Error')
                .setDescription('An error occurred while trying to remove the timeout from the member.',error)
                .addFields(
                    { name: 'Error', value: error.message }
                );

            return interaction.reply({ embeds: [errorEmbed] });
        }
    },
};
