const params = {"🐰": [], "🐱": [2, 3], "🕊": [2],
        "🐸": [2, 2, 3], "🦌": [3], "🦉": [3],
        "🐟": [2, 3], "🦇": [2], "🍎": [2, 3],
        "🐧": [2, 3], "🦋": [2], "🐺": []
}

const param_key = {
    "register" : 2,
    "number" : 1
}

const keys = {
        10: {"0": "🐰", "1": "🐱", "2": "🕊",
        "3": "🐸", "4": "🦌", "5": "🦉",
        "6": "🐟", "7": "🦇", "8": "🍎",
        "9": "🐧", "/": "🦋", "*": "🐺",
        "a": "🦋", "b": "🐺"},
        12: {"🐰": "0", "🐱": "1", "🕊": "2",
        "🐸": "3", "🦌": "4", "🦉": "5",
        "🐟": "6", "🦇": "7", "🍎": "8",
        "🐧": "9", "🦋": "a", "🐺": "b"}
}

function getUnicodeAt(str, ndx){
    return str.charAt(ndx) + str.charAt(ndx + 1);
}

function getUnicodesAt(str, ndx, len){
    var string = "";

    for(var i = 0; i < len; i++){
        string += getUnicodeAt(str, ndx);
        ndx += 2;
    }

    return string;
}

function convert_from_radix(num, radix){
    var value = (radix == 10) ? "" : "0";

    for(var i = 0; i < num.length; i += (radix == 12) ? 2 : 1){
        char = (radix == 10) ? num.charAt(i) : getUnicodeAt(num, i);

        if(char in keys[radix] == false){
            return "NaN";
        }

        value += keys[radix][char];
    }

    return value;
}
