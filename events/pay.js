const Discord = require('discord.js');
const fs = require('fs')
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const discordTranscripts = require('discord-html-transcripts');
const { Intents, Permission, Args, Add, ButtonBuilder, ActionRowBuilder, EmbedBuilder, ChannelType, PermissionsBitField, ModalBuilder, TextInputBuilder, ButtonStyle, Client, GatewayIntentBits, TextInputStyle, StringSelectMenuBuilder, UserSelectMenuBuilder } = require('discord.js');
const { SPWorlds } = require('spworlds');
const promocode = require('./promocode');
const api = new SPWorlds({ id: '92e93595-8fa8-4178-a69c-4298e05912ab', token: 'S+VNvKLbAHnkavoC05xUHYR0/DBndek+' })

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    const logs = '1088200691346063420'
    if (interaction.commandName === 'оплата') {
        if (!interaction.member.roles.cache.some(r=>["Глава", "Совладелец", "ADM", "Работник"].includes(r.name))) return interaction.reply({ content: '📛 \`Error! Кажется вам нельзя использовать эту команду!\`', ephemeral: true });
        const colvo = interaction.options.getNumber('ар');
        const tovar = interaction.options.getString('товар');
        const user = interaction.options.getUser('пользователь')

        let emb = new EmbedBuilder()
        .setTitle(`Оплата заказа`)
        .addFields(
            { name: 'К оплате:', value: `\`${colvo}\` АР` },
            { name: 'Товар:', value: `\`${tovar}\`` }
        )
        .setThumbnail(user.avatarURL({ size: 2048 }))
        .setColor('#2B2D31')

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`gen_${colvo}`)
            .setStyle(ButtonStyle.Success)
            .setLabel('Сгенерировать ссылку')
            .setEmoji('✅'),
        );

        await interaction.reply({ content: `<@${user.id}>`, embeds: [emb], components: [row] })

        let emb1 = new EmbedBuilder()
        .setTitle(`Создание страницы оплаты заказа`)
        .addFields(
          { name: 'Работник:', value: `<@${interaction.user.id}> | \`${interaction.user.username}\`` },
          { name: 'Заказчик:', value: `<@${user.id}> | \`${user.username}\`` },
          { name: 'Сумма:', value: `\`${colvo}\` АР` },
          { name: 'Товар:', value: `\`${tovar}\`` }
        )
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL({ size: 2048 }) })
        .setThumbnail(interaction.user.avatarURL({ size: 2048 }))
        .setColor('#5CAF4F')
        .setTimestamp()
        await client.channels.cache.get(logs).send(({ embeds: [emb1] }));

    } if (interaction.isButton() && interaction.customId.startsWith('gen_')){
        colvo = interaction.customId.slice(4, interaction.customId.length)
        id = interaction.message.content.slice(2, interaction.message.content.length - 1)
        tovar = interaction.message.embeds[0].fields[1].value.slice(1, interaction.message.embeds[0].fields[1].value.length - 1)

        await db.set(`user_${interaction.user.id}`, { tovar: tovar, msg: interaction.message.id })

        if (interaction.user.id !== id) return interaction.reply({ content: `📛 \`Error! Кажется вам нельзя использовать эту кнопку!\``, ephemeral: true });

        let emb = new EmbedBuilder()
        .setTitle('Есть ли у вас промокод?')
        .addFields(
          { name: `Товар:`, value: `\`${tovar}\`` }
        )
        .setThumbnail(interaction.user.avatarURL({ size: 2048 }))
        .setColor('#2B2D31')

        let row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
          .setStyle(ButtonStyle.Success)
          .setCustomId(`promo_${colvo}`)
          .setEmoji('✅'),
          new ButtonBuilder()
          .setStyle(ButtonStyle.Danger)
          .setCustomId(`noprm_${colvo}`)
          .setEmoji('❌')
        )

        await interaction.reply({ content: `<@${interaction.user.id}>`, embeds: [emb], components: [row], ephemeral: true })
    } if (interaction.isButton() && interaction.customId.startsWith('promo_')) {
      colvo = interaction.customId.slice(6, interaction.customId.length)
      const modal = new ModalBuilder()
          .setCustomId(`enter_${colvo}`)
          .setTitle(`📝 Ввод промокода`);
      let promo = new TextInputBuilder()
          .setCustomId('promo')
          .setLabel("Укажите промокод (в точности):")
          .setPlaceholder(`Пример: azura10`)
          .setRequired(true)
          .setStyle(TextInputStyle.Short);

      const firstActionRow = new ActionRowBuilder().addComponents(promo);
      modal.addComponents(firstActionRow);

      await interaction.showModal(modal);
     } if (interaction.isModalSubmit() && interaction.customId.startsWith('enter_')) {
      colvo = interaction.customId.slice(6, interaction.customId.length)
      let promo = interaction.fields.getTextInputValue('promo');
      let promocodes = await db.get('promocodes')

      if (!promocodes.filter(item => item.promo === promo)) return interaction.reply({ content: `📛 \`Error! Промокода: ${promo} нет в базе данных!\``, ephemeral: true });
      let promocode = promocodes.filter(item => item.promo === promo)
      id = interaction.user.id

      if (promocode[0].usage !== Infinity) {
        promocode[0].usage = promocode[0].usage - 1;
      }

      promocodes = promocodes.filter(item => item.promo !== promo)
      await db.set('promocodes', promocodes)

      if (promocode[0].usage > 0) {
        await db.push('promocodes', { promo: promocode[0].promo, usage: promocode[0].usage, discount: promocode[0].discount }) 
      }
      
      sum = parseInt(colvo) - (parseInt(colvo)*parseInt(promocode[0].discount)*0.01)
      let usr = await db.get(`user_${interaction.user.id}`)
      
      try {
        const url = await api.initPayment({
          items: [
            {
              name: `${usr.tovar}`,
              count: '1',
              price: `${parseInt(sum)}`,
              comment: 'T&N Studio'
            }
          ],
          redirectUrl: 'https://www.youtube.com/watch?v=WdzaVsGTic8',
          webhookUrl: 'https://eohz4k5nc2jrf6p.m.pipedream.net',
          data: `${interaction.user.id}\n${usr.tovar}\n${interaction.channel.id}\n${usr.msg}`
        })

        let emb = new EmbedBuilder()
        .setTitle('Ссылка для оплаты заказа')
        .addFields(
          { name: 'Использован промокод:', value: `\`${promo}\`` },
          { name: 'Скидка:', value: `\`${promocode[0].discount}%\`` },
          { name: 'К оплате (с учётом скидки):', value: `\`${parseInt(sum)} АР\`` }
        )
        .setColor('#2B2D31')

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel('Оплатить')
            .setURL(url.url)
            .setEmoji('💸'),
        );

        await interaction.update({ embeds: [emb], components: [row], content: '', ephemeral: true })
    } catch(err) {
      let emb = new EmbedBuilder()
      .setTitle('Ошибка при создании ссылки на оплату')
      .setDescription(`Сообщение об ошибке: \`${err}\``)
      .setColor('#C03A3A')
      .setTimestamp()
      await client.channels.cache.get(logs).send(({ embeds: [emb] }));    
      await interaction.reply({ embeds: [emb], ephemeral: true })
    }
     } if (interaction.isButton() && interaction.customId.startsWith('noprm_')) {
      colvo = interaction.customId.slice(6, interaction.customId.length)
      let usr = await db.get(`user_${interaction.user.id}`)

      try {
        const url = await api.initPayment({
          items: [
            {
              name: `${usr.tovar}`,
              count: '1',
              price: `${parseInt(colvo)}`,
              comment: 'T&N Studio'
            }
          ],
          redirectUrl: 'https://www.youtube.com/watch?v=WdzaVsGTic8',
          webhookUrl: 'https://eohz4k5nc2jrf6p.m.pipedream.net',
          data: `${interaction.user.id}\n${usr.tovar}\n${interaction.channel.id}\n${usr.msg}`
        })

      let emb = new EmbedBuilder()
      .setTitle('Ссылка для оплаты заказа')
      .setColor('#2B2D31')

      const row = new ActionRowBuilder()
      .addComponents(
          new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setLabel('Оплатить')
          .setURL(url.url)
          .setEmoji('💸'),
      );

      await interaction.update({ embeds: [emb], components: [row], content: '', ephemeral: true })
    } catch(err) {
      let emb = new EmbedBuilder()
      .setTitle('Ошибка при создании ссылки на оплату')
      .setDescription(`Сообщение об ошибке: \`${err}\``)
      .setColor('#C03A3A')
      .setTimestamp()
      await client.channels.cache.get(logs).send(({ embeds: [emb] }));    
      await interaction.reply({ embeds: [emb], ephemeral: true })
    }
    }
}
}