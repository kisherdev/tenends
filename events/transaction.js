const Discord = require('discord.js');
const fs = require('fs')
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const discordTranscripts = require('discord-html-transcripts');
const { Intents, Permission, Args, Add, ButtonBuilder, ActionRowBuilder, EmbedBuilder, ChannelType, PermissionsBitField, ModalBuilder, TextInputBuilder, ButtonStyle, Client, GatewayIntentBits, TextInputStyle, StringSelectMenuBuilder, UserSelectMenuBuilder } = require('discord.js');
const { SPWorlds } = require('spworlds');
const api = new SPWorlds({ id: 'null', token: 'null' })

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    const logs = '1088200691346063420'
    if (interaction.commandName === 'перевод') {
        if (!interaction.member.roles.cache.some(r=>["Глава", "Совладелец", "ADM"].includes(r.name))) return interaction.reply({ content: '📛 \`Error! Кажется вам нельзя использовать эту команду!\`', ephemeral: true });
        const colvo = interaction.options.getNumber('ар');
        const card = interaction.options.getNumber('карта');
        const comment = interaction.options.getString('комментарий')

        try {
            api.createTransaction({
                receiver: `${card}`,
                amount: `${colvo}`,
                comment: `${comment}`
            })
            
            let emb = new EmbedBuilder()
            .setTitle('Перевод успешно произведен!')
            .addFields(
                { name: 'Карта:', value: `\`${card}\`` },
                { name: 'Сумма:', value: `\`${colvo}\` АР` },
                { name: 'Комментарий:', value: `\`${comment}\`` }
            )
            .setColor('#5CAF4F')

            await interaction.reply({ embeds: [emb], ephemeral: true })

            let emb1 = new EmbedBuilder()
            .setTitle('Перевод')
            .addFields(
                { name: 'Перевод отправил:', value: `<@${interaction.user.id}> | \`${interaction.user.username}\`` },
                { name: 'Карта:', value: `\`${card}\`` },
                { name: 'Сумма:', value: `\`${colvo}\` АР` },
                { name: 'Комментарий:', value: `\`${comment}\`` }
            )
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL({ size: 2048 }) })
            .setThumbnail(interaction.user.avatarURL({ size: 2048 }))
            .setColor('#5CAF4F')
            .setTimestamp()
            await client.channels.cache.get(logs).send(({ embeds: [emb1] }));
        } catch(err) {
            let emb = new EmbedBuilder()
            .setTitle('Ошибка при переводе')
            .setDescription(`Сообщение об ошибке: \`${err}\``)
            .setColor('#C03A3A')
            .setTimestamp()
            await client.channels.cache.get(logs).send(({ embeds: [emb] }));    
            await interaction.reply({ embeds: [emb], ephemeral: true })
        }
    }
}
}
