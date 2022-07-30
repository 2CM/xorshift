import Discord = require("discord.js");
import {Command} from "../Command";

var cmd: Command = {
    info: {
        name: "button",
        description: "buton",
    },
    run: function(interaction: Discord.Interaction<Discord.CacheType>) {
        if(!interaction.isCommand()) return;
        
        interaction.reply({content: "button", ephemeral: true});

        var buttonChannel = interaction.guild?.channels.cache.get("1002639872709902336");
        if(!buttonChannel?.isText() || !buttonChannel) return;

        var buttonMessage = "button";

        buttonChannel.send(buttonMessage);
    }
}

module.exports = cmd;