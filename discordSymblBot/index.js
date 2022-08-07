require("dotenv").config();
const  fetch =  require('node-fetch');
const { Client , GatewayIntentBits,ActionRowBuilder, ButtonBuilder, ButtonStyle, Collector, MessageCollector,EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages , GatewayIntentBits.MessageContent ,GatewayIntentBits.DirectMessages,] });


var auth ;
const appId =process.env.APPID
const appSecret =process.env.APPSECRET

const authOptions = {
method: "post",
headers: {
Accept: "application/json",
"Content-Type": "application/json",
},
body: JSON.stringify({
type: "application",
appId: appId,
appSecret: appSecret,
}),
};

// using fetch to generate auth-tokens
fetch("https://api.symbl.ai/oauth2/token:generate", authOptions)
.then((response) => response.json())
.then((actualData) => auth = actualData.accessToken) // set authtokens  state to use globally
.catch((err) => {
console.log(err.message);
});



function getdata(att,message){
  const symblaiParams = {
    'name': 'randomname',
    'url': att.url
  }

fetch('https://api.symbl.ai/v1/process/audio/url', {
  method: 'post',
  body: JSON.stringify(symblaiParams),
  headers: {
    'Authorization': `Bearer ${auth}`,
    'Content-Type': 'application/json'
  }
}).then(res => res.json()).then(res => {
  // console.log(res);
    x = setInterval(() => {
        fetch(`https://api.symbl.ai/v1/job/${res.jobId}`, {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${auth}`,
        'Content-Type': 'application/json'
      }
      }).then(res => res.json()).then(res1 => {
        if(res1.status === 'completed'){
          fetch(`https://api.symbl.ai/v1/conversations/${res.conversationId}/messages`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${auth}`,
              'Content-Type': 'application/json'
          }
          })
          .then((r) => {
            return r.json();
          }).then((rsr) =>{
            var x = "";
                rsr.messages.map(msg =>{
                  x=x+":man_beard:  : "+msg.text+"\n";
                })



            message.reply({content : (x.length > 0 ? "  Here's your transcribed text!!  \n \n"+x+"\n \n" : "nothing to transcribe"), ephemeral : true,})
          }).catch(err =>{
          message.reply({content :  "Server error please try again", ephemeral : true})
          })
          clearInterval(x);
        }
        })
        .catch(err => {
        message.reply({content :  "Server error please try again", ephemeral : true})
        })
    },1000);

})
.catch(err => {
  message.reply({content :  "Server error please try again", ephemeral : true})
})

}



client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
 });
 
 // Log In our bot
 client.login(process.env.TOKEN);
 
 

client.on("messageCreate", async (message)=>{
  if(message.attachments.size <=0 ) return;
  message.attachments.forEach( async att =>{

    if(att.contentType.startsWith("audio")){
      const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('get_data')
					.setLabel('Get Into Text')
					.setStyle(ButtonStyle.Primary),

          new ButtonBuilder()
					.setCustomId('cancel')
					.setLabel('Cancel')
					.setStyle(ButtonStyle.Danger) 
			);
      
 
       const msg = await message.reply({content: "_", components:[row]});

  // const filter = i => i.user.id === message.author.id;

  const collector = message.channel.createMessageComponentCollector({ time: 10000 });
  
  collector.on('collect', async i => {
    if(i.user.id !== message.author.id){
      i.reply({content : ("sorry its not for you :(, if you want to get transcript, upload an audio!!"), ephemeral : true})
    }else{
      if(i.customId === 'get_data'){
        msg.edit({content : "Your transcribed messages are on the way!! Be patient!", components : []});
        getdata(att,message);
       }else{
        msg.delete();
       }
    }

  });

  collector.on('end', async (i) => {

    if(msg.content === "_"){
      msg.edit({content : "times up! :loudspeaker: , you didn't react on time, resend to get a new transcribtion order", components : []});
    }
   
  });

      }
    
  })
});