require('dotenv').config();

const express = require('express');
const apiRoutes = require('./routes/api');
const PORT = 3000;
const app = express();


app.use(express.json());
app.use('/api', apiRoutes);


app.get('/', (req, res) => {
    res.send('Backend do Marsali Tattoo funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});