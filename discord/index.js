const discord = require("discord.js")
const fs = require("fs")
module.exports = {
    /** @param {discord.Client} client */
    "onLogin": async (client) => {
        // create all commands
        console.log(console.yellow + "[INFO]  " + console.default +  "Successfully logged into " +  console.blue + console.bold + client.user.username)
        await new Promise(r => setTimeout(r, 1000))
        const rest = client.rest;

        const commands = [];
        try {
            fs.readdirSync(__dirname + "/commands").forEach((file) => {
                const command = require(__dirname + `/commands/${file}`);
                const cmd = command.command;
                cmd.setName(file.split(".")[0]);
                commands.push(cmd.toJSON());
            });
        } catch (e) {
            console.log(console.red + "[ERROR]" + console.default, e);
        }
        (async () => {
            try {
                console.log(console.yellow + "[INFO]  " + console.default + "Started refreshing " + commands.length + " application (/) command(s).");
                await new Promise((r) => setTimeout(r, 5000));
                await rest.put(discord.Routes.applicationCommands(client.application.id), { body: commands });
                console.log(console.yellow + "[INFO]  " + console.default + "Successfully reloaded " + commands.length + " application (/) command(s).");
            } catch (error) {
                console.log(console.red + "[ERROR]" + console.default, error);
            }
        })();
        const cache = {}
        client.on("interactionCreate", (interaction) => {
            if (!interaction || !interaction?.isCommand?.()) return;
            console.log(console.yellow + "[INFO]  " + console.default + "Interaction recieved." + ` Command: ${console.yellow}${interaction.commandName}${console.default} | User: ${console.blue}${console.bold}${interaction.user.username}#${interaction.user.discriminator}`);
    
            try {
                if (cache[__dirname + `/commands/${interaction.commandName}.js`] !== fs.statSync(__dirname + `/commands/${interaction.commandName}.js`).mtimeMs) {
                    delete require.cache[require.resolve(__dirname + `/commands/${interaction.commandName}.js`)];
                    cache[__dirname + `/commands/${interaction.commandName}.js`] = fs.statSync(__dirname + `/commands/${interaction.commandName}.js`).mtimeMs;
                    console.log(console.yellow + "[INFO]  " + console.default + "Command file has been updated." + ` Command: ${interaction.commandName}`);
                }
                var command = require(__dirname + `/commands/${interaction.commandName}.js`);
            } catch (e) {
                console.error(e)
                console.log(console.red + "[ERROR]" + console.default, `Command "${interaction.commandName}" not found.`);
            }
            try {
                if (!command.callback) throw new Error("Callback not found.");
                if (command.permission && !command.permission(interaction))
                    return interaction.reply({
                        embeds: [new discord.EmbedBuilder().setTitle("ERROR").setDescription(`You do not have permission to use this command.`).setColor(0xff0000)],
                    });
                command.callback(interaction);
            } catch (e) {
                console.log(console.red + "[ERROR]" + console.default, e.stack);
            }
        });
    }
}