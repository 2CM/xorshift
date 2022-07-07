import Discord = require("discord.js");

export async function getInteractionGuildMember(interaction: Discord.Interaction<Discord.CacheType>): Promise<Discord.GuildMember> {
    return new Promise((resolve, reject) => {
        interaction.guild?.members.fetch(interaction.user).then(user => {
            resolve(user);
        })
    });
}

export function error(interaction: Discord.Interaction<Discord.CacheType>, message: string) {
    var errorString = "ERROR: "+message;

    interaction.channel?.send(errorString);
    console.log(`error while executing an interaction: ${errorString}`);

    return -1;
}