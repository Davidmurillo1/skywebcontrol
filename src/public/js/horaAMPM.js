function convertirHoraAMPM(hora24) {
    const [hora, minutos] = hora24.split(':');
    if (hora < 12) {
        return hora === '00' ? `12:${minutos} AM` : `${hora}:${minutos} AM`;
    } else {
        return hora === '12' ? `12:${minutos} PM` : `${hora - 12}:${minutos} PM`;
    }
}

module.exports = {
    convertirHoraAMPM
};