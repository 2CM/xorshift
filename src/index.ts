import Discord = require("discord.js");
import fs = require("fs");

var client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES", "GUILD_MESSAGE_REACTIONS"], partials: ["CHANNEL"] });
var token = JSON.parse(fs.readFileSync("./.env", "utf8")).token;

client.login(token);