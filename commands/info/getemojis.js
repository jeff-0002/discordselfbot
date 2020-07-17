const Axios = require('axios');
const Fs = require('fs');
const Path = require('path');

async function downloadEmojis (name, serverId, id, animated) {
  const url = animated ? `https://cdn.discordapp.com/emojis/${id}.gif` : `https://cdn.discordapp.com/emojis/${id}.png`;
  const path = animated ? `./emojis/${serverId}/${name}.gif` : `./emojis/${serverId}/${name}.png`;
  console.log(`Downloaded emoji: ${name}`);
  if (!Fs.existsSync(`./emojis/`)) {
    Fs.mkdirSync(`./emojis/`);
  }
  if (!Fs.existsSync(`./emojis/${serverId}`)) {
    Fs.mkdirSync(`./emojis/${serverId}`);
  }

  const writer = Fs.createWriteStream(path);

  const response = await Axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

function getEmojis (info) {
  let id = info.args[0] ? args[0] : info.info.guild_id;
  Axios.get('https://discord.com/api/v6/guilds/' + id + '/emojis', info.config)
    .then(res => {
      if (res.data[0] == undefined) {
        console.log("This server doesn't have any emojis.");
        Axios.post('https://discordapp.com/api/v6/channels/' + info.info.channel_id + '/messages', {content: `This server doesn't have and emojis.`}, info.config)
          .then(res => {
            // console.log('');
          }, err => {
            console.log(err);
          });
      }
      let count = 0;
      res.data.forEach(i => {
        downloadEmojis(i.name, info.info.guild_id, i.id, i.animated);
        count++;
      });
      if (count != 0) {
        console.log(`Successfully downloaded ${count} emojis.`);
        Axios.post('https://discordapp.com/api/v6/channels/' + info.info.channel_id + '/messages', {content: `Successfully downloaded ${count} emojis.`}, info.config)
          .then(res => {
            // console.log('');
          }, err => {
            console.log(err);
          });
      }
    }, err => {
      if (err.response.status == 400) {
        Axios.post(`https://discordapp.com/api/v6/channels/${info.info.channel_id}/messages`, {content: 'Invalid Server ID'}, info.config);
        console.log('Invalid Server ID');
      } else {
        console.log(err);
      }
    });
}

module.exports = {
  run: getEmojis,
  description: 'Saves all the emojis in server to a file',
  usages: 'getemojis [serverid]',
  examples: ['getemojis', 'getemojis 727907217751277688']
};
