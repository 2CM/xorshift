import Discord = require("discord.js");
import {Command} from "../Command";
import * as Utils from "../Utils";
import * as wordleWords from "../other/wordleWords";


//emojis being used as feedback
var feedbackIcons = "⬛ 🟩 🟨".split(" ");

var victoryMessages = ["Genius","Magnificent","Impressive","Splendid","Great","Phew"];

function selectAnswer(): string {
    return wordleWords.he[Math.round(Math.random()*wordleWords.he.length)];
}


var cmd: Command = {
    info: {
        name: "wordle",
        description: "wordle",
    },
    run: async function(interaction: Discord.Interaction<Discord.CacheType>, client: Discord.Client) {
        if(!interaction.isCommand()) return;
        
        var answer = selectAnswer();
        var board: string[] = [];
        var feedback: number[][] = [];

        function compare(guess: string): number[] { //slighly adjusted from https://stackoverflow.com/questions/71324956/wordle-implementation-dealing-with-duplicate-letters-edge-case
            let remainingLettersInWord: string = answer+"";
            let output: number[] = [];

            for (let i = 0; i < 5; i++) {
                if (guess[i] == answer[i]) {
                    remainingLettersInWord = remainingLettersInWord.replace(guess[i], "");
                    output[i] = 1;
                } else {
                    output[i] = 0;
                }
            }

            for (let i = 0; i < 5; i++) {
                if (remainingLettersInWord.includes(guess[i]) && guess[i] != answer[i]) {
                    remainingLettersInWord = remainingLettersInWord.replace(guess[i], "");
                    output[i] = 2;
                }
            }

            return output;
        }

        
        function boardToEmbed() {
            var rows: string[] = [];

            for(let guess=0;guess<6;guess++) {
                if(board[guess]) {
                    rows[guess] = board[guess].split("").map(value => Utils.letterToEmoji(value)).join("") + "\n" + feedback[guess].map(value => feedbackIcons[value]).join("");
                } else {
                    rows[guess] = "🔲".repeat(answer.length) + "\n" + "⬛".repeat(answer.length);
                }
            }

            var messageEmbed = new Discord.MessageEmbed()
                .setColor("#6c8bc4")
                .setTitle("wordle")
                .addFields(
                    {name: "wordle", value: rows.join("\n")}
                )

            return messageEmbed;
        }

        interaction.reply("wordle created");

        var boardMessage = await interaction.channel?.send({embeds: [boardToEmbed()]});

        var guessListener = client.on("messageCreate", onGuess);
        
        
        async function onGuess(guess: Discord.Message) {
            var messageValid = true;

            if(guess.channel.id == interaction.channel?.id) {
                if(guess.content.length != answer.length && guess.author.id == interaction.user.id) {
                    var reply = await guess.reply(`guess needs to be ${answer.length} letters long (3s)`);

                    setTimeout(async () => {await reply.delete(); await guess.delete()}, 3000);

                    messageValid = false;
                }

                if((!wordleWords.setBe.has(guess.content) && !wordleWords.setHe.has(guess.content)) && guess.content.length == answer.length && guess.author.id == interaction.user.id) {
                    var reply = await guess.reply(`not a valid word (3s)`);

                    setTimeout(async () => {await reply.delete(); await guess.delete()}, 3000);

                    messageValid = false;
                }

                if(guess.author.id != interaction.user.id) {
                    messageValid = false;
                }
            } else {
                messageValid = false;
            }

            if(messageValid) {

                board.push(guess.content);

                var guessFeedback = compare(guess.content);
                feedback.push(guessFeedback);

                //console.log(guessFeedback);
                //guess.channel.send(guessFeedback.map(value => feedbackIcons[value]).join(" "));

                await guess.delete();
                await boardMessage?.edit({embeds: [boardToEmbed()]});

                if(guessFeedback.join("") == "1".repeat(answer.length)) {
                    await interaction.channel?.send(victoryMessages[board.length-1]);
                    guessListener.off("messageCreate", onGuess);
                    return;
                }

                if(board.length == 6) {
                    await interaction.channel?.send("oopsie woopsies. the word was "+answer);
                    guessListener.off("messageCreate", onGuess);
                    return;
                }
            }
        }
    }
}

module.exports = cmd;