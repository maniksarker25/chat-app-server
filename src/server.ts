import { Server } from 'http';
import mongoose from 'mongoose';
import config from './app/config';
// import { server } from './app/socket';
// import app from './app';
import server from './app';

let myServer: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    myServer = server.listen(config.port, () => {
      console.log(`Chat app listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();

process.on('uncaughtException', () => {
  if (myServer) {
    myServer.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log('uncaughtException is detected ');
  process.exit(1);
});
