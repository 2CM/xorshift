import Discord = require("discord.js");
import {Command} from "../Command";

var cmd: Command = {
    info: {
        name: "banan",
        description: "banan🍌",
    },
    run: function(interaction: Discord.Interaction<Discord.CacheType>) {
        if(!interaction.isCommand()) return;
        
        interaction.reply(`banan 🍌`);

        var bananChannel = interaction.guild?.channels.cache.get("1001998162971599048");
        if(!bananChannel?.isText() || !bananChannel) return;


        var bananGif = "https://tenor.com/view/pass-banana-gif-23743798";

        bananChannel.send(bananGif);
    }
}

module.exports = cmd;