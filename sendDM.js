export default async function sendDM(member, mesaj) {
  try {
    await member.send(mesaj);
  } catch (err) {
    throw new Error('DM gönderilemedi: ' + err.message);
  }
} 