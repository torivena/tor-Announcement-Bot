import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import sendDM from '../utils/sendDM.js';
import dotenv from 'dotenv';
dotenv.config();

export default {
  data: new SlashCommandBuilder()
    .setName('duyuru')
    .setDescription('Belirli bir role veya tüm üyelere DM ile duyuru gönderir.')
    .addStringOption(option =>
      option.setName('mesaj')
        .setDescription('Gönderilecek duyuru mesajı')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('rol')
        .setDescription('Sadece bu role sahip üyelere gönder')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    const mesaj = interaction.options.getString('mesaj');
    const rol = interaction.options.getRole('rol');
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild) return interaction.reply({ content: 'Sunucu bulunamadı.', ephemeral: true });

    await interaction.reply({ content: 'Duyuru gönderiliyor, bu işlem zaman alabilir...', ephemeral: true });

    let members;
    if (rol) {
      members = guild.members.cache.filter(m => m.roles.cache.has(rol.id) && !m.user.bot);
    } else {
      members = guild.members.cache.filter(m => !m.user.bot);
    }

    let basarili = 0, hata = 0;
    for (const member of members.values()) {
      try {
        await sendDM(member, mesaj);
        basarili++;
        await new Promise(res => setTimeout(res, 1200)); // Rate limit koruması
      } catch (err) {
        hata++;
      }
    }

    // Log kanalı buraya id'yi girmeyin env. oluşturup ona girin
    const logChannel = guild.channels.cache.get(process.env.LOG_CHANNEL_ID);
    if (logChannel) {
      logChannel.send(`Duyuru tamamlandı. Başarılı: ${basarili}, Hatalı: ${hata}, Komut: ${interaction.user.tag}`);
    }

    await interaction.editReply({ content: `Duyuru tamamlandı! Başarılı: ${basarili}, Hatalı: ${hata}` });
  }
}; 
