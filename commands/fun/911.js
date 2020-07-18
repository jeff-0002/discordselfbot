const Axios = require('axios');

function sleep (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function test () {
  console.log('hi');
}

async function boom (info) {
  await Axios.delete(`https://discordapp.com/api/v6/channels/${info.info.channel_id}/messages/${info.info.id}`, info.config).catch(err => console.log(err));
  await Axios.post(`https://discordapp.com/api/v6/channels/${info.info.channel_id}/messages`, {content: ':airplane:                                       :office:'}, info.config).then(async res => {
    const id = res.data.id;
    msgs = ['\:airplane\:                             \:office\:', '\:airplane\:                     \:office\:', '\:airplane\:              \:office\:', '\:airplane\:       \:office\:', '\:airplane\:\:office\:', '\:boom\:\:boom\:'];
    for (const msg of msgs) {
      await Axios.patch(`https://discordapp.com/api/v6/channels/${info.info.channel_id}/messages/${id}`, {content: msg}, info.config).catch(err => console.log(err));
      await sleep(250);
    }
    await Axios.delete(`https://discordapp.com/api/v6/channels/${info.info.channel_id}/messages/${id}`, info.config).catch(err => console.log(err));
  }).catch(err => console.log(err));
}

module.exports = {
  run: boom,
  description: 'Big boom very cool',
  usages: '911',
  examples: ['911']
};
