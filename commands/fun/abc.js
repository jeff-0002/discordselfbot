const Axios = require('axios');

function sleep (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function abc (info) {
  const alphabet = ['b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  await Axios.delete(`https://discordapp.com/api/v6/channels/${info.info.channel_id}/messages/${info.info.id}`, info.config).catch(err => console.log(err));
  await Axios.post(`https://discordapp.com/api/v6/channels/${info.info.channel_id}/messages`, {content: 'a'}, info.config)
    .then(async res => {
      const id = res.data.id;
      for (const letter of alphabet) {
        await sleep(901);
        await Axios.patch(`https://discordapp.com/api/v6/channels/${info.info.channel_id}/messages/${id}`, {content: letter}, info.config).catch(err => console.log(`${err.response.data.message}: ${err.response.data.retry_after} ms left.`));
      }
    });
}

module.exports = {
  run: abc,
  description: 'Sends the entire alphabet by editing one message',
  usages: 'abc',
  examples: ['abc']
};
