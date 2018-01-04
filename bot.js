const auth = require('./auth.json');
const resources = require('./resources.js');
const fs = require('fs');
var logNumber = parseInt(fs.readFileSync('botinfo.txt', 'utf8'));

const Discord = require('discord.js');
const bot = new Discord.Client();

bot.login(auth.token);

bot.on('ready', () => {
  // Increments the log number
  fs.writeFileSync('botinfo.txt', logNumber+1);
  console.log("JayBot is up and running! :)");
  bot.user.setGame(resources.splashes[Math.floor(Math.random()*resources.splashes.length)]);
  //bot.channels.get("375846593204846602", "bot-and-vagene").send('<@375534890516480002>' + " has arrived!");
  currentChannel = bot.channels.get("375846593204846602", "bot-and-vagene");
});

var duringChallenge = false;
var challengeType = "";
var challenger1ID = "";
var challenger2ID = "";
var challenger1 = undefined;
var challenger2 = undefined;
var challenger1Choice = "";
var challenger2Choice = "";
var challengeChannel = undefined;
var duelTypes = ['dieRoll','rps','rpsls']
var rpsls = ['rock','paper','scissors','lizard','spock'];
var currentChannel;
var inDM = false;
var memberlist;

bot.on('message', message => {
  console.log("User: " + message.author.username + " | ID: " + message.author.id + " | Message: " + message.content);
  logMessage(message);
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.channel.type == "dm") {
      if (duringChallenge == true && (message.author === challenger1 || message.author === challenger2)) {
        if (challengeType == "rps") {
          //console.log(challenger1Choice + "," + challenger2Choice);
          if (!(rpsls.slice(0,3).includes(message.content))) {
            message.author.send("That is not a valid option in this instance, please check your spelling and try again! (I am case-sensitive)");
          }
          else if (message.author === challenger1 && challenger1Choice == "") {
            challenger1Choice = message.content;
          }
          else if (message.author === challenger2 && challenger2Choice == "") {
            challenger2Choice = message.content;
          }
          if (challenger1Choice != "" && challenger2Choice != "") {
            rockPaperScissors(challenger1, challenger1Choice, challenger2, challenger2Choice);
          }
        }
        else if (challengeType == "rpsls") {
          //console.log(challenger1Choice + "," + challenger2Choice);
          if (!(rpsls.includes(message.content))) {
            message.author.send("That is not a valid option in this instance, please check your spelling and try again! (I am case-sensitive)");
          }
          else if (message.author === challenger1 && challenger1Choice == "") {
            challenger1Choice = message.content;
          }
          else if (message.author === challenger2 && challenger2Choice == "") {
            challenger2Choice = message.content;
          }
          if (challenger1Choice != "" && challenger2Choice != "") {
            rockPaperScissorsLizardSpock(challenger1, challenger1Choice, challenger2, challenger2Choice);
          }
        }
      }
    }
    else if (message.content.substring(0, 1) == '!') {
  		if (message.author != bot.user && message.author.bot == true) {
  			message.channel.send('Stop DMing me');
  		}
  		else {
    		var content = message.content;
        var messageArr = createCommandArray(message);
        var cmd = messageArr[0].substring(1);
    		switch(cmd) {
          // !ping
                case 'ping':
                    message.channel.send('Pong!');
                break;
    			// !help
                case 'help':
                    message.channel.send('!ping - Pings the bot for a response\n!idme - The bot returns your Discord ID\n!atme - The bot will @ you\n!announce - The bot announces something for you! <#channel> <"message"> <announce/me>');
                break;
    			// !idme
                case 'idme':
                    message.channel.send('Your Discord ID is: ' + message.author.id);
                break;
    			// !atme
                case 'atme':
    				        message.channel.send(`<@!${message.author.id}>`);
                break;
    			// !channelid
                case 'channelid':
                    message.channel.send(message.channel.id);
                break;
          // !randint
                case 'randint':
                    var high = parseInt(messageArr[2]);
                    var low = parseInt(messageArr[1]);
                    console.log(low + ", " + high);
                    var x = Math.floor((Math.random() * high) + low);
                    console.log(x);
                    message.channel.send(x);
                break;
    			// !announce
    			      case 'announce':
    				        if (messageArr.length == 4) {
    					         var chan = messageArr[1].substring(2, messageArr[1].length - 1);
                       if (messageArr[3] == "me") {
    					            message.client.channels.get(chan).send(messageArr[2].substring(1,messageArr[2].length-1));
                       }
                       else {
                         var tts = true;
                          message.client.channels.get(chan).send("[ANNOUNCEMENT] - " + messageArr[2].substring(1,messageArr[2].length-1), {tts:true});
                       }
    				        }
    				        else {paramsFail(message);}
                break;
          // !challenge
                case 'challenge':
                    if (!(messageArr.length >= 2)) {
                      paramsFail(message);
                      console.log();
                    }
                    else if (messageArr[1].substring(0, 3) != "<@!") {
                      if (duringChallenge == true && message.author === challenger2) {
                        if (messageArr[1] == "accept") {
                          message.channel.send(message.author + " has accepted " + challenger1 + "\'s challenge! Let the games begin!");
                          randDuel(message, challenger1, challenger2);
                        }
                        else if (messageArr[1] == "decline") {
                          message.channel.send(message.author + " was too scared to accept " + challenger1 + "\'s challenge. :(");
                          duringChallenge = false;
                        }
                      }
                    }
                    else if (duringChallenge == false && message.channel.members.has(messageArr[1].substring(3,messageArr[1].length-1))) {
                      challenger1 = message.author;
                      challenger2 = message.client.users.get(messageArr[1].substring(3,messageArr[1].length-1));
                      console.log(messageArr[1]);
                      console.log(message.client.users.get(messageArr[1].substring(3,messageArr[1].length-1)));
                      challengeChannel = message.channel;
                      challenger1Choice = "";
                      challenger2Choice = "";
                      duringChallenge = true;
                      message.channel.send(message.author + " has challenged " + challenger2 + " to a duel! Type !challenge accept");
                    }
                    else {
                      paramsFail(message);
                    }
                break;
          // !game
                case 'game':
                    if (messageArr.length >= 2) {
                      if (resources.gameMap.has(messageArr[1])) {
                        message.channel.send("@" + messageArr[1] + " (<@!" + resources.gameMap.get(messageArr[1]).join("> <@!") + ">)");
                      }
                      else if (messageArr[1] == 'list') {
                        message.channel.send(resources.gameMapList().join(", "));
                      }
                      else {paramsFail(message);}
                    }
                break;
          // !music
                case 'music':
                    message.channel.send("https://www.youtube.com/watch?v=Q_xBKFbokYE");
                break;
          // !poll
                case 'poll':
                  if (messageArr.length >= 2 && messageArr[1])
                break;
          // !talktome
                case 'talktome':
                  message.author.send("hi lol");
                break;
          // !test
                case 'test':
                    bot.user.setGame("with herself");
                break;
                // Just add any case commands if you want to..
                default:
                    message.channel.send("I'm sorry but I don't recognize that command. :(");
    		 }
  		}
    }
  else if (message.content.includes(`<@!375534890516480002>`) && message.author.id == "170219703363567616") {
    // Replys if Colton @s the bot
    message.channel.send('aww i want to kiss you');
  }
  else if (message.content.includes("<:snowball:368518005493202945>")) {
    message.channel.send(new Discord.Attachment("https://cdn.discordapp.com/attachments/351199301432508416/368517144885067776/image.jpg"));
  }
	else {
		var cmd = message.content;
		switch(cmd) {
            // !ping
            case 'Wrong':
                message.channel.send('^');
            break;
            // Jay meme
            case 'oh heyyyyyyyyyyyyyyyyyyy':
                message.channel.send('hi lol');
            break;
            // Just add any case commands if you want to..
		}
    }
});

