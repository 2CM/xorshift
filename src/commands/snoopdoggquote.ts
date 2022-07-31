import Discord = require("discord.js");
import {Command} from "../Command";
import * as Utils from "../Utils";
import * as request from "request";

var cmd: Command = {
    info: {
        name: "snoopdoggquote",
        description: "responds with a random quote from snoop dogg",
    },
    run: async function(interaction: Discord.Interaction<Discord.CacheType>) {
        if(!interaction.isCommand()) return;
        
        await interaction.reply("*fetching...*");

        var req = request.get("http://www.snoop.rest/get", async (err, res) => {
            if(err) {
                console.log("snoop dogg quote err: "+err);
                await interaction.editReply(`it borque! o no`);
                return -1;
            }

            var data = JSON.parse(res.body);

            await interaction.editReply(`*${data.quote}*`);
        });
    }
}

module.exports = cmd;