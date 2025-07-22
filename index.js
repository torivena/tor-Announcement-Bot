import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js';
import dotenv from 'dotenv';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

// .env dosyasını yükle
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Channel]
});

client.commands = new Collection();

// Komutları yükle
const commandsPath = path.join(process.cwd(), 'src', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = await import(`file://${filePath}`);
  if (command.default && command.default.data && command.default.execute) {
    client.commands.set(command.default.data.name, command.default);
  }
}

client.once('ready', () => {
  console.log(chalk.green(`[BienBot] Giriş yapıldı: ${client.user.tag}`));
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(chalk.red(`[HATA] Komut çalıştırılırken hata: ${error}`));
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'Bir hata oluştu.', ephemeral: true });
    } else {
      await interaction.reply({ content: 'Bir hata oluştu.', ephemeral: true });
    }
  }
});

client.login(process.env.DISCORD_TOKEN); 