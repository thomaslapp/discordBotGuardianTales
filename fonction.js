const Discord = require('discord.js');
const { Sequelize, ENUM, or } = require('sequelize');
const Op = Sequelize.Op;
//fonction qui répond le nombre d'expérence et de cristal de héro pour up un perso d'un niveau a un autre
let exp = (message, Exp, client) => {
    const tabMessageRes = message.content.split(' ');
    var tabMessage = [-1, -1, -1, -1];
    let erreur = false;
    for (let i = 1; i < tabMessageRes.length && !erreur; i++) {
        if (!Number.isInteger(Number(tabMessageRes[i]))) {
            erreur = true;
        }
        tabMessage[i] = Number(tabMessageRes[i]);
    }


    if (tabMessageRes.length == 1 || tabMessageRes.length > 4 || erreur) {
        message.channel.send('USAGE : ``?exp niveauMin niveauMax rareté`` \n');
    }
    else if (tabMessageRes.length == 2) {
        if (tabMessage[1] < 1 || tabMessage[1] > 69) {
            message.channel.send("Le niveau doit etre compres entre 1 et 69");
        }
        else {
            //chercher de lvl 1 a val envoyer
            Exp.findOne({ where: { lvl: tabMessage[1] } }).then((data) => {
                if (data === null) {
                    console.log("erreur finding data : " + message.content);
                }
                else {
                    sendEmbed(message, "Pour monter du niveau 1 au niveau " + tabMessage[1] + " il vous faut : \n" + "``" + data.expTotal + "`` d'experience", "Experience");
                }
            })
        }
    }
    else if (tabMessageRes.length == 3) {
        if (tabMessage[1] < 1 || tabMessage[1] > 69 || tabMessage[2] < 1 || tabMessage[2] > 69) {
            message.channel.send("Les niveaux doivent etre entre 1 et 69");
        }
        else {
            if (tabMessage[1] > tabMessage[2]) {
                message.channel.send("Le premier argument : " + tabMessage[1] + ", dois être plus petit que le deuxième : " + tabMessage[2]);
            }
            else {
                //chercher de lvl arg2 a lvl arg3
                Exp.findOne({ where: { lvl: tabMessage[1] } }).then((data1) => {
                    if (data1 === null) {
                        console.log("erreur finding data 1 : " + message.content);
                    }
                    else {
                        Exp.findOne({ where: { lvl: tabMessage[2] } }).then((data2) => {
                            if (data2 === null) {
                                console.log("erreur finding data 2 : " + message.content);
                            }
                            else {
                                const summ = data2.expTotal - data1.expTotal;
                                sendEmbed(message, "Pour monter du niveau " + tabMessage[1] + " au niveau " + tabMessage[2] + " il vous faut : " + "``" + summ + "`` d'experience", "Experience");
                            }
                        });
                    }
                });
            }
        }
    }
    else if (tabMessageRes.length == 4) {
        if (tabMessage[1] < 1 || tabMessage[1] > 74 || tabMessage[2] < 1 || tabMessage[2] > 74) {
            message.channel.send("Les niveaux doivent etre entre 1 et 74");
        }
        else if (tabMessage[1] > tabMessage[2]) {
            message.channel.send("Le premier argument dois être plus petit que le deuxième");
        }
        else if (tabMessage[3] == 1 && (tabMessage[1] > 69 || tabMessage[2] > 69)) {
            const emoji = client.emojis.find(emoji => emoji.name === "dono");
            message.channel.send("Tu veux vraiment rupture limite un perso 1 étoile " + emoji + " ???");
        }
        else {
            //chercher de lvl arg1 a lvl arg2 pour une rareté arg3
            Exp.findOne({ where: { lvl: tabMessage[1], rarete: (tabMessage[1] <= 69 ? null : tabMessage[3]) } }).then((data1) => {
                if (data1 === null) {
                    console.log("erreur finding data 1 : " + message.content);
                }
                else {
                    Exp.findOne({ where: { lvl: tabMessage[2], rarete: (tabMessage[2] <= 69 ? null : tabMessage[3]) } }).then((data2) => {
                        if (data2 === null) {
                            console.log("erreur finding data 2 : " + message.content);
                        }
                        else {
                            const summexp = data2.expTotal - data1.expTotal;
                            const summcristal = (data2.cristal === null ? 0 : data2.cristal) - (data1.cristal === null ? 0 : data1.cristal);
                            sendEmbed(message, "Pour monter du niveau " + tabMessage[1] + " au niveau " + tabMessage[2] + " il vous faut : " + "``" + summexp + "`` d'experience" + (summcristal == 0 ? "" : " et ``" + summcristal + "`` cristaux de hero pour un hero de rareté " + tabMessage[3]), "Experience");
                        }
                    });
                }
            });
        }
    }
    else {
        //erreur
        console.log("erreur : " + message.content);
        message.channel.send("Oups un problème est survenue lors de votre demande !!! : ");
    }
}

