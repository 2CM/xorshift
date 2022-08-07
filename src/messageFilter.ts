import Discord = require("discord.js");
import * as Utils from "./Utils";

interface filter {
    regex: RegExp,
    name: string,
    function: Function
}

//var filters = new Map<string, filter>();
var filters: filter[] = [];

filters.push({regex: /(1\/)(.+(when).+(use))|(.+(to).+(when))/gi, name: "chanceDo", function: async function(message: Discord.Message) {
    var response = await message.reply(Utils.randomlySelect("nope", "nah", "bruh") + " (4s)");

    setTimeout(async function() {
        if(response.deletable) response.delete();
        if(message.deletable) message.delete();
    }, 4000);
}});

filters.push({regex: /^(>play star spangled banner)$/gim, name: "pssb", function: async function(message: Discord.Message) {
    var response = await message.reply("bruh its " + new Date().toDateString() + "");

    setTimeout(async function() {
        if(response.deletable) response.delete();
    }, 4000);
}});


export function filterMessage(message: Discord.Message) {
    filters.forEach(messageFilter => {
        if(messageFilter.regex.test(message.content)) {
            console.log(`${message.content} matches ${messageFilter.name}`);

            messageFilter.function(message);
        }
    });
}