function createCommandArray(message) {
  var c = message.content;
  var sw = false;
  // Marks phrases that have quotes with stars
  for (i = 0; i <= message.content.length; i++) {
    if (c.substring(i,i+1) == "\"") {
      if (sw == false) {
        c = c.substring(0,i+1) + "*" + c.substring(i+1);
      }
      else {
        c = c.substring(0,i) + "*" + c.substring(i);
        i++;
      }
      sw = !sw;
    }
  }
	var args = c.split("\"");
  var arr = [];
  for (i = 0; i < args.length; i++) {
    // Clips any white space and deletes extra items
    if (args[i] == "") {
      for (o = i+1; o < args.length; o--) {
        array[o-1] = array[o];
      }
      args.pop();
      break;
    }
    else if (args[i].substring(0,1) == " " || args[i].substring(args[i].length-1) == " ") {
      args[i] = args[i].trim();
    }
    //console.log(args[i]);
    if (args[i].includes(" ") && !args[i].includes("*")){
      var spl = args[i].split(" ");
      spl.forEach( str => {
        arr.push(str);
      });
    }
    else {
      arr.push(args[i]);
    }
  }
	return arr;
}

function paramsFail(message) {
	message.reply('your message did not fill all the parameters. :(');
}

function randDuel(message, user1, user2) {
  //var num = Math.floor((Math.random() * duelTypes.length) + 1)-1;
  var num = 1;
  challengeType = duelTypes[num];
  switch (num) {
    //
    case 0:
      message.channel.send("**Duel Type:** " + ":game_die: *Die Roll* :game_die:");
      dieRoll(message, user1, user2);
    break;
    //
    case 1:
      message.channel.send("**Duel Type:** " + "*Rock :mountain:, Paper :newspaper:, Scissors :scissors:*");
      user1.send("Type rock, paper, or scissors to choose one.");
      user2.send("Type rock, paper, or scissors to choose one.");
      //calls rockPaperScissors in bot.on(message)
    break;
    //
    case 2:
      message.channel.send("**Duel Type:** " + "*Rock :mountain:, Paper :newspaper:, Scissors :scissors:, Lizard :lizard:, Spock :vulcan:*");
      user1.send("Type rock, paper, scissors, lizard, or spock to choose one.");
      user2.send("Type rock, paper, scissors, lizard, or spock to choose one.");
      //calls rockPaperScissorsLizardSpock in bot.on(message)
    break;
  }
}

