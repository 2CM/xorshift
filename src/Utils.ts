import Discord = require("discord.js");

export async function getInteractionGuildMember(interaction: Discord.Interaction<Discord.CacheType>): Promise<Discord.GuildMember> {
    return new Promise((resolve, reject) => {
        interaction.guild?.members.fetch(interaction.user).then(gulidMember => {
            resolve(gulidMember);
        })
    });
}

export async function getGuildMember(guild: Discord.Guild, user: Discord.User): Promise<Discord.GuildMember> {
    return new Promise((resolve, reject) => {
        guild?.members.fetch(user).then(gulidMember => {
            resolve(gulidMember);
        })
    });
}

export function error(interaction: Discord.Interaction<Discord.CacheType>, message: string) {
    var errorString = "ERROR: "+message;

    interaction.channel?.send(errorString);
    console.log(`error while executing an interaction: ${errorString}`);

    return -1;
}

export function multiEquals(...args: any): boolean {
    if(args.length < 2) throw new Error("need at least 2 arguments for multiEquals()");

    for(let i=0;i<args.length-1;i++) {
        if(args[i] != args[i+1]) return false;
    }

    return true;
}