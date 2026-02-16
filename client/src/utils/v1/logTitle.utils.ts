// Funzione titolo da tipo log
function logTitle(type?: string): string {
    // Controllo tipo
    return type == 'log_error'
        ? 'Errore!'
        : type == 'log_warning'
        ? 'Avviso!'
        : type == 'log_irrigation_auto'
        ? 'Irrigazione Automatica'
        : type == 'log_irrigation_config'
        ? 'Irrigazione Manuale'
        : 'Informazione';
}

// Esportazione funzione
export default logTitle;
