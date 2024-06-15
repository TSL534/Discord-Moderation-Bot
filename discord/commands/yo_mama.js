const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('yo_mama')
        .setDescription('Get a random Yo Mama joke.'),
    
    callback: async (interaction) => {
        try {
            const jokesPath = path.resolve(__dirname, '..', 'mama.json');
            const jokes = JSON.parse(fs.readFileSync(jokesPath, 'utf8'));

            if (jokes.length === 0) {
                return interaction.reply({ content: 'No jokes found.', ephemeral: true });
            }

            const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
            await interaction.reply({ content: randomJoke });
        } catch (error) {
            console.error('Error fetching joke:', error);
            await interaction.reply({ content: 'An error occurred while fetching a joke.', ephemeral: true });
        }
    },
};
