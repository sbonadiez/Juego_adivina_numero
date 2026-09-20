const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let secretNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;

app.post('/api/guess', (req, res) => {
  const guess = parseInt(req.body.guess, 10);
  attempts++;

  if (isNaN(guess)) {
    return res.status(400).json({ error: 'Envía un número válido' });
  }

  if (guess === secretNumber) {
    const result = { result: 'correct', attempts, message: `¡Adivinaste! Era el ${secretNumber}` };
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    return res.json(result);
  }

  res.json({
    result: guess < secretNumber ? 'higher' : 'lower',
    attempts,
    message: guess < secretNumber ? 'El número es más alto ⬆️' : 'El número es más bajo ⬇️',
  });
});

app.get('/api/status', (req, res) => {
  res.json({ hostname: require('os').hostname(), attempts });
});

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
