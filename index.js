const express = requrire('express');
const app = express();

app.get('/', (req, res) => {
  // res.status(200).send('Welcome to Natours');
  res.status(200).json({
    message: 'Hello from Natours',
    app: 'Natours'
  });
});

app.post('/', (req, res) => {
  res.send('You can post to this endpoint');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Listening to PORT ${PORT}`);
});