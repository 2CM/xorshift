import Discord = require("discord.js");

export async function getInteractionGuildMember(interaction: Discord.Interaction<Discord.CacheType>): Promise<Discord.GuildMember> {
    return new Promise((resolve, reject) => {
        interaction.guild?.members.fetch(interaction.user).then(user => {
            resolve(user);
        })
    });
}