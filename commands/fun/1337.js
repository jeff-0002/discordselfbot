const Axios = require('axios');

function leetSpeak (info) {
  if (info.args[0]) {
    Axios.delete(`https://discordapp.com/api/v6/channels/${info.info.channel_id}/messages/${info.info.id}`, info.config).catch(err => console.log(err));
    const args = String(info.args).replace(/,/g, ' ');
    Axios.post('https://api.funtranslations.com/translate/leetspeak.json', {text: args})
      .then(res => {
        const msg = res.data.contents.translated;
        Axios.post(`https://discordapp.com/api/v6/channels/${info.info.channel_id}/messages`, {content: msg}, info.config).catch(err => console.log(err));
      });
  } else {
    Axios.post(`https://discordapp.com/api/v6/channels/${info.info.channel_id}/messages`, {content: 'Please provide a message to translate'}, info.config).catch(err => console.log(err));
  }
}

module.exports = {
  run: leetSpeak,
  description: 'Replaces the letters in your message to numbers',
  usages: '1337 <message>',
  examples: ['1337 i big hacker man', '1337 hello!']
};