let help = (message, client) => {
    if (message.content == '?help') {
        let text = "Les différentes commandes sont :\n" +
            "?help exp\n" +
            "?help evo\n" +
            "?help shard\n" +
            "?help type\n" +
            "?help party\n" +
            "?help heros";
        sendEmbed(message, text, "Help");
    }
    else if (message.content == '?help exp') {
        let text = "?exp lvl : donne le nombre d'exp nécessaire pour passer du lvl 1 au niveau indiquer(ne pas dépasser le lvl ou il faut limite break)\n" +
            "?exp lvlMin lvlMax : donne le nombre d'exp nécessaire pour passer du lvl lvlMin au niveau lvlMax(ne pas dépasser le lvl ou il faut limite break)\n" +
            "?exp lvlMin lvlMax rareté : donne le nombre d'exp nécessaire pour passer du lvl lvlMin au niveau lvlMax et le noimbre de shard pour la rareté donné si il faut limite break";
        sendEmbed(message, text, "?help lvl");
    }
    else if (message.content == '?help evo') {
        let text = "?evo NbEtoileMin NbEtoileMax rarete : donne les informations sur l'evolution de NbEtoileMin à NbEtoileMax pour une rareté rarete";
        sendEmbed(message, text, "?help evo")
    }
    else if (message.content == '?help shard') {
        let text = "?shard nbShard rarete : donne des informations sur l'obtention de nbShard pour d'une rareté donné"
        sendEmbed(message, text, "?help shard")
    }
    else if (message.content == '?help type') {
        let text = "?type : donne tout les types du jeu"
        sendEmbed(message, text, "?help type");
    }
    else if (message.content == '?help party') {
        let text = "?party : donne tout les party buff du jeu"
        sendEmbed(message, text, "?help party");
    }
    else if (message.content == '?help heros') {
        let text = "?heros : donne une liste de perso selon plusieurs filtre, type, rarte, party buff"
        sendEmbed(message, text, "?help heros");
    }

}

let evo = (message, Shard) => {
    const tabMessage = message.content.split(' ');
    let erreur = false;
    for (let i = 1; i < tabMessage.length && !erreur; i++) {
        if (!Number.isInteger(Number(tabMessage[i]))) {
            erreur = true;
        }
        tabMessage[i] = Number(tabMessage[i]);
    }
    if (erreur || tabMessage.length != 4) {
        message.channel.send('USAGE : ``?evo NbEtoileMin NbEtoileMax rarete`` \n');
    }
    else {
        if (tabMessage[1] < 1 || tabMessage[1] > 5 || tabMessage[2] < 1 || tabMessage[2] > 5) {
            message.channel.send("Le nombre d'étoile doit etre compris entre 1 et 5");
        }
        else if (tabMessage[3] < 1 || tabMessage[3] > 3) {
            message.channel.send("La rareté doit etre compris entre 1 et 3");
        }
        else if (tabMessage[2] < tabMessage[1]) {
            message.channel.send("Le premier argument : " + tabMessage[1] + ", dois être plus petit que le deuxième : " + tabMessage[2]);
        }
        else {
            Shard.findOne({ where: { nbEtoiles: tabMessage[1], rarete: tabMessage[3] } }).then((data1) => {
                if (data1 === null) {
                    console.log("erreur finding data 1 : " + message.content);
                }
                else {
                    Shard.findOne({ where: { nbEtoiles: tabMessage[2], rarete: tabMessage[3] } }).then((data2) => {
                        if (data2 === null) {
                            console.log("erreur finding data 2 : " + message.content);
                        }
                        else {
                            const nbShard = data2.coutTotal - data1.coutTotal;
                            const ShardPerLevel = (tabMessage[3] == 3 ? 1.4 : 4);
                            const nbLevel = nbShard / ShardPerLevel;
                            const nbCafe = nbLevel * 10;
                            const cafePerDay = 260;
                            const nbDay = nbCafe / cafePerDay;

                            sendEmbed(message, "Pour monter un hero " + tabMessage[1] + " étoile(s) à " + tabMessage[2] + " étoile(s) pour une rareté de " + tabMessage[3] + ", il vous faut : " + nbShard + " shards.\nSoit faire " + Math.round(nbLevel) + " niveau, " + Math.round(nbCafe) + " café, environ " + Math.round(nbDay) + " jours avec en moyenne " + Math.round(cafePerDay) + " de café par jours", "Evolution");
                        }
                    });
                }
            });
        }
    }
}

