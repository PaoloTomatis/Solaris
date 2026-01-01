// Funzione conversione query ordinamento
function sortParser(raw: string): { field: string; order: 'asc' | 'desc' }[] {
    return raw
        .split(',')
        .map((val) => val.trim())
        .filter((val) => val.length > 0)
        .map((val) => {
            if (val.startsWith('-')) {
                return {
                    field: val.slice(1),
                    order: 'desc',
                };
            }

            return {
                field: val,
                order: 'asc',
            };
        });
}

// Esportazione funzione
export default sortParser;
