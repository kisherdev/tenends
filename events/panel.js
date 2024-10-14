const Discord = require('discord.js');
const fs = require('fs')
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { Intents, Permission, Args, Add, ButtonBuilder, ActionRowBuilder, EmbedBuilder, ChannelType, PermissionsBitField, ModalBuilder, TextInputBuilder, ButtonStyle, Client, GatewayIntentBits, TextInputStyle, StringSelectMenuBuilder } = require('discord.js');


module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    const logs = '1088200691346063420'
    const worker = '1035987717806362715'
    const ruble = '1088207655652315176'
    const ar = '1088207787198267443'
    const workers = ['Художник', 'Кодер', '3Dшник', 'Ресурспакер', 'Дизайнер', 'скинодел']

    if (interaction.commandName === 'панель') {
        if (!interaction.member.roles.cache.some(r=>["Глава", "Совладелец", "ADM"].includes(r.name))) return interaction.reply({ content: '📛 \`Error! Кажется вам нельзя использовать эту команду!\`', ephemeral: true });
        let emb = new EmbedBuilder()
        .setTitle('Панель: Администрация')
        .setImage('https://media.discordapp.net/attachments/1224403802317393930/1224410298903957646/pattern2_preview_1.png?ex=661d63f3&is=660aeef3&hm=5b6f748234b88c2c3d0040a30c5b11aceffb387c40e77bff7b7f21da9038a48c&=&format=webp&quality=lossless&width=882&height=496')
        .setColor('#2B2D31')

        let row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
            .setCustomId('adm_panel')
            .setPlaceholder('👇 Выбери действие ниже:')
            .addOptions(
                {
                    label: 'Управление товарами',
                    value: 'edit_tovars'
                },
                {
                    label: 'Управление сотрудниками',
                    value: 'edit_pidors'
                }
            )
        );

        await interaction.reply({ embeds: [emb], components: [row], ephemeral: true })
    } if (interaction.isStringSelectMenu() && interaction.customId === 'adm_panel') {
        const categ = interaction.values[0]

        if (categ === 'edit_tovars'){
            let emb = new EmbedBuilder()
            .setImage('https://media.discordapp.net/attachments/1224403802317393930/1224410298216222750/pattern2_preview_2.png?ex=661d63f3&is=660aeef3&hm=0a5688922a0a04f58a224e183c45e87fb401f6c550ad20c895af712030713db6&=&format=webp&quality=lossless&width=882&height=496')
            .setFooter({ text: 'Панель: Администрация → Управление товарами' })
            .setColor('#2B2D31')

            let row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('categ')
                .setPlaceholder('👇 Выбери действие ниже:')
                .addOptions(
                    {
                        label: 'Добавить категорию',
                        value: 'add_categ'
                    },
                    {
                        label: 'Удалить категорию',
                        value: 'del_categ'
                    }
                )
            );

            await interaction.update({ embeds: [emb], components: [row], ephemeral: true })
        } if (categ === 'edit_pidors'){
            let emb = new EmbedBuilder()
            .setImage('https://media.discordapp.net/attachments/1224403802317393930/1224410299654996070/pattern2_preview_3.png?ex=661d63f3&is=660aeef3&hm=383cb45f5d4358d9ee8688bb9de121768df176eb088c08df73518bbf644338b5&=&format=webp&quality=lossless&width=882&height=496')
            .setFooter({ text: 'Панель: Администрация → Управление сотрудниками' })
            .setColor('#2B2D31')

            let row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('pidors')
                .setPlaceholder('👇 Выбери действие ниже:')
                .addOptions(
                    {
                        label: 'Добавить сотрудника',
                        value: 'add_pidor'
                    },
                    {
                        label: 'Удалить сотрудника',
                        value: 'del_pidor'
                    }
                )
            );

            await interaction.update({ embeds: [emb], components: [row], ephemeral: true })
        }
    } if (interaction.isStringSelectMenu() && interaction.customId === 'categ'){
        const categ = interaction.values[0]

        if (categ === 'add_categ'){
            const modal = new ModalBuilder()
                .setCustomId(`adm_categ`)
                .setTitle(`📝 Добавить категорию`);
            const name = new TextInputBuilder()
                .setCustomId('name')
                .setLabel("Укажите название категории")
                .setPlaceholder(`Пример: Боты`)
                .setRequired(true)
                .setStyle(TextInputStyle.Short);
            const role = new TextInputBuilder()
                .setCustomId('role')
                .setLabel("Укажите работников категории")
                .setPlaceholder(`Пример: Кодер`)
                .setRequired(true)
                .setStyle(TextInputStyle.Short);
            const valuta = new TextInputBuilder()
                .setCustomId('valuta')
                .setLabel('Укажите валюту категории')
                .setPlaceholder('АРы/Рубли')
                .setRequired(true)
                .setStyle(TextInputStyle.Short)

            const firstActionRow = new ActionRowBuilder().addComponents(name);
            const sActionRow = new ActionRowBuilder().addComponents(role);
            const th = new ActionRowBuilder().addComponents(valuta)
            modal.addComponents(firstActionRow, sActionRow, th);

            await interaction.showModal(modal);
        } if (categ === 'del_categ'){
            const modal = new ModalBuilder()
                .setCustomId(`dem_categ`)
                .setTitle(`📝 Удалить категорию`);
            const name = new TextInputBuilder()
                .setCustomId('name')
                .setLabel("Укажите название категории")
                .setPlaceholder(`Пример: 4D Скин`)
                .setRequired(true)
                .setStyle(TextInputStyle.Short);

            const firstActionRow = new ActionRowBuilder().addComponents(name);
            modal.addComponents(firstActionRow);

            await interaction.showModal(modal);
        }
    } if (interaction.isStringSelectMenu() && interaction.customId === 'pidors'){
        const categ = interaction.values[0]

        if (categ === 'add_pidor'){
            const modal = new ModalBuilder()
                .setCustomId(`adm_pidor`)
                .setTitle(`📝 Добавить сотрудника`);
            const id = new TextInputBuilder()
                .setCustomId('id')
                .setLabel("Укажите ID сотрудника")
                .setPlaceholder(`Пример: 852617513070231593`)
                .setRequired(true)
                .setStyle(TextInputStyle.Short);
			const categ = new TextInputBuilder()
                .setCustomId('categ')
                .setLabel("Укажите категорию работника")
                .setPlaceholder(`Пример: Кодер`)
                .setRequired(true)
                .setStyle(TextInputStyle.Short);
            const valuta = new TextInputBuilder()
                .setCustomId('valuta')
                .setLabel("Укажите способы оплаты")
                .setPlaceholder(`Пример: АРы/Рубли`)
                .setRequired(true)
                .setStyle(TextInputStyle.Short);

            const firstActionRow = new ActionRowBuilder().addComponents(id);
			const twActionRow = new ActionRowBuilder().addComponents(categ);
            const thActionRow = new ActionRowBuilder().addComponents(valuta);
            modal.addComponents(firstActionRow, twActionRow, thActionRow);

            await interaction.showModal(modal);
        } if (categ === 'del_pidor'){
            const modal = new ModalBuilder()
                .setCustomId(`dem_pidor`)
                .setTitle(`📝 Удалить сотрудника`);
            const id = new TextInputBuilder()
                .setCustomId('id')
                .setLabel("Укажите ID сотрудника")
                .setPlaceholder(`Пример: 852617513070231593`)
                .setRequired(true)
                .setStyle(TextInputStyle.Short);

            const firstActionRow = new ActionRowBuilder().addComponents(id);
            modal.addComponents(firstActionRow);

            await interaction.showModal(modal);
        }
    } if (interaction.isModalSubmit() && interaction.customId === 'adm_categ'){
        const name = interaction.fields.getTextInputValue('name');
        const rol = interaction.fields.getTextInputValue('role');
        const valuta = interaction.fields.getTextInputValue('valuta')

        let r = interaction.guild.roles.cache.find(role => role.name.toLowerCase().includes(rol.toLowerCase()))

        await db.push('tovars', { name: name, role: r.id, valuta: valuta.split('/') })

        let emb = new EmbedBuilder()
        .setTitle('Добавление категории')
        .addFields(
            { name: 'Категория:', value: `\`${name}\`` },
            { name: 'Валюта', value: `\`${valuta}\`` }
        )
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL({ size: 2048 }) })
        .setThumbnail(interaction.user.avatarURL({ size: 2048 }))
        .setColor('#5CAF4F')
        .setTimestamp()
        await client.channels.cache.get(logs).send(({ embeds: [emb] }));

        let emb1 = new EmbedBuilder()
        .setTitle('Панель: Администрация')
        .setImage('https://media.discordapp.net/attachments/1224403802317393930/1224410298903957646/pattern2_preview_1.png?ex=661d63f3&is=660aeef3&hm=5b6f748234b88c2c3d0040a30c5b11aceffb387c40e77bff7b7f21da9038a48c&=&format=webp&quality=lossless&width=882&height=496')
        .setColor('#2B2D31')

        let row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
            .setCustomId('adm_panel')
            .setPlaceholder('👇 Выбери действие ниже:')
            .addOptions(
                {
                    label: 'Управление товарами',
                    value: 'edit_tovars'
                },
                {
                    label: 'Управление сотрудниками',
                    value: 'edit_pidors'
                }
            )
        );
        await interaction.update({ embeds: [emb1], components: [row] })
    } if (interaction.isModalSubmit() && interaction.customId === 'dem_categ'){
        const name = interaction.fields.getTextInputValue('name');

        let all = await db.get('tovars')
        all = all.filter(item => item.name.toLowerCase() !== name.toLowerCase())
        await db.set('tovars', all)

        let emb = new EmbedBuilder()
        .setTitle('Удаление категории')
        .addFields(
            { name: 'Категория:', value: `\`${name}\`` }
        )
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL({ size: 2048 }) })
        .setThumbnail(interaction.user.avatarURL({ size: 2048 }))
        .setColor('#C03A3A')
        .setTimestamp()
        await client.channels.cache.get(logs).send(({ embeds: [emb] }));

        let emb1 = new EmbedBuilder()
        .setTitle('Панель: Администрация')
        .setImage('https://media.discordapp.net/attachments/1224403802317393930/1224410298903957646/pattern2_preview_1.png?ex=661d63f3&is=660aeef3&hm=5b6f748234b88c2c3d0040a30c5b11aceffb387c40e77bff7b7f21da9038a48c&=&format=webp&quality=lossless&width=882&height=496')
        .setColor('#2B2D31')

        let row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
            .setCustomId('adm_panel')
            .setPlaceholder('👇 Выбери действие ниже:')
            .addOptions(
                {
                    label: 'Управление товарами',
                    value: 'edit_tovars'
                },
                {
                    label: 'Управление сотрудниками',
                    value: 'edit_pidors'
                }
            )
        );
        await interaction.update({ embeds: [emb1], components: [row] })
    } if (interaction.isModalSubmit() && interaction.customId === 'adm_pidor'){
        const id = interaction.fields.getTextInputValue('id');
        const categ = interaction.fields.getTextInputValue('categ');
        const valuta = interaction.fields.getTextInputValue('valuta');

        await db.push('workers', { id: id, categ: categ, valuta: valuta.split('/') })

        let member = await interaction.guild.members.fetch(id).catch(err => {});
        try {
            let role = interaction.guild.roles.cache.find(role => role.name.toLowerCase().includes(categ.toLowerCase()))
            await member.roles.add([role, worker])
            if (valuta.split('/').length === 1) {
                await member.roles.add(interaction.guild.roles.cache.find(role => role.name.toLowerCase().includes(valuta.toLowerCase())))
            } else {
                for (let i of valuta.split('/')){
                    await member.roles.add(interaction.guild.roles.cache.find(role => role.name.toLowerCase().includes(`${i.toLowerCase()}`)))
                }
            }
        } catch(err) {
            let emb = new EmbedBuilder()
            .setTitle('Ошибка при выдаче роли!')
            .setDescription(`Сообщение об ошибке: \`${err}\``)
            .setColor('#C03A3A')
            .setTimestamp()
            
            await client.channels.cache.get(logs).send(({ embeds: [emb] }));

            let emb1 = new EmbedBuilder()
            .setTitle('Панель: Администрация')
            .setImage('https://media.discordapp.net/attachments/1224403802317393930/1224410298903957646/pattern2_preview_1.png?ex=661d63f3&is=660aeef3&hm=5b6f748234b88c2c3d0040a30c5b11aceffb387c40e77bff7b7f21da9038a48c&=&format=webp&quality=lossless&width=882&height=496')
            .setDescription(`Произошла ошибка при добавлении сотрудника!`)
            .setColor('#2B2D31')
    
            let row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('adm_panel')
                .setPlaceholder('👇 Выбери действие ниже:')
                .addOptions(
                    {
                        label: 'Управление товарами',
                        value: 'edit_tovars'
                    },
                    {
                        label: 'Управление сотрудниками',
                        value: 'edit_pidors'
                    }
                )
            );

            await interaction.update({ embeds: [emb1], components: [row] })
            return;
        }

        let emb = new EmbedBuilder()
        .setTitle('Добавление работника')
        .addFields(
            { name: 'Работник:', value: `<@${member.id}> | \`${member.user.username}\``},
            { name: 'Валюта:', value: `\`${valuta}\``},
            { name: 'Категория:', value: `\`${categ}\`` }
        )
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL({ size: 2048 }) })
        .setThumbnail(member.user.avatarURL({ size: 2048 }))
        .setColor('#5CAF4F')
        .setTimestamp()
        await client.channels.cache.get(logs).send(({ embeds: [emb] }));

        let emb1 = new EmbedBuilder()
        .setTitle('Панель: Администрация')
        .setImage('https://media.discordapp.net/attachments/1224403802317393930/1224410298903957646/pattern2_preview_1.png?ex=661d63f3&is=660aeef3&hm=5b6f748234b88c2c3d0040a30c5b11aceffb387c40e77bff7b7f21da9038a48c&=&format=webp&quality=lossless&width=882&height=496')
        .setColor('#2B2D31')

        let row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
            .setCustomId('adm_panel')
            .setPlaceholder('👇 Выбери действие ниже:')
            .addOptions(
                {
                    label: 'Управление товарами',
                    value: 'edit_tovars'
                },
                {
                    label: 'Управление сотрудниками',
                    value: 'edit_pidors'
                }
            )
        );
        await interaction.update({ embeds: [emb1], components: [row] })
    } if (interaction.isModalSubmit() && interaction.customId === 'dem_pidor'){
        const id = interaction.fields.getTextInputValue('id');

        let all = await db.get('workers')
        memb = all.find(item => item.id === id)
        all = all.filter(item => item.id !== id)
        
        let member = await interaction.guild.members.fetch(memb.id).catch(err => {});

        await member.roles.remove([worker, ruble, ar])
        for (let i of workers) {
            role = interaction.guild.roles.cache.find(role => role.name.toLowerCase().includes(i.toLowerCase()))
            member.roles.remove(role)
        }

        await db.set('workers', all)

        let emb = new EmbedBuilder()
        .setTitle('Удаление работника')
        .addFields(
            { name: 'Работник:', value: `<@${member.id}> | \`${member.user.username}\``},
            { name: 'Валюта:', value: `\`${memb.valuta}\``},
            { name: 'Категория:', value: `\`${memb.categ}\`` }
        )
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL({ size: 2048 }) })
        .setThumbnail(member.user.avatarURL({ size: 2048 }))
        .setColor('#C03A3A')
        .setTimestamp()
        await client.channels.cache.get(logs).send(({ embeds: [emb] }));

        let emb1 = new EmbedBuilder()
        .setTitle('Панель: Администрация')
        .setImage('https://media.discordapp.net/attachments/1224403802317393930/1224410298903957646/pattern2_preview_1.png?ex=661d63f3&is=660aeef3&hm=5b6f748234b88c2c3d0040a30c5b11aceffb387c40e77bff7b7f21da9038a48c&=&format=webp&quality=lossless&width=882&height=496')
        .setColor('#2B2D31')

        let row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
            .setCustomId('adm_panel')
            .setPlaceholder('👇 Выбери действие ниже:')
            .addOptions(
                {
                    label: 'Управление товарами',
                    value: 'edit_tovars'
                },
                {
                    label: 'Управление сотрудниками',
                    value: 'edit_pidors'
                }
            )
        );
        await interaction.update({ embeds: [emb1], components: [row] })
    }
}
}