let shard = (message) => {
    const tabMessage = message.content.split(' ');
    let erreur = false;
    for (let i = 1; i < tabMessage.length && !erreur; i++) {
        if (!Number.isInteger(Number(tabMessage[i]))) {
            erreur = true;
        }
        tabMessage[i] = Number(tabMessage[i]);
    }
    if (erreur || tabMessage.length != 3) {
        message.channel.send('USAGE : ``?shard nbShard rarete``');
    }
    else if (tabMessage[2] < 1 || tabMessage[2] > 3) {
        message.channel.send('Connais pas cette rareté');
    }
    else if (tabMessage[1] <= 0) {
        message.channel.send('Veuillez entrer une valeur positive');
    }
    else {
        const nbShard = tabMessage[1]
        const ShardPerLevel = (tabMessage[2] == 3 ? 1.4 : 4);
        const nbLevel = nbShard / ShardPerLevel;
        const nbCafe = nbLevel * 10;
        const cafePerDay = 260;
        const nbDay = nbCafe / cafePerDay;
        sendEmbed(message, "Pour obtenir " + tabMessage[1] + " shards pour un perso de rareté " + tabMessage[2] + " il vous faudra faire " + Math.round(nbLevel) + " niveau soit " + Math.round(nbCafe) + " de café, " + Math.round(nbDay) + " jours en moyenne, avec " + Math.round(cafePerDay) + " de café par jours", "Shard");
    }
}

let type = (message, client) => {
    const embed = new Discord.RichEmbed();
    embed.setTitle("Type");
    embed.setDescription("Les differents types sont : \nWater : " + client.emojis.find(emoji => emoji.name === "Water") +
        "\nFire : " + client.emojis.find(emoji => emoji.name === "Fire") +
        "\nEarth : " + client.emojis.find(emoji => emoji.name === "Earth") +
        "\nLight : " + client.emojis.find(emoji => emoji.name === "Light") +
        "\nDark : " + client.emojis.find(emoji => emoji.name === "Dark") +
        "\nBasic : " + client.emojis.find(emoji => emoji.name === "Basic")
    );
    embed.setColor(0x00AE86);
    embed.setThumbnail("https://cdn.discordapp.com/attachments/804446503636041759/804740255928287243/Capture_d_Acran_2021-01-29_A__16.48.55-removebg-preview.png");
    message.channel.send({ embed });
}

let party = (message, Hero) => {
    Hero.findAll().then((heros) => {
        if (heros === null) {
            console.log("erreur finding heros : " + message.content);
        }
        else {
            var tab = [null];
            const embed = new Discord.RichEmbed();
            embed.setTitle("Party Buff");
            embed.setDescription("Tout les party buff :");
            embed.setColor(0x00AE86);
            embed.setThumbnail("https://cdn.discordapp.com/attachments/804446503636041759/804740255928287243/Capture_d_Acran_2021-01-29_A__16.48.55-removebg-preview.png");
            let text = "";
            heros.forEach(
                (hero) => {
                    if (!tab.includes(hero.partyBuffType1)) {
                        //embed.addField('- ' + hero.partyBuffType1);
                        text = text + hero.partyBuffType1 + "\n";
                        tab.push(hero.partyBuffType1);
                    }
                    if (!tab.includes(hero.partyBuffType2)) {
                        //embed.addField('- ' + hero.partyBuffType2);
                        text = text + hero.partyBuffType2 + "\n";
                        tab.push(hero.partyBuffType2);
                    }
                }
            );
            embed.setDescription(text.substr(0, text.length - 2));
            message.channel.send({ embed });
        }
    })
}


