const Discord = require('discord.js');
const fs = require('fs')
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { Intents, Permission, Args, Add, ButtonBuilder, ActionRowBuilder, EmbedBuilder, ChannelType, PermissionsBitField, ModalBuilder, TextInputBuilder, ButtonStyle, Client, GatewayIntentBits, TextInputStyle, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    const logs = '1088200691346063420'
    if (message.channel.id === '1234425103861940254') {
        arr = message.content.split('\n')
        id = arr[0]
        tovar = arr[1]
        ar = arr[4]
        chan = arr[2]
        msg = arr[3]

        let member = await message.guild.members.fetch(id).catch(err => {});
        let channel = client.channels.cache.get(chan)

        let emb1 = new EmbedBuilder()
        .setTitle('<a:check:1239627908369354845> Оплата успешно прошла!')
        .addFields(
          { name: 'Сумма:', value: `\`${ar}\` АР` },
          { name: 'Товар:', value: `\`${tovar}\`` }
        ) 
        .setAuthor({ name: member.user.username, iconURL: member.user.avatarURL({ size: 2048 }) })
        .setThumbnail(member.user.avatarURL({ size: 2048 }))
        .setTimestamp()
        .setColor('#5CAF4F')
        channel.messages.fetch(msg).then(async msg => {
          msg.edit({ embeds: [emb1], components: [] })
        })
        

        let emb = new EmbedBuilder()
        .setTitle('Успешная оплата заказа')
        .addFields(
            { name: 'Заказчик:', value: `<@${member.user.id}> | \`${member.user.username}\`` },
            { name: 'Сумма:', value: `\`${ar}\` АР` },
            { name: 'Товар:', value: `\`${tovar}\`` }
        )
        .setAuthor({ name: member.user.username, iconURL: member.user.avatarURL({ size: 2048 }) })
        .setThumbnail(member.user.avatarURL({ size: 2048 }))
        .setColor('#5CAF4F')
        .setTimestamp()
        await client.channels.cache.get(logs).send(({ embeds: [emb] }));

        await db.delete(`user_${id}`)
    }
  }
}