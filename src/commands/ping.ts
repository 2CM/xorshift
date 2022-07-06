import Discord = require("discord.js");
import {Command} from "../Command";

var cmd: Command = {
    info: {
        name: "ping",
        description: "ping command",
    },
    run: function(interaction: Discord.Interaction<Discord.CacheType>) {
        if(!interaction.isCommand()) return;
        
        interaction.reply(`pong! (${new Date().getTime()-interaction.createdTimestamp}ms)`);
    }
}

module.exports = cmd;