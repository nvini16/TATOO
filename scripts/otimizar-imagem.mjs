import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const pastaEntrada = 'src/assets/cuidadosImgBruto';
const pastaSaida = 'src/assets/cuidadoss';

await fs.mkdir(pastaSaida, { recursive: true });

const arquivos = await fs.readdir(pastaEntrada);
const formatosPermitidos = ['.jpg', '.jpeg', '.png', '.webp'];

let quantidade = 0;

for (const arquivo of arquivos) {
  const extensao = path.extname(arquivo).toLowerCase();

  if (!formatosPermitidos.includes(extensao)) {
    continue;
  }

  const entrada = path.join(pastaEntrada, arquivo);
  const nome = path.parse(arquivo).name;
  const saida = path.join(pastaSaida, `${nome}.webp`);

  await sharp(entrada)
    .rotate()
    .resize({
      width: 1200,
      withoutEnlargement: true,
    })
    .webp({
      quality: 85,
    })
    .toFile(saida);

  quantidade++;
  console.log(`Otimizado: ${arquivo} → ${nome}.webp`);
}

console.log(`Concluído: ${quantidade} imagem(ns) otimizada(s) em ${pastaSaida}.`);