let heros = async (message, client, Hero) => {
    sendEmbed(message, "Les differents filtres sont : \n1 : Type(Earth, Water...)" +
        "\n2 : Party buffs" +
        "\n3 : Rareté" +
        "\nExemple d'utilisation, ``1 3`` pour filtrer sur le type et la rareté",
        "Veuillez choisir vos filtres, vous avez 10 secondes"
    );
    const filter = (m) => m.author.id === message.author.id;
    let msgs = await message.channel.awaitMessages(filter, { time: 10000 });
    if (msgs.size == 0) {
        message.channel.send("Je n'ai rien reçu dans les 10 secondes")
    }
    else {
        //const messageStored = msgs.entries().next();
        const messageStored = msgs.entries().next().value[1].content;
        const tabMessage = messageStored.split(' ');
        let typee = 0;
        let partyBufff = 0;
        let raretee = 0;
        if (messageStored.includes(1)) {
            typee = await askType(message, client);
        }
        if (messageStored.includes(2) && type != -1) {
            partyBufff = await askPartyBuff(message, Hero);
        }
        if (messageStored.includes(3) && type !== -1 && partyBufff !== -1) {
            raretee = await askRarete(message);
        }

        if (typee === -1 || partyBufff === -1 || raretee === -1) {
            message.channel.send("Un problème est survenu");
            console.log("type = " + typee + ", partyBuff = " + partyBuff + ", rarete = " + raretee);
        }
        else {
            Hero.findAll({
                where: {
                    [Op.and]: [(typee != 0 ? { element: typee } : {}),
                    (partyBufff != 0 ? { [Op.or]: [{ partyBuffType1: partyBufff }, { partyBuffType2: partyBufff }] } : {}),
                    (raretee != 0 ? { rarete: raretee } : {})]
                }
            }).then((heros) => {
                if (heros === null) {
                    message.channel.send("Aucun hero ne correspond a votre demande")
                }
                else {
                    const embed = new Discord.RichEmbed();
                    embed.setTitle("Les heros");
                    embed.setColor(0x00AE86);
                    embed.setThumbnail("https://cdn.discordapp.com/attachments/804446503636041759/804740255928287243/Capture_d_Acran_2021-01-29_A__16.48.55-removebg-preview.png");
                    let heroName = "";
                    let heroType = "";
                    let heroRarete = "";
                    let heroPartyBuff = ""
                    heros.forEach(
                        (hero) => {
                            heroName = heroName + hero.nom + "\n";
                            heroType = heroType + hero.element + "\n";
                            heroRarete = heroRarete + hero.rarete + "\n";
                            heroPartyBuff = heroPartyBuff + hero.partyBuffType1 + "\n";
                        }
                    );
                    embed.addField("Hero name", heroName, true)
                    if (typee == 0) {
                        embed.addField("Type", heroType, true)
                    }
                    if (raretee == 0) {
                        embed.addField("Rareté", heroRarete, true)
                    }
                    if (partyBufff == 0) {
                        embed.addField("Party buff", heroPartyBuff, true)
                    }




                    message.channel.send({ embed });
                }
            })
        }
    }
}

