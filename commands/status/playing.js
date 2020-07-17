const fs = require('fs');

function playing (info) {
  if (info.args[0]) {
    const msg = String(args).replace(/,/g, ' ');
    const payload = {
      'token': info.token,
      'properties': {
        '$os': 'linux',
        '$browser': 'disco',
        '$device': 'disco'
      },
      'compress': false,
      'presence': {
        'game': {
          'name': msg,
          'type': 0
        }
      }
    };
    fs.writeFile('./logs.json', JSON.stringify(payload), (err) => {
      if (err) throw err;
      info.websocket.send(JSON.stringify(payload));
    });
  }
}

module.exports = {
  run: playing,
  description: 'Gives you the status of playing',
  usages: 'playing <message>',
  examples: ['playing chicken', 'playing Valorant']
};
