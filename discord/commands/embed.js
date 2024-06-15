const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Create an embed message.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Create a custom embed.')
                .addStringOption(option => 
                    option.setName('color')
                        .setDescription('The color of the embed.')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Blue', value: '#0099ff' },
                            { name: 'Green', value: '#00ff00' },
                            { name: 'Red', value: '#ff0000' },
                            { name: 'Yellow', value: '#ffff00' },
                            { name: 'Purple', value: '#800080' },
                            { name: 'Orange', value: '#ffa500' },
                            { name: 'Cyan', value: '#00ffff' },
                            { name: 'Magenta', value: '#ff00ff' },
                            { name: 'Lime', value: '#00ff00' },
                            { name: 'Pink', value: '#ffc0cb' },
                            { name: 'Brown', value: '#a52a2a' },
                            { name: 'Black', value: '#000000' },
                            { name: 'White', value: '#ffffff' }
                        ))
                .addStringOption(option => 
                    option.setName('text')
                        .setDescription('The text to display in the embed.')
                        .setRequired(true))
                .addChannelOption(option => 
                    option.setName('channel')
                        .setDescription('The channel to send the embed to.')
                        .setRequired(true)
                        .addChannelTypes(ChannelType.GuildText))),
    
    callback: async (interaction) => {
        const color = interaction.options.getString('color');
        const text = interaction.options.getString('text');
        const channel = interaction.options.getChannel('channel');

        if (!channel.permissionsFor(interaction.client.user).has(PermissionsBitField.Flags.SendMessages)) {
            return interaction.reply({ content: 'I do not have permission to send messages in the specified channel.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(color)
            .setDescription(text);

        try {
            await channel.send({ embeds: [embed] });
            return interaction.reply({ content: 'Embed created successfully.', ephemeral: true });
        } catch (error) {
            console.error('Error creating embed:', error);
            return interaction.reply({ content: 'An error occurred while creating the embed.',error, ephemeral: true });
        }
    },
};
