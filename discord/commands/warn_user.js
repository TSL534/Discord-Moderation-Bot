const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');

const warningsFilePath = path.resolve(__dirname, '..', 'warnings.json');
let warnings = {};

try {
    if (fs.existsSync(warningsFilePath)) {
        warnings = JSON.parse(fs.readFileSync(warningsFilePath, 'utf8'));
    }
} catch (error) {
    console.error('Error reading warnings file:', error);
}

const saveWarnings = () => {
    try {
        fs.writeFileSync(warningsFilePath, JSON.stringify(warnings, null, 2));
    } catch (error) {
        console.error('Error writing to warnings file:', error);
    }
};

module.exports = {
    command: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a member.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('The member to warn')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for warning')
                .setRequired(false)),
    
    callback: async (interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: 'You do not have permissions to warn members.', ephemeral: true });
        }

        const target = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = interaction.guild.members.cache.get(target.id);

        if (!member) {
            return interaction.reply({ content: 'That user is not in the server.', ephemeral: true });
        }

        if (!warnings[target.id]) {
            warnings[target.id] = {
                count: 0,
                reasons: []
            };
        }

        warnings[target.id].count += 1;
        warnings[target.id].reasons.push(reason);
        saveWarnings();

        const warnCount = warnings[target.id].count;

        let punishment = null;
        let duration = null;

        switch (warnCount) {
            case 2:
                duration = 5 * 60 * 1000; // 5 minutes
                punishment = 'timeout';
                break;
            case 3:
                duration = 10 * 60 * 1000; // 10 minutes
                punishment = 'timeout';
                break;
            case 4:
                duration = 60 * 60 * 1000; // 1 hour
                punishment = 'timeout';
                break;
            case 5:
                punishment = 'ban';
                break;
            default:
                punishment = null;
        }

        const warnEmbed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('Member Warned')
            .setDescription(`${target.tag} has been warned.`)
            .addFields(
                { name: 'Reason', value: reason },
                { name: 'Total Warnings', value: `${warnCount}` }
            );

        await interaction.reply({ embeds: [warnEmbed] });

        if (punishment) {
            if (punishment === 'timeout') {
                try {
                    await member.timeout(duration, `Reached ${warnCount} warnings.`);
                    const timeoutEmbed = new EmbedBuilder()
                        .setColor('#FFA500')
                        .setTitle('Member Timed Out')
                        .setDescription(`${target.tag} has been timed out for ${duration / (60 * 1000)} minutes.`)
                        .addFields(
                            { name: 'Reason', value: `Reached ${warnCount} warnings.` }
                        );

                    return interaction.followUp({ embeds: [timeoutEmbed] });
                } catch (error) {
                    console.error(error);
                    const errorEmbed = new EmbedBuilder()
                        .setColor('#FF0000')
                        .setTitle('Error')
                        .setDescription('An error occurred while trying to timeout the member.')
                        .addFields(
                            { name: 'Error', value: error.message }
                        );

                    return interaction.followUp({ embeds: [errorEmbed] });
                }
            } else if (punishment === 'ban') {
                try {
                    await member.ban({ reason: `Reached ${warnCount} warnings.` });
                    const banEmbed = new EmbedBuilder()
                        .setColor('#FF0000')
                        .setTitle('Member Banned')
                        .setDescription(`${target.tag} has been banned for reaching ${warnCount} warnings.`);

                    return interaction.followUp({ embeds: [banEmbed] });
                } catch (error) {
                    console.error(error);
                    const errorEmbed = new EmbedBuilder()
                        .setColor('#FF0000')
                        .setTitle('Error')
                        .setDescription('An error occurred while trying to ban the member.')
                        .addFields(
                            { name: 'Error', value: error.message }
                        );

                    return interaction.followUp({ embeds: [errorEmbed] });
                }
            }
        }
    },
};
