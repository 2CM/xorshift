import Discord = require("discord.js");
import {Command} from "../Command";

var cmd: Command = {
    info: {
        name: "random",
        description: "creates a random number between X and Y",
        options: [
            {
                name: "min",
                description: "minimum number (default 1)",
                required: false,
                type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER
            },
            {
                name: "max",
                description: "maximum number (default 10)",
                required: false,
                type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER
            },
            {
                name: "count",
                description: "how many numbers to generate (default is 1)",
                required: false,
                type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER,
            },
            {
                name: "decimal",
                description: "if the result should be a decimal or not (default false)",
                required: false,
                type: Discord.Constants.ApplicationCommandOptionTypes.BOOLEAN,
            },
        ]
    },
    run: function(interaction: Discord.Interaction<Discord.CacheType>) {
        if(!interaction.isCommand()) return;
        
        var options = interaction.options;

        var min = options.getNumber("min") || 1;
        var max = options.getNumber("max") || 10;
        var count = options.getNumber("count") || 1;
        var decimal = options.getBoolean("decimal") || false;

        var replyString = "";

        for(let i=0;i<count;i++) {
            let unrounded = Math.random()*(max-min)+min

            replyString += (decimal ? unrounded : Math.round(unrounded)) + "\n";
        }

        interaction.reply(replyString);
    }
}

module.exports = cmd;