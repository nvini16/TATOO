function normalizarWhatsapp(telefone) {
    if (typeof telefone !== 'string' || !telefone.trim()) {
        throw new Error('Whatsapp inválido.');
    }

    const entrada = telefone.trim();

    if (!/^\+?[\d\s().-]$/.test(entrada)) {
        throw new Error('Whatsapp contém caracteres inválidos.');
    }

    let numero = entrada.replace(/\D/g,'');

    if (entrada.startsWith('+') && !entrada.startsWith('+55')) {
        throw new Error('Apenas números brasileiros são aceitos.');
    }

    if (
        numero.startsWith('55') && (numero.length === 12 || numero.length === 13) 
    ) {
        numero = numero.slice(2);
    }

    if (!/^[1-9]{2}(?:[2-5]\d{7}|9\d{8})$/.test(numero)) {
        throw new Error('Whatsapp brasileiro inválido.');
    }

    const ddd = Number(numero.slice(0,2));

    const dddsValidos = new Set([
        11, 12, 13, 14, 15, 16, 17, 18, 19,
        21, 22, 24, 27, 28,
        31, 32, 33, 34, 35, 37, 38, 
        41, 42, 43, 44, 45, 46, 47, 48, 49,
        51, 53, 54, 55,
        61, 62, 63, 64, 65, 66, 67, 68, 69,
        71, 73, 74, 75, 77, 79, 
        81, 82, 83, 84, 85, 86, 87, 88, 89, 
        91, 92, 93, 94, 95, 96, 97, 98, 99
    ]);

    if (!dddsValidos.has(ddd)) {
        throw new Error('DDD inválido.');
    }

    return `55${numero}`;
}

module.exports = normalizarWhatsapp;