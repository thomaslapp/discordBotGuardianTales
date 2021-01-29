let { exp, hero, help } = require('./fonction');
const Discord = require('discord.js');
const {token} = require('./config.json');
const client = new Discord.Client();


//Définition des structure de bdd
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './bdd.db'
});

const Exp = sequelize.define('experience', {
  lvl: {
    type: DataTypes.INTEGER,
  },
  expTotal: {
    type: DataTypes.INTEGER
  },
  cristal: {
    type: DataTypes.INTEGER
  },
  rarete: {
    type: DataTypes.INTEGER
  }
});

const Hero  = sequelize.define('hero', {
  nom: {
    type: DataTypes.INTEGER,
  },
  element: {
    type: DataTypes.STRING
  },
  rarete: {
    type: DataTypes.INTEGER
  },
  role: {
    type: DataTypes.STRING
  },
  attaque: {
    type: DataTypes.INTEGER,
  },
  vie: {
    type: DataTypes.INTEGER
  },
  defense: {
    type: DataTypes.INTEGER
  },
  reducDamage: {
    type: DataTypes.INTEGER
  },
  partyBuffType: {
    type: DataTypes.STRING,
  },
  partyBuffNbr: {
    type: DataTypes.INTEGER
  },
  chaineOne: {
    type: DataTypes.STRING
  },
  chaineTwo: {
    type: DataTypes.STRING
  }
});

sequelize.sync({});


client.on('ready', () => {
  console.info(`Logged in as ${client.user.tag}!`);
});

client.on("message", message => {
  //mettre l'id du channel voulu
  if(message.channel.id === "804480084131708929" || message.channel.id === "804446503636041759")
  {
    if(message.content.startsWith('?'))
    {
      const content = message.content;
      if(message.content.startsWith('?exp'))
      {
        exp(message,Exp);
      }
      else if(message.content.startsWith('?hero'))
      {
        //hero(message,Hero);
      }
      else
      {
        help(message);
      }
    }
  }
})
client.login(token);