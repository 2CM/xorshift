import fs = require("fs");
import Discord = require("discord.js");
import path = require("path");
import {Command} from "./Command";
import * as messageFilter from "./messageFilter";

var dotenv = JSON.parse(fs.readFileSync("./.env", "utf8"));

var client = new Discord.Client(
    {
        intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES", "GUILD_MESSAGE_REACTIONS", "GUILD_VOICE_STATES"],
        partials: ["CHANNEL"] 
    }
);

var cmds = new Map<String, Command>();


client.once("ready", () => {
    console.log("bot online at "+new Date());

    var guilds = client.guilds.cache;

    //load all commands into cmds
    var commandDir = fs.readdirSync(path.join(__dirname, "/commands"));

    commandDir.forEach((cmdFileName: string) => {
        let name = cmdFileName.slice(0,-3)

        let cmdInfo: Command = require("./commands/"+cmdFileName);

        cmds.set(name, cmdInfo);

        guilds.forEach(guild => {
            var commands: any;

            if(guild) {
                commands = guild.commands;
            } else {
                commands = client.application?.commands;
            }
        
            commands?.create(cmdInfo.info);
        })
    });
});

client.on("interactionCreate", async (interaction) => {
    if(interaction.isCommand()) {
        var { commandName, options} = interaction;

        console.log(`${interaction.user.username} used ${commandName}`);
        var running = cmds.get(commandName)?.run(interaction,client);
    } else if(interaction.isButton()) {
        
    }
});

client.on("messageCreate", (message) => {
    if(message.author.bot) return;

    messageFilter.filterMessage(message);
})

client.login(dotenv.token);