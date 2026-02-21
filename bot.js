// 🌟 PW AN-401NA FINAL ULTRA PRO MAX BOT
// Made By Shaikh Rehan

const OWNER = "918087994607@c.us";

const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const BOT_NAME = "PW AN-401NA";
const FOOTER = "Made By Shaikh Rehan";

let groupRules = "Study seriously and respect everyone 📚";
let notes = [];
let savedMessages = [];
let activePoll = null;
let commandCount = 0;

const startTime = Date.now();

const client = new Client({
 authStrategy: new LocalAuth(),
 puppeteer:{
  headless:true,
  args:["--no-sandbox","--disable-setuid-sandbox"]
 }
});


// QR
client.on("qr", async (qr) => {

    const QRCode = require("qrcode");
    const fs = require("fs");

    const path = "./public";

    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }

    await QRCode.toFile("./public/qr.png", qr);

    console.log("QR saved at public/qr.png");

});
// READY
client.on("ready", ()=>{
 console.log("🌟 PW AN-401NA FINAL BOT ONLINE");
});


// UI FUNCTION
function ui(title,text){
return `✨ ${title}

${text}

⚡ ${BOT_NAME}
👨‍💻 ${FOOTER}`;
}


// 🌟 AUTO WELCOME SYSTEM WITH NAME
client.on("group_join", async notification => {

try{

const chat = await notification.getChat();
const userId = notification.recipientIds[0];

const contact = await client.getContactById(userId);

const name =
contact.pushname ||
contact.name ||
contact.number ||
"Student";

chat.sendMessage(

`🌟 Welcome ${name} 👋

📚 Welcome to our study group  
🧠 Use /commands to access all study tools  
⚡ Stay active and achieve success  

We wish you great learning and success 🚀

⚡ ${BOT_NAME}
👨‍💻 ${FOOTER}`,

{ mentions: [userId] }

);

}catch(e){
console.log("Welcome error:",e);
}

});


