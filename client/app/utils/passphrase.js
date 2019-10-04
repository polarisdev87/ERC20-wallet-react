import passphrase from './passphrase.json';

export function generateRandom() {
    var buf = []
    buf.push(Math.floor(Math.random() * 26))

    buf.push(Math.floor(Math.random() * 26))

    buf.push(Math.floor(Math.random() * 26))

    return buf;
}

export function checkPassphrase(phrases, phrases_array){
    var buf = phrases.split(" ");
    var buf_index = phrases_array.split(" ");
    var index = 0;
    for(; index<3; index++){
        if(buf[index] != passphrase[buf_index[index]]){
            return false;
        }
    }
    return true;
}

export function getPassphrase(phrases) {
    var buf = '';
    var phrases_array = phrases.split(" ")
    var index = 0
    for(; index<2; index++){
        buf+= passphrase[phrases_array[index]] + ' '
    }
    buf += passphrase[phrases_array[2]]

    return buf;
}
