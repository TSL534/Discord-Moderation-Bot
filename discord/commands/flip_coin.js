const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('flip')
        .setDescription('Flip a coin.'),
    
    callback: async (interaction) => {
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
        await interaction.reply({ content: `The coin landed on: ${result}` });
    },
};