function dieRoll(message, user1, user2) {
  var roll1 = Math.floor((Math.random() * 6) + 1);
  var roll2 = Math.floor((Math.random() * 6) + 1);
  while (roll1 == roll2) {
    roll2 = Math.floor((Math.random() * 6) + 1);
  }
  message.channel.send(user1 + " rolled " + roll1 + "      |      " + user2 + " rolled " + roll2);
  if (roll1 > roll2) {
    message.channel.send(":tada: "+ user1 + " is the winner!" + " :tada:");
  }
  else {
    message.channel.send(":tada: "+ user2 + " is the winner!" + " :tada:");
  }
}

function rockPaperScissors(user1, user1Choice, user2, user2Choice) {
  challengeChannel.send(user1.username + " chose " + user1Choice + "      |      " + user2.username + " chose " + user2Choice);
  if (user1Choice == user2Choice) {
    challengeChannel.send("**TIE!** Check your DMs for a tiebreaker!");
    challenger1Choice = "";
    challenger2Choice = "";
    user1.send("Type rock, paper, or scissors to choose one.");
    user2.send("Type rock, paper, or scissors to choose one.");
  }
  else if ((user1Choice == "rock" && user2Choice == "scissors") ||
           (user1Choice == "paper" && user2Choice == "rock") ||
           (user1Choice == "scissors" && user2Choice == "paper")) {
    challengeChannel.send(":tada: " + user1 + " **is the winner!** :tada:");
    duringChallenge = false;
  }
  else {
    challengeChannel.send(":tada: " + user2 + " **is the winner!** :tada:");
    duringChallenge = false;
  }
}

