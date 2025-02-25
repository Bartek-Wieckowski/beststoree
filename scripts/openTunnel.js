const { exec } = require('child_process');
const dotenv = require('dotenv');

dotenv.config();

const { SSH_USER, SSH_HOST, DATABASE_HOST, DATABASE_PORT } = process.env;

const openTunnel = () => {
  if (!SSH_USER || !SSH_HOST || !DATABASE_HOST || !DATABASE_PORT) {
    console.error('Brakuje zmiennych środowiskowych! Sprawdź plik .env.');
    return;
  }

  const command = `ssh -i ~/.ssh/id_ed25519 -f ${SSH_USER}@${SSH_HOST} -L 8543:${DATABASE_HOST}:${DATABASE_PORT} -N`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(`Błąd podczas otwierania tunelu SSH: ${stderr}`);
      return;
    }
    console.log('Tunel SSH otwarty:', stdout);
  });
};

// Uruchom tunel
openTunnel();
