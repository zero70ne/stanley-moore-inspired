const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/products', (req, res) => {
  res.json([
    { id: 1, name: "Stanley Moore T-Shirt", price: 29.99 },
    { id: 2, name: "SM Hoodie", price: 59.99 }
  ]);
});

app.listen(PORT, () => {
  console.log(`Stanley Moore backend running on port ${PORT}`);
});