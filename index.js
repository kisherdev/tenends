const Discord = require('discord.js')
const fs = require('fs')
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const discordTranscripts = require('discord-html-transcripts');
const { Intents, Permission, Args, Add, ButtonBuilder, ActionRowBuilder, EmbedBuilder, MessageCollector, ChannelType, Modal, TextInputComponent, ButtonStyle, Client, GatewayIntentBits, MessageAttachment, ActivityType } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});
//Подключение
client.on('ready', async () => {
  client.user.setActivity(`заказы`, {type: ActivityType.Playing});
  console.log(`⚫⚫⚫⚫⚫ ${client.user.tag} started!`);
  setInterval(async () => {
    checkChannels()
  }, 24 * 60 * 60 * 1000)
});

module.exports = client;
const config = require("./config.json");
client.config = config;
client.commands = new Discord.Collection();

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const eventName = file.split(".")[0];
  const event = require(`./events/${file}`);

  console.log(`⚫⚫⚫⚫⚪ load event: ${eventName}`)
  client.on(event.name, (...args) => event.execute(...args, client));
};

const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { clientId, token, guildId } = require('./config.json');

const scall = [
  new SlashCommandBuilder().setName('меню').setDescription('Отправить меню создания заказов | ADMIN'),
  new SlashCommandBuilder().setName('панель').setDescription('Открыть панель администрации'),
  new SlashCommandBuilder().setName('оплата').setDescription('Создание ссылки для оплаты | WORKER').addNumberOption(option => option.setName('ар').setDescription('Введите кол-во АР:').setRequired(true)).addUserOption(option => option.setName('пользователь').setDescription('Укажите заказчика:').setRequired(true)).addStringOption(option => option.setName('товар').setDescription('Укажите название товара:').setRequired(true)),
  new SlashCommandBuilder().setName('перевод').setDescription('Перевод SPWorlds | ADMIN').addNumberOption(option => option.setName('карта').setDescription('Введите номер карты:').setRequired(true)).addNumberOption(option => option.setName('ар').setDescription('Введите кол-во АР:').setRequired(true)).addStringOption(option => option.setName('комментарий').setDescription('Укажите комментарий к переводу:').setRequired(true)),
  new SlashCommandBuilder().setName('промокод').setDescription('Создать промокод | ADMIN').addStringOption(option => option.setName('действие').setDescription('Выберите действие:').addChoices({ name: 'добавить', value: 'add' }, { name: 'удалить', value: 'del' }).setRequired(true)).addStringOption(option => option.setName('промокод').setDescription('Укажите промокод:').setRequired(true)).addStringOption(option => option.setName('использования').setDescription('Укажите кол-во использований (если бесконечно, то пишите бесконечно):').setRequired(true)).addNumberOption(option => option.setName('скидка').setDescription('Укажите процент скидки:').setRequired(true)),
]
  .map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: scall })
  .then(() => console.log('⚫⚫⚫⚫⚫ all slash commands started!'))
  .catch(console.error);

async function checkChannels() {
  const now = Date.now();
  const threshold = now - (7 * 24 * 60 * 60 * 1000);

  const guild = client.guilds.cache.get('1035987433956843521');

  const channels = guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText);

  for (const channel of channels.values()) {
      try {
        if (channel.name.startsWith('заказ-') || channel.name.startsWith('завершено-')) {
          const messages = await channel.messages.fetch({ limit: 1 });

          if (messages.size === 0 || messages.first().createdTimestamp < threshold) {
            const attachment = await discordTranscripts.createTranscript(channel);
            number = 0
            if (channel.name.startsWith('заказ-')) return number = channel.name.slice(6, channel.name.length);
            if (channel.name.startsWith('завершено-')) return number = channel.name.slice(10, channel.name.length);
            let emb = new EmbedBuilder()
            .setTitle('Удаление заказа')
            .addFields(
              { name: `Номер заказа:`, value: `\`${number}\`` }
            )
            .setAuthor({ name: 'Авто-удаление', iconURL: 'https://media.discordapp.net/attachments/1080960335047045183/1239890377746550824/firework.png?ex=66449166&is=66433fe6&hm=65b4c877988afaa6ec41877dcd42dbf26db021e04b0dc5c2d3e69bc748c4718b&=&format=webp&quality=lossless&width=89&height=89' })
            .setThumbnail('https://media.discordapp.net/attachments/1080960335047045183/1239890377746550824/firework.png?ex=66449166&is=66433fe6&hm=65b4c877988afaa6ec41877dcd42dbf26db021e04b0dc5c2d3e69bc748c4718b&=&format=webp&quality=lossless&width=89&height=89')
            .setColor('#C03A3A')
            .setTimestamp()

            await client.channels.cache.get(logs).send({ embeds: [emb], files: [attachment] }).then(async () => {
              await channel.delete('Авто-удаление | 7 дней');
            })
          }
        }
      } catch (error) {
          console.error(`Не удалось удалить канал ${channel.name} на сервере ${guild.name}:`, error);
      }
  }
}

client.login(token)