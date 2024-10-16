const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
dotenv.config({ path: './File/config.env' });
const authRouter = require('./Router/authRouter');
const mongoose = require('mongoose');
const userRouter = require('./Router/UserRouter');
const cors = require('cors');

let app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose
  .connect(process.env.CONN_STR, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection successful..!");
  })
  .catch((err) => {
    console.log("Some error occurred: ", err.message);
  });

app.use('/admin_dashboard/v1/auth', authRouter);
app.use('/admin_dashboard/v1/user', userRouter);

app.get('/', (req, res) => {
  res.send('Server is running');
});


const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });
  
  app.set('io',io)

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });



server.listen(process.env.PORT || 3000, () => {

  console.log(`Server started on http://localhost:${process.env.PORT || 3000}`);
});


module.exports = app ;
