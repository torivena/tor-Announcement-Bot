# Bien Duyuru Botu

Güncel discord.js ile yazılmış, slash komutlarıyla duyuru gönderen gelişmiş Discord botu.

## Kurulum

1. Depoyu klonlayın veya dosyaları indirin.
2. Gerekli kütüphaneleri yükleyin:
   ```bash
   npm install
   ```
3. `.env` dosyasını doldurun:
   - `DISCORD_TOKEN`: Botunuzun tokenı
   - `GUILD_ID`: Botun çalışacağı sunucunun ID'si
   - `LOG_CHANNEL_ID`: Log mesajlarının atılacağı kanalın ID'si

4. Botu başlatın:
   ```bash
   npm start
   ```

## Özellikler
- Slash komutu ile duyuru gönderme
- Sadece yetkililer kullanabilir
- DM gönderiminde rate limit koruması
- Loglama ve hata yönetimi

## Komutlar

- `/duyuru mesaj:<mesaj> [rol:<rol>]`
  - Belirli bir role veya tüm üyelere DM ile duyuru gönderir.

---

**Not:** Discord'un rate limit kurallarına uyunuz. Spam amaçlı kullanım hesabınızın banlanmasına sebep olabilir. 