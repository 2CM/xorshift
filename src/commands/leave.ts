import Discord = require("discord.js");
import DiscordVoice = require("@discordjs/voice");
import {Command} from "../Command";
import * as Utils from "../Utils";

var cmd: Command = {
    info: {
        name: "leave",
        description: "leaves current vc",
        options: [

        ]
    },
    run: async function(interaction: Discord.Interaction<Discord.CacheType>, client: Discord.Client) {
        if(!interaction.isCommand()) return;

        if(!interaction.guild) return Utils.error(interaction, "somehow couldnt find interaction guild");

        var connection = DiscordVoice.getVoiceConnection(interaction.guild?.id);

        if(!connection) {
            interaction.reply("im not in any channels tho ._.");
            return;
        }

        connection?.destroy();

        interaction.reply("left vc UwU");
    },

}

module.exports = cmd;