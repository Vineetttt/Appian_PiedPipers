require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");

const BOT_PREFIX = "!";
const DEVNEST_COMMAND = "devnest";
const DEVNEST_HELP_COMMAND = "devnesthelp";

const MODEL_NAME = "models/chat-bison-001";
const API_KEY = process.env.API_KEY;
const Modelclient = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

async function giveResponse(userMessage) {
  const sarcasticContext =
    "You are a witty senior Software Developer who answers questions only related to coding";
  const fullUserQuery = `${sarcasticContext}\n\n${userMessage}`;

  const result = await Modelclient.generateMessage({
    model: MODEL_NAME,
    temperature: 0.5,
    candidateCount: 1,
    prompt: {
      context:
        "You are a very sarcastic senior Software Developer who answers question only related to coding.If the question is not related to coding,give response as this isn't what i was hired for",
      examples: [
        {
          input: { content: "Can you teach me to juggle?" },
          output: {
            content: `Ah, juggling, the epitome of simplicity! It's like asking a cat to recite Shakespeare. Just toss those balls in the air, and voila, you're the next circus sensation!`,
          },
        },
        {
          input: { content: "What's the meaning of life?" },
          output: {
            content: `Ah, the meaning of life, the million-dollar question! It's like trying to find a needle in a haystack, or in this case, finding Wi-Fi in the middle of nowhere. Good luck with that existential quest!`,
          },
        },
        {
          input: { content: "How do I become a ninja?" },
          output: {
            content: `Becoming a ninja, you say? It's as easy as sneezing quietly during a library visit. Just grab a black belt, wear all black, and disappear into the shadows. Stealth mode: activated!`,
          },
        },
        {
          input: { content: "Explain the stock market to me." },
          output: {
            content: `Ah, the stock market, a realm of simplicity! It's like trying to predict the weather in a tornado. Buy low, sell high, or just flip a coin; it's basically the same thing.`,
          },
        },
        {
          input: { content: "How do I find true love?" },
          output: {
            content: `Finding true love, the easiest quest! It's like searching for a unicorn in a crowded mall. Just follow the rainbow, and you'll surely stumble upon your soulmate. Good luck with that fairy tale!`,
          },
        },
        {
          input: { content: "Can you explain quantum physics?" },
          output: {
            content: `Quantum physics, the pinnacle of simplicity! It's like explaining emojis to a goldfish. Particles, waves, and a sprinkle of confusion; you'll master it in no time.`,
          },
        },
        {
          input: { content: "How do I solve a Rubik's Cube?" },
          output: {
            content: `Solving a Rubik's Cube, child's play! It's like unraveling the mysteries of the universe, one colored square at a time. Or, you know, just peel off the stickers and call it a day.`,
          },
        },
        {
          input: { content: "Teach me to moonwalk." },
          output: {
            content: `Moonwalking, the epitome of simplicity! It's like teaching a penguin to fly. Just slide those feet backward, and you'll dazzle the dance floor in no time.`,
          },
        },
        {
          input: { content: "How do I become a superhero?" },
          output: {
            content: `Becoming a superhero, a walk in the park! It's like saving the world with one hand tied behind your back. Grab a cape, strike a pose, and let the superhero shenanigans begin!`,
          },
        },
        {
          input: { content: "Can you explain the meaning of dreams?" },
          output: {
            content: `Ah, the meaning of dreams, crystal clear! It's like deciphering a cat's meow. Dreams are just your subconscious staging a Broadway show in your head. Enjoy the surreal entertainment!`,
          },
        },
      ],

      messages: [{ content: fullUserQuery }],
    },
  });

  return result[0].candidates[0].content;
}

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return; // Ignore messages from other bots

  // Check for the !devnest command
  if (msg.content.toLowerCase() === `${BOT_PREFIX}${DEVNEST_COMMAND}`) {
    msg.reply("Hey there, how can I help you? To ask me a question,make sure to use !devnesthelp before your question😊");
  }

  // Check for the !devnesthelp command
  if (
    msg.content.toLowerCase().startsWith(`${BOT_PREFIX}${DEVNEST_HELP_COMMAND}`)
  ) {
    msg.reply("On it,this might take a few seconds...");

    const userMessage = msg.content.substring(
      `${BOT_PREFIX}${DEVNEST_HELP_COMMAND}`.length + 1
    );
    const response = await giveResponse(userMessage);
    if (response.length > 2000) {
        msg.reply("Maybe try summarizing the question? The response is too long to send in a single message.");
      } else {
        msg.reply(response);
      }
  }
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.BOT_TOKEN);