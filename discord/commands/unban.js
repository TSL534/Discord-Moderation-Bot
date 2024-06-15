const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a member from the server.')
        .addStringOption(option => 
            option.setName('userid')
                .setDescription('The ID of the member to unban')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for unbanning')
                .setRequired(false)),
    
    callback: async (interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: 'You missing this Permission : `Ban Members`.', ephemeral: true });
        }

        const userId = interaction.options.getString('userid');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        await interaction.deferReply();

        try {
            const bannedUser = await interaction.guild.bans.fetch(userId);
            if (!bannedUser) {
                return interaction.editReply({ content: 'This user is not banned.', ephemeral: true });
            }

            await interaction.guild.bans.remove(userId, reason);

            const unbanEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('Member Unbanned')
                .setDescription(`User with ID ${userId} has been unbanned.`)
                .addFields(
                    { name: 'Reason', value: reason }
                );

            return interaction.editReply({ embeds: [unbanEmbed] });
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('Error')
                .setDescription('An error occurred while trying to unban the member.')
                .addFields(
                    { name: 'Error', value: error.message }
                );

            return interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};
