const Axios = require('axios');

function eightBall (info) {
  if (info.args[0]) {
    Axios.get(`https://8ball.delegator.com/magic/JSON/${String(info.args).replace(/,/g, ' ')}`, info.config)
      .then(res => {
        const embedInfo = {
          title: '__The 8ball Has Chosen__',
          description: `**Question**: ${String(info.args).replace(/,/g, ' ')}\n **Answer**: ${res.data.magic.answer}`,
          thumbnail: {url: 'https://magic-8ball.com/assets/images/magicBallStart.png'}
        };
        if (res.data.magic.type === 'Affirmative') {
          embedInfo.color = 5827380;
        } else if (res.data.magic.type === 'Contrary') {
          embedInfo.color = 13895174;
        } else if (res.data.magic.type === 'Neutral') {
          embedInfo.color = 15461355;
        }
        Axios.post(`https://discordapp.com/api/v6/channels/${info.info.channel_id}/messages`, {embed: embedInfo}, info.config)
          .catch(err => console.log(err));
      }, err => console.log(err));
  } else {
    Axios.post(`https://discordapp.com/api/v6/channels/${info.info.channel_id}/messages`, {content: 'Please provide a message'}, info.config)
      .catch(err => console.log(err));
  }
}

module.exports = {
  run: eightBall,
  description: 'Asks the 8 ball a question',
  usages: '8ball <question>',
  examples: ['8ball am i gay?', '8ball will i ever win the lottery?']
};
