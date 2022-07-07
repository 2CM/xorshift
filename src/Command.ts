import Discord = require("discord.js");

export interface Command {
    info: Discord.ApplicationCommandDataResolvable,
    run: Function,
}