// MESSAGE HANDLER
client.on("message_create", async message=>{

const chat = await message.getChat();
const body = message.body.trim();


// AUTO HELLO
if(body.toLowerCase()==="hi"||body.toLowerCase()==="hello"){
 chat.sendMessage(ui("Hello 👋","Type /commands to open control panel"));
}


// CHECK PREFIX
if(!body.startsWith("/")) return;

commandCount++;

try{await message.react("⚡");}catch{}


const args = body.slice(1).split(" ");
const command = args.shift().toLowerCase();
const text = args.join(" ");


// COMMAND PANEL
if(command==="commands"){

chat.sendMessage(ui("Command Center",

`🎓 Study
/ask question
/exam text
/test text
/class text
/timer minutes
/countdown YYYY-MM-DD

🧾 Notes
/note add text
/note view

📌 Save
/save message
/saved

📊 Poll
/poll Question | Yes | No
/vote number
/results

📢 Group
/tagall
/announce text
/embed title | text

🎯 Useful
/roll
/flip
/quote

⏰ Utility
/remindme seconds text
/groupinfo
/botinfo
/clean

⚙ System
/rules
/setrules text
/stats`

));

}


// ASK
if(command==="ask"){
chat.sendMessage(ui("Study Assistant",
"Please check your textbook, notes, or teacher explanation for best understanding."));
}


// EXAM
if(command==="exam"){
chat.sendMessage(ui("Exam Notice",text));
}


// TEST
if(command==="test"){
chat.sendMessage(ui("Test Notice",text));
}


// CLASS
if(command==="class"){
chat.sendMessage(ui("Class Update",text));
}


// TIMER
if(command==="timer"){

let minutes=parseInt(text)||25;

chat.sendMessage(ui("Study Timer",
`${minutes} minute study session started`));

setTimeout(()=>{

chat.sendMessage(ui("Timer Finished",
"Study session complete. Good job."));

},minutes*60000);

}


// COUNTDOWN
if(command==="countdown"){

const target=new Date(text);
const now=new Date();

const days=Math.ceil((target-now)/(1000*60*60*24));

chat.sendMessage(ui("Countdown",
`${days} days remaining`));

}


// NOTES
if(command==="note"){

if(args[0]==="add"){

notes.push(text.replace("add ",""));

chat.sendMessage(ui("Notes Saved",
"Your note stored successfully"));

}

if(args[0]==="view"){

chat.sendMessage(ui("Your Notes",
notes.length?notes.join("\n"):"No notes saved"));

}

}


// SAVE
if(command==="save"){

savedMessages.push(text);

chat.sendMessage(ui("Saved",
"Message stored successfully"));

}


if(command==="saved"){

chat.sendMessage(ui("Saved Messages",
savedMessages.length?savedMessages.join("\n"):"None"));

}


// RULES
if(command==="rules"){

chat.sendMessage(ui("Group Rules",groupRules));

}


if(command==="setrules"){

groupRules=text;

chat.sendMessage(ui("Rules Updated",
"New rules applied"));

}


// TAGALL
if(command==="tagall"){

if(!chat.isGroup) return;

const group=await client.getChatById(chat.id._serialized);

let mentions=[];
let msg="";

group.participants.forEach(p=>{
mentions.push(p.id._serialized);
msg+=`@${p.id.user}\n`;
});

chat.sendMessage(ui("Attention Everyone",msg),{mentions});

}


// EMBED
if(command==="embed"){

const parts=text.split("|");

chat.sendMessage(ui(
parts[0]||"Message",
parts[1]||""
));

}


// ANNOUNCE
if(command==="announce"){

chat.sendMessage(ui("Announcement",text));

}


// POLL
if(command==="poll"){

const parts=text.split("|");

if(parts.length<3){
chat.sendMessage(ui("Error",
"Use /poll Question | Yes | No"));
return;
}

activePoll={
question:parts[0],
options:parts.slice(1),
votes:{}
};

let txt=activePoll.question+"\n";

activePoll.options.forEach((o,i)=>{
txt+=`${i+1}. ${o}\n`;
});

chat.sendMessage(ui("Poll Created",txt));

}


// VOTE
if(command==="vote"){

if(!activePoll) return;

activePoll.votes[
message.author||message.from
]=parseInt(text);

chat.sendMessage(ui("Vote Recorded",
"Your vote saved"));

}


// RESULTS
if(command==="results"){

if(!activePoll) return;

let count={};

activePoll.options.forEach((o,i)=>count[i+1]=0);

Object.values(activePoll.votes)
.forEach(v=>count[v]++);

let txt=activePoll.question+"\n";

activePoll.options.forEach((o,i)=>{
txt+=`${o}: ${count[i+1]}\n`;
});

chat.sendMessage(ui("Poll Results",txt));

}


// ROLL
if(command==="roll"){

const num=Math.floor(Math.random()*6)+1;

chat.sendMessage(ui("Dice Roll",
`You rolled ${num}`));

}


// FLIP
if(command==="flip"){

const result=Math.random()<0.5?
"Heads":"Tails";

chat.sendMessage(ui("Coin Flip",result));

}


// QUOTE
if(command==="quote"){

const quotes=[
"Stay focused and never give up",
"Hard work creates success",
"Study now, shine later",
"Consistency wins",
"Believe in yourself"
];

const random=
quotes[Math.floor(Math.random()*quotes.length)];

chat.sendMessage(ui("Motivation",random));

}


// REMINDME
if(command==="remindme"){

const parts=text.split(" ");

const sec=parseInt(parts[0]);

const msg=parts.slice(1).join(" ");

chat.sendMessage(ui("Reminder Set",
`Reminder in ${sec} seconds`));

setTimeout(()=>{
message.reply(ui("Reminder",msg));
},sec*1000);

}


// GROUPINFO
if(command==="groupinfo"){

if(!chat.isGroup) return;

const group=
await client.getChatById(chat.id._serialized);

chat.sendMessage(ui("Group Info",

`Name: ${group.name}
Members: ${group.participants.length}`));

}


// BOTINFO
if(command==="botinfo"){

const uptime=
Math.floor((Date.now()-startTime)/1000);

chat.sendMessage(ui("Bot Info",

`Uptime: ${uptime} seconds
Commands used: ${commandCount}`));

}


// CLEAN
if(command==="clean"){
chat.sendMessage("‎");
}


// STATS
if(command==="stats"){

chat.sendMessage(ui("Statistics",

`Commands used: ${commandCount}
Notes: ${notes.length}
Saved: ${savedMessages.length}`));

}

});


// START

client.initialize();


