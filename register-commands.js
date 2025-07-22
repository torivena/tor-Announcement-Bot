import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();

const commands = [];
const commandsPath = path.join(process.cwd(), 'src', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') && file !== 'register-commands.js');

for (const file of commandFiles) {
  const command = await import(`file://${path.join(commandsPath, file)}`);
  if (command.default && command.default.data) {
    commands.push(command.default.data.toJSON());
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Slash komutları yükleniyor...');
    await rest.put(
      Routes.applicationGuildCommands(
        (await rest.get(Routes.user())).id,
        process.env.GUILD_ID
      ),
      { body: commands }
    );
    console.log('Slash komutları başarıyla yüklendi!');
  } catch (error) {
    console.error('Komut yükleme hatası:', error);
  }
})(); 