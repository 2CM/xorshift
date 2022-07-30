import Discord = require("discord.js");
import {Command} from "../Command";
import * as Utils from "../Utils";

var cmd: Command = {
    info: {
        name: "eval",
        description: "no",
        options: [
            {
                name: "string",
                description: "why are you here",
                required: true,
                type: Discord.Constants.ApplicationCommandOptionTypes.STRING
            }
        ]
    },
    run: function(interaction: Discord.Interaction<Discord.CacheType>) {
        if(!interaction.isCommand()) return;
        if(interaction.user.id != "467109079865884674") return;

        Utils; //just to have it exist

        var options = interaction.options;
        
        try {
            eval(options.getString("string") || "");

            console.log("eval'd "+options.getString("string"));
        } catch {
            interaction.reply({content: "eval failed", ephemeral: true});
        }
    }
}

module.exports = cmd;