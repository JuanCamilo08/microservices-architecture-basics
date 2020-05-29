const express = require('express');
const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const app = express();
app.use(express.json());

(async () => {
  try {
    mongoose.connect('mongodb://localhost:27017/express-mongo', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('db running...');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

const Greet = model('Greet', new Schema({
  greet: {
    type: String,
    required: true,
    minlength: 5,
  }
}));

app.get('/greet', async (req, res) => {
  const greets = await Greet.find();

  res.send(greets);
});

app.post('/greet', async (req, res) => {
  const { greet } = req.body;
  if (!greet) return res.status(400).json('You must provide a greet');

  const result = await new Greet({ greet }).save();
  res.send(result);
});

app.listen(3000, () => console.log('server running at port 3000...'));