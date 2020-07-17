const fs = require('fs');

function listening (info) {
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
          'type': 2
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
  run: listening,
  description: 'Gives you the status of listening',
  usages: 'listening <message>',
  examples: ['listening to your moms sextape', 'listening to music']
};
