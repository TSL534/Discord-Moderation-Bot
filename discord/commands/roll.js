const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll a dice.')
        .addIntegerOption(option => 
            option.setName('sides')
                .setDescription('The number of sides on the dice')
                .setRequired(true)),
    
    callback: async (interaction) => {
        const sides = interaction.options.getInteger('sides');
        const result = Math.floor(Math.random() * sides) + 1;
        await interaction.reply({ content: `You rolled a ${result} on a ${sides}-sided dice.` });
    },
};
