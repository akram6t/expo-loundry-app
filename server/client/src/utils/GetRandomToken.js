import { v4 as uuid } from 'uuid';

function GetRandomToken() {
    const a = uuid().replaceAll('-', '');
    const b = uuid().replaceAll('-', '').toUpperCase();
    let mixed = "";

    // Iterate over the characters of the strings
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
        // Add character from string a if available
        if (i < a.length) {
            mixed += a[i];
        }

        // Add character from string b if available
        if (i < b.length) {
            mixed += b[i];
        }
    }

    return mixed;

}

export default GetRandomToken;