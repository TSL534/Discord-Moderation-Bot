const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute a member.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The member to mute')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for muting')
                .setRequired(false)),
    
    callback: async (interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: 'You missing this permission :`ModerateMembers`.', ephemeral: true });
        }

        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = interaction.guild.members.cache.get(target.id);

        if (!member) {
            return interaction.reply({ content: 'That user is not in the server.', ephemeral: true });
        }

        let muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');

        if (!muteRole) {
            return interaction.reply({ content: 'Mute role does not exist. Please create one using /create_mute_role .', ephemeral: true });
        }

        const dmEmbed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('You have been muted')
            .setDescription(`You have been muted in ${interaction.guild.name}.`)
            .addFields(
                { name: 'Reason', value: reason }
            );

        try {
            await target.send({ embeds: [dmEmbed] });
        } catch (error) {
            console.error(`Could not send DM to ${target.tag}.`);
        }

        try {
            await member.roles.add(muteRole, reason);
            return interaction.reply({ content: `${target.tag} has been muted.`, ephemeral: true });
        } catch (error) {
            console.error('Error muting user:', error);
            return interaction.reply({ content: 'An error occurred while trying to mute the member.',error, ephemeral: true });
        }
    },
};
