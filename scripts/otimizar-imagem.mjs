import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const pastaEntrada = 'src/assets/trabalhos';
const pastaSaida = 'src/assets/trabalhos/otimizadas';

await fs.mkdir(pastaSaida, { recursive: true });

const arquivos = await fs.readdir(pastaEntrada);

for (const arquivo of arquivos) {
  const extensao = path.extname(arquivo).toLowerCase();

  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(extensao)) {
    continue;
  }

  const entrada = path.join(pastaEntrada, arquivo);
  const nome = path.parse(arquivo).name;
  const saida = path.join(pastaSaida, `${nome}.webp`);

  await sharp(entrada)
    .resize({
      width: 1200,
      withoutEnlargement: true,
    })
    .webp({
      quality: 85,
    })
    .toFile(saida);

  console.log(`Otimizado: ${arquivo}`);
}