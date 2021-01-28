
//fonction qui répond le nombre d'expérence et de cristal de héro pour up un perso d'un niveau a un autre
function exp(message)
{
    const tabMessage = message.content.split(' ');
    if(tabMessage.lenght() == 1 || tabMessage.lenght() > 4 )
    {
        message.channel.send('USAGE : ?exp niveauMin niveauMax rareté \n');
    }
    else if(tabMessage.lenght() == 2)
    {
        if(tabMessage[2] <= 1 || tabMessage[2] > 69)
        {
            message.channel.send("Le niveau doit etre entre 1 et 69");
        }
        else
        {
            //chercher de lvl 1 a val envoyer

        }
    }
    else if(tabMessage.lenght() == 3)
    {
        if(tabMessage[2] <= 1 || tabMessage[2] > 69 || tabMessage[3] <= 1 || tabMessage[3] > 69)
        {
            message.channel.send("Les niveaux doivent etre entre 1 et 69");
        }
        else
        {
            //chercher de lvl arg2 a lvl arg3

        }
    }
    else if(tabMessage.lenght() == 4)
    {
        if(tabMessage[2] <= 1 || tabMessage[2] > 74 || tabMessage[3] <= 1 || tabMessage[3] > 74)
        {
            message.channel.send("Les niveaux doivent etre entre 1 et 74");
        }
        else
        {
            //chercher de lvl arg2 a lvl arg3 pour une rareté arg4

        }
    }
    else
    {
        //erreur
        console.log("erreur : " + message.content);
        message.channel.send("Oups un problème est survenue lors de votre demande !!!");
    }
}

function hero(content)
{

}

function help()
{

}