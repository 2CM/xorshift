import Discord = require("discord.js");
import {Command} from "../Command";
import * as Utils from "../Utils";

var cmd: Command = {
    info: {
        name: "play",
        description: "plays a song in command sender's vc",
        options: [
            {
                name: "url",
                description: "url of video",
                required: true,
                type: Discord.Constants.ApplicationCommandOptionTypes.STRING,
            }
        ]
    },
    run: async function(interaction: Discord.Interaction<Discord.CacheType>, client: Discord.Client) {
        if(!interaction.isCommand()) return;

        //find what channel the user is in

        var sender = await Utils.getInteractionGuildMember(interaction);
        interaction.reply(`you are in ${sender.voice.channel?.name}`);
    }
}

module.exports = cmd;