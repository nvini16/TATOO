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

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({
      erro: 'O corpo da requisição contém JSON inválido.'
    });
  }

  if (error.code === 'INVALID_FILE_TYPE') {
    return res.status(400).json({
      erro: error.message
    });
  }

  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      erro: 'Cada imagem deve ter no máximo 5 MB.'
    });
  }

  const errosMulter = {
    LIMIT_FILE_COUNT: 'Envie no máximo 5 imagens.',
    LIMIT_PART_COUNT: 'A requisição contém partes demais.',
    LIMIT_FIELD_COUNT: 'A requisição contém campos demais.',
    LIMIT_FIELD_VALUE: 'Um dos campos enviados excede o tamanho permitido.',
    LIMIT_UNEXPECTED_FILE: 'Campo de arquivo inesperado.'
  };

  if (errosMulter[error.code]) {
    return res.status(400).json({
      erro: errosMulter[error.code]
    });
  }

  console.error('Erro na API:', error);

  return res.status(500).json({
    erro: 'Ocorreu um erro interno no servidor.'
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
}

module.exports = app;