const Discord = require('discord.js');
const fs = require('fs')
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const discordTranscripts = require('discord-html-transcripts');
const { Intents, Permission, Args, Add, ButtonBuilder, ActionRowBuilder, EmbedBuilder, ChannelType, PermissionsBitField, ModalBuilder, TextInputBuilder, ButtonStyle, Client, GatewayIntentBits, TextInputStyle, StringSelectMenuBuilder, UserSelectMenuBuilder } = require('discord.js');


module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    const worker = '1035987717806362715'
    const otz = '1151246120329154672'
    const logs = '1088200691346063420'
    const orders = '1035988617702682683'
    if (interaction.commandName === 'меню') {

        if (!interaction.member.roles.cache.some(r=>["Глава", "Совладелец", "ADM"].includes(r.name))) return interaction.reply({ content: '📛 \`Error! Кажется вам нельзя использовать эту команду!\`', ephemeral: true });
        let emb = new EmbedBuilder()
        .setTitle('*Я - Тэнэн, твой персональный помощник в создание заказа!*')
        .setDescription('Чтобы приступить к созданию заказа - тебе нужно нажать на кнопку ниже ⬇️')
        .setColor('#2B2D31')

        const row = new ActionRowBuilder()
	    .addComponents(
	        new ButtonBuilder()
	        .setCustomId('create')
	        .setStyle('2')
	        .setEmoji('📝'),
	    );

        await interaction.reply({embeds: [emb], components: [row]})
    } if (interaction.isButton() && interaction.customId === 'create') {
        let emb = new EmbedBuilder()
        .setTitle('📦 Для начала - тебе нужно выбрать способ оплаты!')
        .setColor('#2B2D31')

        let row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
            .setCustomId('oplata')
            .setPlaceholder('👇 Выбери способ ниже:')
            .addOptions(
                {
                    label: 'АРы',
                    value: 'АРы'
                },
                {
                    label: 'Рубли',
                    value: 'Рубли'
                }
            )
        );

        await interaction.reply({ embeds: [emb], components: [row], ephemeral: true })
    } if (interaction.customId === 'oplata'){
        let tovars = await db.get('tovars')

        const categ = interaction.values[0];
        await db.set(`oplata_${interaction.user.id}`, categ)
  
        let emb = new EmbedBuilder()
        .setTitle('✅ Успешно! Теперь стоит выбрать товар!')
        .addFields(
          { name: 'Вид оплаты:', value: `\`${categ}\``}
        )
        .setColor('#2B2D31')

        tovar = []

        for (let i of tovars) {
          valuta = i.valuta
          if (valuta === undefined) {
            tovar.push({ label: `${i.name}`, value: `${i.name}` })
          } else if (valuta.includes(categ)){
            tovar.push({ label: `${i.name}`, value: `${i.name}` })
          }
        }
  
        let row = new ActionRowBuilder()
              .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('tovar')
                .setPlaceholder('👇 Выбери товар ниже:')
                .addOptions(tovar)
              );
  
        await interaction.update({ embeds: [emb], components: [row] })
    } if (interaction.customId === 'tovar') {
        const categ = interaction.values[0];

        let tovars = await db.get('tovars')
        tovar = tovars.filter(item => item.name.toLowerCase() === categ.toLowerCase())

        let glava = interaction.guild.roles.cache.find(role => role.name.toLowerCase().includes('Глава'.toLocaleLowerCase()))
        let soglava = interaction.guild.roles.cache.find(role => role.name.toLowerCase().includes('Совладелец'.toLocaleLowerCase()))

        const everyone = interaction.guild.roles.cache.get(interaction.guild.id)
        min = 100000
        max = 999999
        let rand = await Math.floor(Math.random() * (max - min + 1)) + min;

        interaction.guild.channels.create({
          name: `заказ-${rand}`,
          type: ChannelType.GuildText,
          parent: orders,
          topic: interaction.user.id,
          permissionOverwrites: [{
            id: interaction.user.id,
            allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.AttachFiles],
          },
          {
            id: tovar[0].role,
            allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.AttachFiles],
          },
          {
            id: worker,
            deny: [PermissionsBitField.Flags.ViewChannel]
          },
          {
            id: everyone,
            deny: [PermissionsBitField.Flags.ViewChannel]
          },
        ],
        }).then(async (c) => {
            let emb = new EmbedBuilder()
            .setTitle(`Заказ №${rand}`)
            .addFields(
                { name: 'Заказчик:', value: `<@${interaction.user.id}>` },
                { name: 'Товар:', value: `\`${categ}\`` },
                { name: 'Способ оплаты:', value: `\`${await db.get(`oplata_${interaction.user.id}`)}\`` },
            )
            .setThumbnail(interaction.member.displayAvatarURL({ format: 'png', size: 2048 }))
            .setFooter({ text: `${interaction.user.username}` })
            .setTimestamp()
            .setColor('#2B2D31')

            const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId(`del_${c.id}`)
                .setStyle(ButtonStyle.Danger)
                .setLabel('Закрыть заказ')
                .setEmoji('❌'),
            );

            await db.delete(`oplata_${interaction.user.id}`)

            await c.send({ embeds: [emb], components: [row], content: `<@!${interaction.user.id}>\n\n<@&${glava.id}> <@&${soglava.id}>` })
            await interaction.update({ embeds: [], components: [], content: `✅ \`Успешно! Создан заказ - \`<#${c.id}>`, ephemeral: true })
        })
    } if (interaction.isButton() && interaction.customId.startsWith('del_')) {
      let id = interaction.customId.toString().slice(4, interaction.customId.length)
      let chan = client.channels.cache.get(id)
      chan.setName(`завершено-${chan.name.slice(6, chan.name.length)}`)

      let emb = new EmbedBuilder()
      .setTitle('⭐ Оставить отзыв!')
      .setImage('https://media.discordapp.net/attachments/1224403802317393930/1225799397003100171/pattern2_preview_4.png?ex=662271a6&is=660ffca6&hm=d03b40f2c342fe47c59af1141142593c41c10c350d85eb5d21996e593e6a1dad&=&format=webp&quality=lossless&width=1201&height=675')
      .setColor('#2B2D31')

      let row = new ActionRowBuilder()
      .addComponents(
          new UserSelectMenuBuilder()
          .setPlaceholder('👇 Выберите работника:')
          .setCustomId(`sel_work`)
          .setMaxValues(1)
      )

      let row1 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setCustomId('close')
        .setStyle(ButtonStyle.Danger)
        .setLabel('Удалить канал')
      )

      await interaction.reply({ embeds: [emb], components: [row, row1], content: `<@${chan.topic}>` })
    } if (interaction.customId === 'sel_work'){
      let chan = client.channels.cache.get(interaction.channelId)
      if (interaction.user.id !== chan.topic) return interaction.reply({ content: `:x: \`Оставить отзыв может лишь заказчик!\``, ephemeral: true });
      const map = interaction.users
      const arr = [];
      for (const [key, value] of map) {
          arr.push({ key, value });
      }
      let member = await interaction.guild.members.fetch(arr[0].key).catch(err => {});

      const modal = new ModalBuilder()
          .setCustomId(`otz_${member.id}`)
          .setTitle(`⭐ Отзыв | ${member.user.username}`);
      const count = new TextInputBuilder()
          .setCustomId('count')
          .setLabel("Оцените работу от 1 до 5")
          .setPlaceholder(`Пример: 5`)
          .setRequired(true)
          .setStyle(TextInputStyle.Short);
      const desc = new TextInputBuilder()
          .setCustomId('desc')
          .setLabel("Напишите отзыв о работнике")
          .setPlaceholder(`Пример: Отлично выполненая работа, сделано за пару дней и качественно!`)
          .setRequired(true)
          .setStyle(TextInputStyle.Short);

      const firstActionRow = new ActionRowBuilder().addComponents(count);
      const sActionRow = new ActionRowBuilder().addComponents(desc);
      modal.addComponents(firstActionRow, sActionRow);

      await interaction.showModal(modal);
    } if (interaction.isModalSubmit() && interaction.customId.startsWith('otz_')){
      let id = interaction.customId.slice(4, interaction.customId.length)
      let member = await interaction.guild.members.fetch(id).catch(err => {});

      const count = interaction.fields.getTextInputValue('count');
      const desc = interaction.fields.getTextInputValue('desc');

      const emb = new EmbedBuilder()
      .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL({ size: 2048 }) })
      .setTitle(`⭐ Отзыв | ${member.user.username}`)
      .addFields(
        { name: `Оценка:`, value: `⭐ \`${count}\`` },
        { name: `Отзыв:`, value: `\`${desc}\`` }
      )
      .setColor('#2B2D31')
      .setImage('https://media.discordapp.net/attachments/1224403802317393930/1225803205758156830/default_preview_2.png?ex=66227532&is=66100032&hm=b378503824b5be008b39ecd8fcbdb9d80f0f1f534de981b05961760e97a95d5b&=&format=webp&quality=lossless&width=1201&height=675')
      .setFooter({ text: `dev: kishulya` })
      
      await client.channels.cache.get(otz).send({ embeds: [emb] });

      let chan = client.channels.cache.get(interaction.message.channelId)
      chan.permissionOverwrites.delete(interaction.user.id);

      let row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setCustomId('close')
        .setStyle(ButtonStyle.Danger)
        .setLabel('Удалить канал')
      )

      interaction.reply({ components: [row] })
    } if (interaction.customId === 'close'){
      let chan = client.channels.cache.get(interaction.message.channelId)
      const attachment = await discordTranscripts.createTranscript(chan);

      let emb = new EmbedBuilder()
      .setTitle('Удаление заказа')
      .addFields(
        { name: `Номер заказа:`, value: `\`${chan.name.slice(10, chan.name.length)}\`` }
      )
      .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL({ size: 2048 }) })
      .setThumbnail(interaction.user.avatarURL({ size: 2048 }))
      .setColor('#C03A3A')
      .setTimestamp()

      await client.channels.cache.get(logs).send({ embeds: [emb], files: [attachment] })

      await interaction.update({ content: `Удаляю канал...` }).then(() => {
        chan.delete()
      })
    }
  }
}