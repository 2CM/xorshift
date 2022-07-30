import Discord = require("discord.js");
import {Command} from "../Command";

var cmd: Command = {
    info: {
        name: "echo",
        description: "repeats user input",
        options: [
            {
                name: "message",
                description: "message to repeat",
                required: true,
                type: Discord.Constants.ApplicationCommandOptionTypes.STRING
            }
        ]
    },
    run: function(interaction: Discord.Interaction<Discord.CacheType>) {
        if(!interaction.isCommand()) return;

        var options = interaction.options;
        
        
        interaction.reply({content: "done", ephemeral: true});

        interaction.channel?.send(options.getString("message") || "");

        
        console.log(options.getString("message"));
    }
}

module.exports = cmd;