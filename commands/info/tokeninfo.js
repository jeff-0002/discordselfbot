const Axios = require('axios');

function tokenInfo (info) {
  if (!info.args[0]) {
    Axios.post(`https://discordapp.com/api/v6/channels/${info.info.channel_id}/messages`, {content: 'A token is required!'}, info.config)
      .then(res => console.log('A token is required!'));
  } else {
    Axios.get('https://discordapp.com/api/v6/users/@me', {headers: {Authorization: info.args[0]}})
      .then(res => {
        embedinfo = {
          title: 'Token Info',
          type: 'rich',
          description: `**User** - ${res.data.username}#${res.data.discriminator}
                        **ID** - ${res.data.id}
                        **Email** - ${res.data.email}
                        **Email Verified** - ${res.data.verified}
                        **2-Factor Auth** - ${res.data.mfa_enabled}`,
          color: 3578955,
          thumbnail: {url: `https://cdn.discordapp.com/avatars/${res.data.id}/${res.data.avatar}`}
        };
        Axios.post(`https://discordapp.com/api/v6/channels/${info.info.channel_id}/messages`, {embed: embedinfo}, info.config)
          .then(res => null, err => console.log(err));
      }, err => {
        if (err.response.status == 401) {
          Axios.post(`https://discordapp.com/api/v6/channels/${info.info.channel_id}/messages`, {content: 'Invalid Token!'}, info.config)
            .then(res => console.log('Invalid Token!'));
        } else {
          console.log(err);
        }
      });
  }
}

module.exports = {
  run: tokenInfo,
  description: 'Sends an embed with info for given token',
  usages: 'tokeninfo <token>',
  examples: ['tokeninfo Njc30TYx0TE4NDU0OTU2MDQz.Xkqt0g.iuMRoRfhYphj5vbgMDr3m6agj9E']
};
