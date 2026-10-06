require('dotenv').config();

const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);


app.get('/', (req, res) => {
    res.send('Backend do Marsali Tattoo funcionando!');
});

if (require.main === module) {
  app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
}

module.exports = app;