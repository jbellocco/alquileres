// ===== UTILIDADES DE NORMALIZACIÓN Y FINGERPRINT =====
// El fingerprint identifica un inmueble de forma única:
// provincia:partido:barrio:calleNorm:alturaExacta:piso:depto
// La inmobiliaria NO forma parte del fingerprint (es informativa, puede cambiar)

export function normalizarTexto(str) {
    return (str || '')
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quitar acentos
        .replace(/\s+/g, ' ')
        .trim();
}

export function parsearDireccion(direccionRaw) {
    if (!direccionRaw) return { calle: '', numero: '' };
    // Separa calle y número: "Av. Corrientes 6158" → { calle: "Av. Corrientes", numero: "6158" }
    const match = direccionRaw.trim().match(/^(.*?)\s+(\d+)\s*$/);
    if (!match) return { calle: direccionRaw.trim(), numero: '' };
    return { calle: match[1], numero: match[2] };
}

export function normalizarCalle(calle) {
    return normalizarTexto(calle)
        // Expandir/eliminar prefijos comunes
        .replace(/^(av\.?|avda\.?|avenida)\s+/i, '')
        .replace(/^(gral\.?|general)\s+/i, '')
        .replace(/^(dr\.?|doctor)\s+/i, '')
        .replace(/^(ing\.?|ingeniero)\s+/i, '')
        .replace(/^(cnel\.?|coronel)\s+/i, '')
        .replace(/^(tte\.?|teniente)\s+/i, '')
        // Quitar caracteres no alfanuméricos
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

export function calcularAlturaPublica(numero) {
    const n = parseInt(numero);
    if (isNaN(n)) return numero || '';
    return String(Math.floor(n / 100) * 100);
}

export function generarFingerprint({ provincia, partido, barrio, calleNorm, alturaExacta, tipoVivienda, piso, depto }) {
    // fingerprint = provincia:partido:barrio:calleNorm:alturaExacta:piso:depto
    // piso y depto solo se incluyen si tipoVivienda === 'edificio'
    const esEdificio = tipoVivienda === 'edificio';
    const parts = [
        normalizarTexto(provincia),
        normalizarTexto(partido),   // vacío para CABA → queda como ''
        normalizarTexto(barrio),
        calleNorm,
        (alturaExacta || '').trim(),
        esEdificio ? normalizarTexto(piso || '') : '',
        esEdificio ? normalizarTexto(depto || '') : '',
    ];
    return parts.join(':');
}

export function construirDisplayAddress({ calleDisplay, alturaPublica, barrio, partido, provincia }) {
    // "Av. Corrientes 6100 — Palermo, CABA"
    // calleDisplay ya viene en Title Case con prefijos (ej: "Av. Corrientes")
    const dir = [calleDisplay, alturaPublica].filter(Boolean).join(' ');
    const loc = [barrio, partido, provincia].filter(Boolean).join(', ');
    return [dir, loc].filter(Boolean).join(' — ');
}

export function actualizarStatsConNuevaResena(property, puntaje, recomendaria) {
    const oldTotal = property.totalResenas || 0;
    const newTotal = oldTotal + 1;
    const newAvg   = Math.round((((property.puntajePromedio || 0) * oldTotal) + puntaje) / newTotal * 10) / 10;
    const newRecomiendan   = (property.totalRecomiendan   || 0) + (recomendaria === 'si' ? 1 : 0);
    const newNoRecomiendan = (property.totalNoRecomiendan || 0) + (recomendaria === 'no' ? 1 : 0);
    return {
        totalResenas:       newTotal,
        puntajePromedio:    newAvg,
        totalRecomiendan:   newRecomiendan,
        totalNoRecomiendan: newNoRecomiendan,
    };
}

export function actualizarStatsAlBorrar(property, puntaje, recomendaria) {
    const oldTotal = property.totalResenas || 0;
    const newTotal = Math.max(0, oldTotal - 1);
    const newAvg   = newTotal === 0
        ? 0
        : Math.round((((property.puntajePromedio || 0) * oldTotal) - puntaje) / newTotal * 10) / 10;
    const newRecomiendan   = Math.max(0, (property.totalRecomiendan   || 0) - (recomendaria === 'si' ? 1 : 0));
    const newNoRecomiendan = Math.max(0, (property.totalNoRecomiendan || 0) - (recomendaria === 'no' ? 1 : 0));
    return {
        totalResenas:       newTotal,
        puntajePromedio:    newAvg,
        totalRecomiendan:   newRecomiendan,
        totalNoRecomiendan: newNoRecomiendan,
    };
}
