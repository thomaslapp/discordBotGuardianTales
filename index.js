const Discord = require('discord.js');
import './fonction';
const {token} = require('./config.json');

const client = new Discord.Client();


client.on('ready', () => {
  console.info(`Logged in as ${client.user.tag}!`);
});



client.on("message", message => {
  if(message.channel.id === "804480084131708929")
  {
    if(message.content.startsWith('?'))
    {
      const content = message.content;
      if(message.content.startsWith('?exp'))
      {
        exp(message);
        
      }
      else if(message.content.startsWith('?hero'))
      {
        hero(message);
      }
    }
  }
})

client.login(token);