function rockPaperScissorsLizardSpock(user1, user1Choice, user2, user2Choice) {
  challengeChannel.send(user1.username + " chose " + user1Choice + "      |      " + user2.username + " chose " + user2Choice);
  if (user1Choice == user2Choice) {
    challengeChannel.send("**TIE!** Check your DMs for a tiebreaker!");
    challenger1Choice = "";
    challenger2Choice = "";
    user1.send("Type rock, paper, scissors, lizard, or spock to choose one.");
    user2.send("Type rock, paper, scissors, lizard, or spock to choose one.");
  }
  else if ((user1Choice == "rock" && (user2Choice == "scissors" || user2Choice == "lizard")) ||
           (user1Choice == "paper" && (user2Choice == "rock" || user2Choice == "spock")) ||
           (user1Choice == "scissors" && (user2Choice == "paper" || user2Choice == "lizard")) ||
           (user1Choice == "lizard" && (user2Choice == "spock" || user2Choice == "paper")) ||
           (user1Choice == "spock" && (user2Choice == "rock" || user2Choice == "scissors"))) {
    challengeChannel.send(":tada: " + user1 + " **is the winner!** :tada:");
    duringChallenge = false;
  }
  else {
    challengeChannel.send(":tada: " + user2 + " **is the winner!** :tada:");
    duringChallenge = false;
  }
}

function emojiNoon(message, user1, user2) {

}

function logMessage(message) {
  fs.appendFile('logs/log' + logNumber + '.txt', getCurrentDate() +
                " | Channel/ID: " + message.channel.name + "/" + message.channel.id +
                " | User/ID: " + message.author.username + "/" + message.author.id +
                " | Message/ID: " + message.content + "/" + message.id +
                "\r\n", function (err) {
                  if (err) console.log(err)
  });
}

function getCurrentDate() {
  var d = new Date();
  return formatDate(d);
}

function formatDate(d) {
  return pad(d.getMonth()) + "/" + pad(d.getDay()) + "/" + d.getFullYear() + " | " + pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
}

function pad(value) {
    if(value < 10) {
        return '0' + value;
    } else {
        return value;
    }
}

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  //console.log(`Received: ${input}`);
  var inp = input.split(' ');
  var out = "";
  if (inp[0].charAt(0) == '!' || inp[0].charAt(1) == '!') {
    if (inp[0].substring(0,2) == "\\!") {
      currentChannel.send(input.substring(1));
    }
    switch (inp[0]) {
      case '!list':
        console.log(bot.channels);
      break;
      case '!connect':
        if (bot.channels.exists('name', inp[1])) {
          var chan = bot.channels.find('name', inp[1]);
          if (bot.channels.find('name', inp[1]).permissionsFor(bot.user).has("SEND_MESSAGES")) {
            currentChannel = bot.channels.find('name', inp[1]);
            console.log("Joined " + currentChannel.name);
          }
          else console.log("Failed to join \"" + inp[1] + "\" :( (Permissions to chat in this channel disabled)");
        }
        else console.log("Failed to join \"" + inp[1] + "\" :( (Channel does not exist)");
      break;
      case '!dm':
        memberlist = bot.guilds.find('id', '182693821153411072').members.array();
        var count = 0;
        inDM = true;
        for (member of memberlist) {
          console.log(count + ": " + member.nickname + " : " + member.user.dmChannel);
          count++;
        }
        //console.log(bot.guilds.find('id', '182693821153411072').members);
      break;
      case '!fetch':
        //bot.guilds.find('name', "Bot Testing Grounds").channels.find('name', 'general').fetchMessages({limit: 10})
        currentChannel.fetchMessages()
            .then(messages => dealWithFetch(messages))
            .catch(console.error);
      break;
    }
    out = inp.splice(0, 1).join(' ');
  }
  else if (inDM == true) {
    currentChannel = memberlist[inp[0]].user.dmChannel;
    console.log("Joined " + currentChannel);
    inDM = false;
  }
  else {
    currentChannel.send(input);
  }
});

function dealWithFetch(mess) {
  for (m of mess) {
    var message = m[1];
    var d = new Date(message.createdTimestamp);
    fs.appendFile('fetches/' + currentChannel.name + '.txt', formatDate(d) + "| User: " + message.author.username + " | Message: " + message.content + "\r\n", function (err) {
                  if (err) console.log(err)
    });
  }
}

// Code to
var now = new Date();
var msTill = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 11, 0, 0) - now;
if (msTill < 0) {
     msTill += 86400000; // it's after 11:11pm, try 11:11pm tomorrow.
}
setTimeout(function(){currentChannel.send("It's 11:11, make a wish!");}, msTill);
