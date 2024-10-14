const Discord = require('discord.js');
const fs = require('fs')
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { Intents, Permission, Args, Add, ButtonBuilder, ActionRowBuilder, EmbedBuilder, ChannelType, PermissionsBitField, ModalBuilder, TextInputBuilder, ButtonStyle, Client, GatewayIntentBits, TextInputStyle, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    const logs = '1088200691346063420'

    if (interaction.commandName === 'промокод') {
        if (!interaction.member.roles.cache.some(r=>["Глава", "Совладелец", "ADM"].includes(r.name))) return interaction.reply({ content: '📛 \`Error! Кажется вам нельзя использовать эту команду!\`', ephemeral: true });
        let promocode = interaction.options.getString('промокод')
        let discount = interaction.options.getNumber('скидка')
        let usage = interaction.options.getString('использования')
        let action = interaction.options.getString('действие')
        let promocodes = await db.get('promocodes')

        if (action === 'del') {
            promo = promocodes.filter(item => item.promo === promocode)
            if (promo.length > 1) return interaction.reply({ content: `📛 \`Error! Промокод: ${promocode} - не был найден в базе данных!\``, ephemeral: true });
            promocodes = promocodes.filter(item => item.promo !== promocode)
            await db.set('promocodes', promocodes)
            let emb = new EmbedBuilder()
            .setTitle('Удаление промокода')
            .addFields(
                { name: 'Промокод:', value: `\`${promo[0].promo}\`` },
                { name: 'Процент скидки:', value: `\`${promo[0].discount}%\`` },
                { name: 'Кол-во использований:', value: `\`${promo[0].usage}\`` },
            )
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL({ size: 2048 }) })
            .setThumbnail(interaction.user.avatarURL({ size: 2048 }))
            .setColor('#C03A3A')
            .setTimestamp()
            await client.channels.cache.get(logs).send(({ embeds: [emb] }));

            await interaction.reply({ embeds: [emb], ephemeral: true })
        } else {
            if (usage.toLowerCase() !== 'бесконечно' && isNaN(usage)) return interaction.reply({ content: '📛 \`Error! Количество использований промокода должно быть числом!\`', ephemeral: true });
            if (promocodes.indexOf(promocode) != -1) return interaction.reply({ content: `📛 \`Error! Промокод: ${promocode} уже есть в базе данных!\``, ephemeral: true });
    
            if (usage.toLowerCase() === 'бесконечно') {
                await db.push('promocodes', { promo: promocode, usage: Infinity, discount: discount })
                let emb = new EmbedBuilder()
                .setTitle('Добавление промокода')
                .addFields(
                    { name: 'Промокод:', value: `\`${promocode}\`` },
                    { name: 'Процент скидки:', value: `\`${discount}%\`` },
                    { name: 'Кол-во использований:', value: `\`Бесконечно\`` },
                )
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL({ size: 2048 }) })
                .setThumbnail(interaction.user.avatarURL({ size: 2048 }))
                .setColor('#5CAF4F')
                .setTimestamp()
                await client.channels.cache.get(logs).send(({ embeds: [emb] }));
    
                await interaction.reply({ embeds: [emb], ephemeral: true })
            } else {
                await db.push('promocodes', { promo: promocode, usage: usage, discount: discount })
                let emb = new EmbedBuilder()
                .setTitle('Добавление промокода')
                .addFields(
                    { name: 'Промокод:', value: `\`${promocode}\`` },
                    { name: 'Процент скидки:', value: `\`${discount}%\`` },
                    { name: 'Кол-во использований:', value: `\`${usage}\`` },
                )
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL({ size: 2048 }) })
                .setThumbnail(interaction.user.avatarURL({ size: 2048 }))
                .setColor('#5CAF4F')
                .setTimestamp()
                await client.channels.cache.get(logs).send(({ embeds: [emb] }));
    
                await interaction.reply({ embeds: [emb], ephemeral: true })
            }
        }
    }
}
}