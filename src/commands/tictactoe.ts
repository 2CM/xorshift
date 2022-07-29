import Discord = require("discord.js");
import {Command} from "../Command";
import * as Utils from "../Utils";

type tile = "" | "x" | "o";

type angle = "" | "x" | "y" | "d";

interface winnerInfo {
    won: boolean,
    winner?: tile,
    location?: number,
    angle?: angle,
}

//define emojis we're using
var emojis = {
    blank: "⬛",
    x: "❌",
    o: "⭕",
}

function tileToEmoji(tile: tile): string {
    if(tile == "") return emojis.blank;
    
    return emojis[tile];
}

function tileIsPlaced(tile: tile): boolean {
    if(tile == "o") return true;
    if(tile == "x") return true;
    
    return false;
}


//check if theres a winner on the board
function checkForWinner(board: tile[]): winnerInfo {
    //check horizontal
    for(let x=0;x<3;x++) {
        if(Utils.multiEquals(board[(x*3)+0], board[(x*3)+1], board[(x*3)+2]) && tileIsPlaced(board[(x*3)+0]))  { //row is equal
            return {
                won: true,
                winner: board[(x*3)+0],
                location: x,
                angle: "x"
            }
        }
    }

    //check vertical
    for(let y=0;y<3;y++) {
        if(Utils.multiEquals(board[y+0], board[y+3], board[y+6]) && tileIsPlaced(board[y+0]))  { //column is equal
            return {
                won: true,
                winner: board[y+0],
                location: y,
                angle: "y"
            }
        }
    }

    //check diagonals
    if(Utils.multiEquals(board[0+0], board[3+1], board[6+2]) && tileIsPlaced(board[0+0]))  { //first diagonal is equal
        return {
            won: true,
            winner: board[0+0],
            location: 0,
            angle: "d"
        }
    }

    if(Utils.multiEquals(board[0+2], board[3+1], board[6+0]) && tileIsPlaced(board[0+2]))  { //first diagonal is equal
        return {
            won: true,
            winner: board[0+2],
            location: 1,
            angle: "d"
        }
    }
    
    
    //check for tie
    var isTie = !new Set(board).has("");

    if(isTie) {
        return {
            won: true,
            winner: "",
            location: 0,
            angle: ""
        }
    }

    return {won: false}
}


var cmd: Command = {
    info: {
        name: "tictactoe",
        description: "play a game of tic tac toe",
        options: [
            {
                name: "challenged",
                description: "who to challenge to a game",
                required: true,
                type: Discord.Constants.ApplicationCommandOptionTypes.USER
            },
        ]
    },
    run: async function(interaction: Discord.Interaction<Discord.CacheType>, client: Discord.Client) {
        if(!interaction.isCommand()) return;
        if(!interaction.guild) return;

        var options = interaction.options;

        var challenged = options.getUser("challenged");

        if(!challenged) return;

        if(challenged?.bot) {
            interaction.reply({content: "you cannot challenge a bot!", ephemeral: true})
            return -1;
        }

        if(challenged?.id == interaction.user.id) {
            interaction.reply({content: "you cannot challenge yourself!", ephemeral: true})
            return -1;
        }

        var challengedGuildMember = await Utils.getGuildMember(interaction.guild, challenged);
        var challengedStatus = challengedGuildMember.presence?.status;

        //console.log(challengedStatus);

        /*
        if(challengedStatus != "online") {
            interaction.reply({content: "user challenged's status is either idle, on DND, or offline. dont wanna waste time challenging someone who might not respond", ephemeral: true})
            return -1;
        }
        */


        //game variables
        let turn = 0;
        let winnerState: winnerInfo = {won: false};
        let startTime = performance.now();

        interaction.reply(`tic tac toe game between <@${interaction.user.id}> and ${challenged} initiated!`);

        let board: tile[] = [
            "","","",
            "","","",
            "","","",
        ]

        //generate button table
        function generateButtonTable() {
            var buttonTable: Discord.MessageActionRow[] = [];

            for(let i=0;i<3;i++) {
                buttonTable[i] = new Discord.MessageActionRow();
                for(let j=0;j<3;j++) {
                    let boardPos = i*3+j;

                    let component = new Discord.MessageButton()
                        .setCustomId(`${j}_${i}_${boardPos}`) //coords of it
                        .setStyle("SECONDARY")
                        .setEmoji(emojis.blank) //blank emoji

                    //if(boardTile != "") component.setDisabled(true);

                    buttonTable[i].addComponents(component);
                }
            }

            return buttonTable
        }

        let buttonTable = generateButtonTable();

        
        //generate embed
        function generateEmbed() {
            let rows: any[] = []

            for(let i=0;i<3;i++) {
                rows[i] = [];
                for(let j=0;j<3;j++) {
                    let boardPos = i*3+j;
                    let boardTile = board[boardPos];

                    rows[i].push(tileToEmoji(boardTile))
                }
                rows[i] = rows[i].join(" ");
            }

            if(winnerState.won) {
                let winnerName = "";

                if(winnerState.winner == "x") winnerName = interaction.user.username;
                if(winnerState.winner == "o") winnerName = challenged?.username || "ERROR";
                if(winnerState.winner == "") winnerName = "nobody"

                rows.push(`${winnerName} wins! ${winnerState.winner == "" ? "(TIE) " : ""}(${((performance.now()-startTime)/1000).toFixed(2)}s)`)
            }

            var messageEmbed = new Discord.MessageEmbed()
                .setColor("#6c8bc4")
                .setTitle("tic tac toe")
                .addFields(
                    {name: "tiles: ", value: rows.join("\n")}
                )

            return messageEmbed;
        }
        

        //send it
        let sentMessage = await interaction.channel?.send(
            {
                embeds: [generateEmbed()],
                components: buttonTable
            }
        )

        let collector = interaction.channel?.createMessageComponentCollector({ componentType: 'BUTTON', time: 120*1000 });

        //listener for users interacting with the buttons
        collector?.on("collect", async i => {
            var correctUser = (turn % 2) == 0 ? interaction.user : challenged;
            var incorrectUser = (turn % 2) == 1 ? interaction.user : challenged;

            var correctUserTile: tile = (turn % 2) == 0 ? "x" : "o";


            if(i.message.id == sentMessage?.id) {
                if(i.user.id == correctUser?.id) {
                    setTimeout(async () => {
                        let buttonTilePos = i.customId.split("_").map(ele => Number(ele));
                        
                        board[buttonTilePos[2]] = correctUserTile;

                        winnerState = checkForWinner(board);

                        if(winnerState.won) {

                            //disable all buttons
                            for(let i=0;i<3;i++) {
                                for(let j=0;j<3;j++) {
                                    buttonTable[i].components[j].setDisabled(true);
                                }
                            }
                        }
                        

                        buttonTable[buttonTilePos[1]].components[buttonTilePos[0]].setDisabled(true);

                        turn += 1;
                        await i.update("current turn: "+turn);
                        await sentMessage?.edit({
                            embeds: [generateEmbed()],
                            components: buttonTable,
                        })

                        /*
                        console.log(board.slice(0,3));
                        console.log(board.slice(3,6));
                        console.log(board.slice(6,9));
                        console.log(winnerState)
                        console.log("-------------------------");
                        */
                    }, 300)
                } else if(i.user.id == incorrectUser?.id) {
                    await i.reply({content: "its the other players turn right now!", ephemeral: true})
                } else {
                    await i.reply({content: "you arent in this game!", ephemeral: true})
                }
            }
        });

        return 1;
    },
}

module.exports = cmd;