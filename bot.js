const discord = require("discord.js");
const { Permissions } = require("discord.js");
const User = require("../server/models/User");

require("../server/MongoConnection");

const client = new discord.Client({
  intents: [
    "GUILD_MESSAGE_REACTIONS",
    "DIRECT_MESSAGES",
    "GUILDS",
    "GUILD_PRESENCES",
    "GUILD_MEMBERS",
    "GUILD_MESSAGES",
  ],
});

const userMap = new Map();

const LoggerPriority = require("./logger/LoggerPriority");
const Logger = require("./logger/Logger");

const blockchain = require("./contract/blockchain");

client.login("OTMwOTQ0MTU4OTYzNzYxMjEz.Yd9PTw.76CZwqVwqSG0Hhph6Vu_jjunElU");

let CurrentHypeMessage = [];
let hypemeter = 0;

const hype = async () => {
  let channel = client.channels.cache.get("930953950998437929");

  let msg = await channel.send(
    "want to have a free __**Crystal Point**__ NFT? If this message gets 200 reactions, one of you will get a free Crystal Point!"
  );

  await msg.react("✔");

  let hypemeter = 0;

  CurrentHypeMessage.pop();
  CurrentHypeMessage.push(msg);

  await blockchain.mintNFT("0x454C2CC415c4C395aea24594416943Ede7b4B420");

  let owned = await blockchain.nftContract.methods.getRegisteredNFTS();

  console.log(owned);
};

client.on("ready", () => {
  Logger.log(`logged in as ${client.user.tag}`, LoggerPriority.HIGH);

  setInterval(async () => {
    userMap.forEach(async (user) => {
      const nft = await blockchain.nftContract.methods
        .isHolder(user.address)
        .call();
      Logger.log(nft, LoggerPriority.HIGH);
    });
  }, 5000);
});

client.on("messageCreate", async (message) => {
  if (message.channel.id === "919319191578873876") {
    const user = await User.findOne({ address: message.content });

    if (user) {
      userMap.set(message.author.id, user);
      message.member.send(
        "successfully connected your account to your Crystal Wallet"
      );
    } else {
      message.member.send(
        "When connecting your Crystal wallet to discord, make sure that you enter the correct address!"
      );
    }

    message.delete();
  }

  if (!message.author.bot) {
    Logger.log(
      message.author.tag + " -> " + message.content,
      LoggerPriority.HIGH
    );
  }
  console.log(message.member);
  if (message.content.toLowerCase().trim() == "/hype") {
    if (message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      message.delete();
      hype();
    }
  }
});

client.on("messageReactionAdd", async (reaction) => {
  if (CurrentHypeMessage[0] != undefined) {
    if (reaction.message.channelId == CurrentHypeMessage[0].channel.id) {
      hypemeter += 1;
    }
  }
});

client.on("messageReactionRemove", async (reaction) => {
  if (CurrentHypeMessage[0] != undefined) {
    if (reaction.message.channelId == CurrentHypeMessage[0].channel.id) {
      hypemeter -= 1;
    }
  }
});

setInterval(async () => {
  hype();
}, 60 * 1000 * 60 * 24); // Every day
