// Funzione confronto versioni
function checkVersions(v1: string, v2: string): boolean {
    // Conversione versioni
    const p1 = v1.split('.').map(Number);
    const p2 = v2.split('.').map(Number);

    // Controllo versioni
    if (p1.length < 3 || p2.length < 3 || p1.some(isNaN) || p2.some(isNaN)) {
        throw new Error('Device version invalid');
    }

    // Confronto versioni
    for (let i = 0; i < 3; i++) {
        if ((p1[i] as number) > (p2[i] as number)) return true;
        if ((p1[i] as number) < (p2[i] as number)) return false;
    }

    // Ritono vero
    return false;
}

// Esportazione funzione
export default checkVersions;
