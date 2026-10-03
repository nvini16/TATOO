require('dotenv').config();
const fs = require('fs');
const supabase = require('./lib/supabase');

async function testarUpload() {
   const arquivo = new Uint8Array(
    fs.readFileSync('./images.jpg')
);

    const { data, error } = await supabase.storage
        .from('agendamento-imagens')
        .upload('teste/images.jpg', arquivo, {
            contentType: 'image/jpeg',
            upsert: false,
        });

    if (error) {
        console.error('Erro no upload:', error);
        return;
    }

    console.log('Upload realizado com sucesso!');
    console.log(data);
}

testarUpload();