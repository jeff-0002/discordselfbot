const fs = require('fs');

function streaming (info) {
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
          'type': 1,
          'url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
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
  run: streaming,
  description: 'Gives you the status of streaming',
  usages: 'streaming <message>',
  examples: ['streaming sleeping', 'streaming coding']
};
