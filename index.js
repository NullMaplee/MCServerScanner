const mcping = require('mc-ping-updated');
const PingTCP = require('tcp-ping');
var { Webhook, MessageBuilder } = require('discord-webhook-node');

const hook = new Webhook("PUT WEBHOOK HERE");

var CurrentIP = "1.1.1.1"
var EndIP = "255.255.255.255"
var Threads = 100;
var Timeout = 3000;

async function ScanServer(IP, Port=25565)
{
    await PingTCP.probe(IP, Port, function(err, available) {
    if (available === false)
    {
      // Port 25565 isnt open
    }
    else
    {
      mcping(IP, Port, function(err, res) {
      if (err) {
          // Port 25565 is open but its not a mc server
      } else {
        const embed = new MessageBuilder()
        .setTitle(IP)
        .setColor('#03b2f8')
        .setDescription('Description: ' + res.description.text + '\nPlayers: ' + res.players.online + '\nVersion: ' + res.version.name);
 
        hook.send(embed);
      }
  }, Timeout);
    }
  });
}

function incrementIP(ip) {
    var inputIP = ip.split(".")
    let iptwo = (inputIP[0] << 24) | (inputIP[1] << 16) | (inputIP[2] << 8) | (inputIP[3] << 0);
    iptwo++;
    var iparray = [iptwo >> 24 & 0xff, iptwo >> 16 & 0xff, iptwo >> 8 & 0xff, iptwo >> 0 & 0xff];
    var finalip;
    var yes = 0
    for(let val of iparray)
    {
      if ( yes != 0) { finalip = finalip + "." + val } else
      { finalip = val + "" }
      yes = yes + 1
    }
    return finalip;
}

var threadnum = 0

async function DoScan()
{
  threadnum = threadnum + 1
  console.log("Thread " + threadnum + " Started")
  while(true)
  {
    ScanServer(CurrentIP);
    if (CurrentIP === EndIP) { console.log("Reached End IP"); process.exit() }
    CurrentIP = incrementIP(CurrentIP);
    // wait 1000 milliseconds 
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

for (let index = 0; index < Threads; index++) {
  DoScan();
  if (Threads == threadnum ) { console.log("All Threads Started!")}
}
