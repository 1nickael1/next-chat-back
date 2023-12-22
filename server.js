import express from 'express';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
// import { fileURLToPath } from 'url';
// import path from 'path';

dotenv.config();
const PORT = process.env.PORT || 3000;
const ORIGIN = process.env.ORIGIN || ['http://localhost:3000', '*'];

const app = express();

const corsOptions = {
  origin: ORIGIN,
  credentials: false,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

app.get('/', (req, res) => {
  res.send('Backend working!')
})

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename)
// app.use(express.static(path.join(__dirname, '/public')))

const expressServer = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
})

const io = new Server(expressServer, {
  cors: {
    origin: ORIGIN,
    credentials: true
  }
});

let chat = [];

io.on('connection', (socket) => {
  console.log('A user connected with id '+socket.id);

  socket.emit('first-connection', chat);

  socket.on('new-message', (data) => {
    console.log(`Received message from ID: ${socket.id}`, data);
    chat.push(data);
    io.emit('update-chat', data)
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
