const Discord = require('discord.js');
//fonction qui répond le nombre d'expérence et de cristal de héro pour up un perso d'un niveau a un autre
let exp = (message,Exp) =>{
    const tabMessage = message.content.split(' ');
    if(tabMessage.length == 1 || tabMessage.length > 4 )
    {
        message.channel.send('USAGE : ``?exp niveauMin niveauMax rareté`` \n');
    }
    else if(tabMessage.length == 2)
    {
        if(tabMessage[2] <= 1 && tabMessage[2] > 69)
        {
            message.channel.send("Le niveau doit etre entre 1 et 69");
        }
        else
        {
            //chercher de lvl 1 a val envoyer
            Exp.findOne({where : { lvl : tabMessage[1] }}).then((data) => {
                if(data === null)
                {
                    console.log("erreur finding data : " + message.content);
                }
                else{
                    sendEmbed(message,"Pour monter du niveau 1 au niveau " + tabMessage[1] + " il vous faut : \n" +  "``" + data.expTotal + "`` d'experience", "Experience");
                }
            })
        }
    }
    else if(tabMessage.length == 3)
    {
        if(tabMessage[1] <= 1 && tabMessage[1] > 69 && tabMessage[2] <= 1 && tabMessage[2] > 69)
        {
            message.channel.send("Les niveaux doivent etre entre 1 et 69");
        }
        else
        {
            if(tabMessage[1] > tabMessage[2])
            {
                message.channel.send("Le premier argument dois être plus petit que le deuxième");
            }
            else
            {
                //chercher de lvl arg2 a lvl arg3
                Exp.findOne({where : { lvl : tabMessage[1] }}).then((data1) => {
                if(data1 === null)
                {
                    console.log("erreur finding data 1 : " + message.content);
                }
                else
                {
                    Exp.findOne({where : { lvl : tabMessage[2] }}).then((data2) => {
                        if(data2 === null)
                        {
                            console.log("erreur finding data 2 : " + message.content);
                        }
                        else
                        {
                            const summ = data2.expTotal- data1.expTotal;
                            sendEmbed(message, "Pour monter du niveau " + tabMessage[1] + " au niveau " + tabMessage[2] + " il vous faut : " +  "``" + summ + "`` d'experience", "Experience");
                        }
                    });
                }
            });
            }
        }
    }
    else if(tabMessage.length == 4)
    {
        if(tabMessage[1] > 1 && tabMessage[1] > 74 && tabMessage[2] < 1 && tabMessage[2] > 74)
        {
            message.channel.send("Les niveaux doivent etre entre 1 et 74");
        }
        else if(tabMessage[1] > tabMessage[2])
        {
            message.channel.send("Le premier argument dois être plus petit que le deuxième");
        }
        else if(tabMessage[3] == 1 && (tabMessage[1] > 69 || tabMessage[2] > 69))
        {
            message.channel.send("Tu veux vraiment rupture limite un perso 1 étoile :dono: ???");
        }
        else
        {
            //chercher de lvl arg2 a lvl arg3 pour une rareté arg4
            Exp.findOne({where : { lvl : tabMessage[1], rarete : (tabMessage[1]<69 ? null:tabMessage[1]) }}).then((data1) => {
                if(data1 === null)
                {
                    console.log("erreur finding data 1 : " + message.content);
                }
                else
                {
                    Exp.findOne({where : { lvl : tabMessage[2], rarete :(tabMessage[2]<69 ? null:tabMessage[2]) }}).then((data2) => {
                        if(data2 === null)
                        {
                            console.log("erreur finding data 2 : " + message.content);
                        }
                        else
                        {
                            const summexp = data2.expTotal- data1.expTotal;
                            const summcristal = (data2.cristal===null ? 0:data2.cristal) - (data1.cristal===null ? 0:data1.cristal);
                            sendEmbed(message, "Pour monter du niveau " + tabMessage[1] + " au niveau " + tabMessage[2] + " il vous faut : " +  "``" + summexp + "`` d'experience et ``" + summcristal +"`` cristals de hero", "Experience");
                        }
                    });
                }
            });
        }
    }
    else
    {
        //erreur
        console.log("erreur : " + message.content);
        message.channel.send("Oups un problème est survenue lors de votre demande !!! : ");
    }
}

//
let hero = (message, Hero) =>{

}

let help = (message) =>{
    message.channel.send("HELP :NotLikeThis:");
}


function sendEmbed(message,text, titre)
{
    const embed = new Discord.RichEmbed();
    embed.setTitle(titre);
    embed.setDescription(text);
    embed.setColor(0x00AE86);
    embed.setThumbnail("https://cdn.discordapp.com/attachments/804446503636041759/804740255928287243/Capture_d_Acran_2021-01-29_A__16.48.55-removebg-preview.png");
    message.channel.send({embed});
}

module.exports = {
    exp,
    hero,
    help
}