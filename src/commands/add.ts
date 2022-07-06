import Discord = require("discord.js");
import {Command} from "../Command";

var cmd: Command = {
    info: {
        name: "add",
        description: "adds 2 numbers together",
        options: [
            {
                name: "num1",
                description: "1st number",
                required: true,
                type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER
            },
            {
                name: "num2",
                description: "2nd number",
                required: true,
                type: Discord.Constants.ApplicationCommandOptionTypes.NUMBER
            }
        ]
    },
    run: function(interaction: Discord.Interaction<Discord.CacheType>) {
        if(!interaction.isCommand()) return;
        
        var options = interaction.options;

        var num1 = options.getNumber("num1") || 0;
        var num2 = options.getNumber("num2") || 0;

        interaction.reply(`${num1} + ${num2} = ${num1+num2}`);
    }
}

module.exports = cmd;