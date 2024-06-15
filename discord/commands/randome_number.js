const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('random')
        .setDescription('Generate a random number between 1 and a specified maximum.')
        .addIntegerOption(option => 
            option.setName('max')
                .setDescription('The maximum number')
                .setRequired(true)),
    
    callback: async (interaction) => {
        const max = interaction.options.getInteger('max');
        const randomNumber = Math.floor(Math.random() * max) + 1;
        await interaction.reply({ content: `Your random number between 1 and ${max} is: ${randomNumber}` });
    },
};