let askType = async (message, client) => {
    sendEmbed(message, "Les differents types sont : \n1 : Water : " + client.emojis.find(emoji => emoji.name === "Water") +
        "\n2 : Fire : " + client.emojis.find(emoji => emoji.name === "Fire") +
        "\n3 : Earth : " + client.emojis.find(emoji => emoji.name === "Earth") +
        "\n4 : Light : " + client.emojis.find(emoji => emoji.name === "Light") +
        "\n5 : Dark : " + client.emojis.find(emoji => emoji.name === "Dark") +
        "\n6 : Basic : " + client.emojis.find(emoji => emoji.name === "Basic"),
        "Veuillez choisir le numéro, vous avez 10 secondes")
    const filter = (m) => m.author.id === message.author.id;
    let msgs = await message.channel.awaitMessages(filter, { time: 10000 });
    if (msgs.size == 0) {
        message.channel.send("Je n'ai rien reçu dans les 10 secondes")
        return -1;
    }
    else {
        const messageStored = msgs.entries().next();
        const typeMessage = messageStored.value[1].content;
        const typeList = {
            1: 'Water',
            2: 'Fire',
            3: 'Earth',
            4: 'Light',
            5: 'Dark',
            6: 'Basic'
        }
        if (typeMessage in typeList) {
            return typeList[typeMessage];
        }
        else {
            return -1;
        }
    }
}

let askPartyBuff = async (message, Hero) => {
    const heros = await Hero.findAll();
    if (heros === null) {
        console.log("erreur finding heros : " + message.content);
        return -1;
    }
    var tab = [null];
    const embed = new Discord.RichEmbed();
    embed.setTitle("Veuillez choisir le numéro, vous avez 15 secondes");
    embed.setColor(0x00AE86);
    embed.setThumbnail("https://cdn.discordapp.com/attachments/804446503636041759/804740255928287243/Capture_d_Acran_2021-01-29_A__16.48.55-removebg-preview.png");
    let text = "Les différents party buffs sont : \n";
    let nb = 1;
    heros.forEach(
        (hero) => {
            if (!tab.includes(hero.partyBuffType1)) {
                //embed.addField('- ' + hero.partyBuffType1);
                text = text + nb + " : " + hero.partyBuffType1 + "\n";
                nb++;
                tab.push(hero.partyBuffType1);
            }
            if (!tab.includes(hero.partyBuffType2)) {
                //embed.addField('- ' + hero.partyBuffType2);
                text = text + nb + " : " + hero.partyBuffType2 + "\n";
                nb++;
                tab.push(hero.partyBuffType2);
            }
        }
    );
    embed.setDescription(text.substr(0, text.length - 1));
    message.channel.send({ embed });
    const filter = (m) => m.author.id === message.author.id;
    const msgs = await message.channel.awaitMessages(filter, { time: 15000 })
    if (msgs.size == 0) {
        message.channel.send("Je n'ai rien reçu dans les 15 secondes")
        return -1;
    }
    else {
        messageStored = msgs.entries().next();
        const partyBuff = messageStored.value[1].content;
        if (partyBuff == 0) {
            return -1;
        }
        if (partyBuff in tab) {
            return tab[partyBuff];
        }
        else {
            return -1;
        }
    }


}

let askRarete = async (message) => {
    sendEmbed(message, "Les differents types sont : \n1 : 1 stars hero" +
        "\n2 : 2 stars hero" +
        "\n3 : 3 stars hero",
        "Veuillez choisir le numéro, vous avez 7 secondes")
    const filter = (m) => m.author.id === message.author.id;
    let msgs = await message.channel.awaitMessages(filter, { time: 7000 });
    if (msgs.size == 0) {
        message.channel.send("Je n'ai rien reçu dans les 7 secondes")
        return -1;
    }
    else {
        const messageStored = msgs.entries().next();
        const rareteMessage = messageStored.value[1].content;
        const typeList = {
            1: '1',
            2: '2',
            3: '3'
        }
        if (rareteMessage in typeList) {
            return typeList[rareteMessage];
        }
        else {
            return -1;
        }
    }
}

function sendEmbed(message, text, titre) {
    const embed = new Discord.RichEmbed();
    embed.setTitle(titre);
    embed.setDescription(text);
    embed.setColor(0x00AE86);
    embed.setThumbnail("https://cdn.discordapp.com/attachments/804446503636041759/804740255928287243/Capture_d_Acran_2021-01-29_A__16.48.55-removebg-preview.png");
    message.channel.send({ embed });
}

module.exports = {
    exp,
    help,
    evo,
    shard,
    type,
    party,
    heros
}