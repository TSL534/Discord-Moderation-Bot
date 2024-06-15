const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Create a poll.')
        .addStringOption(option => 
            option.setName('question')
                .setDescription('The poll question')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('option1')
                .setDescription('First option')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('option2')
                .setDescription('Second option')
                .setRequired(true)),
    
    callback: async (interaction) => {
        const question = interaction.options.getString('question');
        const option1 = interaction.options.getString('option1');
        const option2 = interaction.options.getString('option2');

        const pollEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Poll')
            .setDescription(question)
            .addFields(
                { name: option1, value: "1️⃣", inline: false },
                { name: option2, value: "2️⃣", inline: false }
            )
            .setFooter({ text: 'React with the corresponding emoji to vote!' });

        const message = await interaction.reply({ embeds: [pollEmbed], fetchReply: true });
        await message.react('1️⃣');
        await message.react('2️⃣');
    },
};
