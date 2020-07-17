const Axios = require('Axios');
const Fs = require('fs');
const Path = require('path');
const Config = require('./config.json');
const prefix = Config.prefix;
const token = Config.token;
const { performance } = require('perf_hooks');

const chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

let msg = {
  'token': token,
  'properties': {
    '$os': 'linux',
    '$browser': 'disco',
    '$device': 'disco'
  },
  'compress': false
};

Fs.writeFile('logs.json', JSON.stringify(msg), (err) => {
  if (err) throw err;
});

let data = {

};

let config = {
  headers: {
    Authorization: token
  }
};

function checkMsg (command, info, args, websocket) {
  if (command == 'help' && args[0] == undefined) {
    data.embed = {
      title: 'Help Menu',
      type: 'rich',
      fields: [],
      color: 3578955,
      footer: {text: `Type '${prefix}help <command>' to show details.`}
    };
    let i = 0;
    Fs.readdirSync('./commands/').forEach(category => {
      data.embed.fields.push({name: '# ' + category[0].toUpperCase() + category.slice(1), value: '', inline: false});
      const commands = Fs.readdirSync(`./commands/${category}/`);
      commands.forEach(file => {
        const exportedFunction = require(`./commands/${category}/${file.replace('.js', '')}`);
        data.embed.fields[i].value += `\n\`${prefix}${file.replace('.js', '')}\` - ${exportedFunction.description}`;
      });
      i++;
    });
    Axios.post(`https://discord.com/api/v6/channels/${info.channel_id}/messages`, data, config)
      .then(res => null, err => console.log(err));
  } else if (command == 'help' && args[0]) {
    Fs.readdirSync('./commands/').forEach(category => {
      const commands = Fs.readdirSync(`./commands/${category}/`);
      commands.forEach(file => {
        if (file.replace('.js', '') == args[0]) {
          const exportedFunction = require(`./commands/${category}/${file.replace('.js', '')}`);
          data.embed = {
            title: `Command: ${file.replace('.js', '')}`,
            type: 'rich',
            fields: [{name: 'Description', value: exportedFunction.description}, {name: 'Usages', value: `${prefix}${exportedFunction.usages}`}, {name: 'Usage examples', value: ''}],
            color: 3578955,
            footer: {text: '<> fields are required. [] fields are optional.'}
          };
          // console.log(data.embed.fields[2]);
          exportedFunction.examples.forEach(example => data.embed.fields[2].value += `${prefix}${example}\n`);
          Axios.post(`https://discord.com/api/v6/channels/${info.channel_id}/messages`, data, config)
            .then(res => null, err => console.log(err));
        }
      });
    });
  } else {
    Fs.readdir('./commands', (err, categories) => {
      categories.forEach(category => {
        Fs.readdir('./commands/' + category, (err, readCategory) => {
          readCategory.forEach(file => {
            if (file.replace('.js', '') == command) {
              const exportedFunction = require(`./commands/${category}/${file.replace('.js', '')}`);
              const information = {
                info,
                args,
                config,
                token,
                websocket
              };
              exportedFunction.run(information);
            }
          });
          if (err) {
            console.log(err);
          }
        });
      });
      if (err) {
        console.log(err);
      }
    });
  }
}

const WebSocket = require('ws');
const url = 'wss://gateway.discord.gg/?v=6&encoding=json';

function connect () {
  ws = new WebSocket(url); // opens the websocket connection and creates WS object
  ws.onmessage = messageHandler; // on message event
  ws.onclose = connect; // reopen websockets when closed by discord
}

let msgs = [];
function messageHandler (message) {
  let json = message.data; // string version of the JSON data
  json = JSON.parse(json);

  if (json.op == 10) { // hello gateway event
    doLogin();
  } else if (json.op == 0) { // dispatch gateway event
    if (json.t == 'MESSAGE_CREATE' && json.d.author.id == '729836287313313972' && json.d.content.charAt(0) == prefix) {
      args = json.d.content.slice(prefix.length).trim().split(' ');
      command = args.shift().toLowerCase();
      checkMsg(command, json.d, args, ws);
    } else if (json.t == 'MESSAGE_CREATE' && json.d.author.id != '729836287313313972') {
      msgs.push(json.d);
    } else if (json.t == 'MESSAGE_DELETE') {
      msgs.forEach(i => {
        if (i.id == json.d.id) {
          console.log(`Message from ${i.author.username}#${i.author.discriminator} was deleted. Content: ${i.content}.`);
        }
      });
    }
  }
}

function doLogin () {
  Fs.readFile('logs.json', (err, data) => {
    if (err) throw err;
    let payload = {'op': 2, 'd': JSON.parse(data)};
    ws.send(JSON.stringify(payload));
  });
}

connect();
