const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello SpaceX!');
});

// 0.0.0.0 ලෙස host එක දීමෙන් Docker network එකේ අනිත් containers වලට Connect විය හැක
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
