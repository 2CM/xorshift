import Discord = require("discord.js");
import DiscordVoice = require("@discordjs/voice");
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
        var guildMember = await Utils.getInteractionGuildMember(interaction);
        var channel = guildMember.voice.channel;

        if(!channel) {
            interaction.reply("join a vc first");
            return -1;
        }


        //join user vc if needed
        if(!interaction.guild) return Utils.error(interaction, "somehow couldnt find interaction guild");

        var connection = DiscordVoice.getVoiceConnection(interaction.guild?.id);

        if(!connection) {
            //interaction.reply(`joining vc #${channel?.name}`);

            connection = DiscordVoice.joinVoiceChannel({
                channelId: channel?.id,
                guildId: interaction.guild?.id || "",
                adapterCreator: interaction.guild?.voiceAdapterCreator,
            });
        }
    },

}

module.exports = cmd;