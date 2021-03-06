/*
 * get_functions()
 *
 * Returns a list of string where each element of the list is its own function
 * Index 0 is the main function
 */
function get_functions(){
    var functions = [];
    var read = -1;
    var in_loop = 0;
    code = text_area.value.split("\n");

    // Iterate though the whole code line by line
    for(var i = 0; i < code.length; i++){
        // Remove all whitespaces in the line
        code[i] = code[i].replace(/\s/g,'');

        inst = getUnicodeAt(code[i], 0);

        if(inst == "🐰"){
            // Gets the 2nd and 3rd unicode as function name and check if it exists
            function_name_12 = getUnicodesAt(code[i], 2, 2);

            if(function_name_12){
                // Converts the function name to base 10 and overwrites the function if it already exist
                function_name_10 = parseInt(convert_from_radix(function_name_12, 12), 12);
            }
            else{
                function_name_10 = 0;
            }

            read = function_name_10;
            functions[read] = "";
        }
        else if(inst == "🐺"){
            if(in_loop > 0){
                // End of loop. Still need to append the line containing the end instruction
                functions[read] += code[i] + "\n";
                in_loop--;
            }
            else if(read != -1){
                // Ends the function
                read = -1;
            }
            else{
                // Return false, unexpected end of function
                return errors.unknown.unexpected_eof;
            }
        }
        else{
            // Appends the line to the function
            // Also keep track on the number of nested loops
            if(read != -1){
                functions[read] += code[i] + "\n";

                if(inst == "🦇"){
                    in_loop++;
                }
            }
        }
    }

    return functions;
}

/*
 * parse_line()
 *
 * Parses the line and returns a dictionary of the form
 * dict = {
 *      inst: "",                   // Unicode character of the instruction
 *      params: [{                  // List of parameters
 *          char: "",               // Base 12 representation of the parameter
 *          type: ""                // Parameter type {"register", "number"}
 *      }, ...]
 * }
 */
function parse_line(code){
    var line = {};

    line.inst = getUnicodeAt(code, 0);
    line.params = [];

    for (var i = 2; i < code.length; i += 4) {
        var param = {}

        param.char = getUnicodesAt(code, i, 2);
        param.type = "register";

        if(param.char == "🐺🐺"){
            param.char = getUnicodesAt(code, i + 4, 8);
            param.type = "number";

            i += 16;
        }

        param.char = parseInt(convert_from_radix(param.char, 12), 12);

        line.params.push(param);
    }

    return line;
}

/*
 * check_params()
 *
 * Returns a string of the error found in the line, returns true if no error is found
 */
function check_params(line){
    if(params[line.inst]){
        for(var i = 0; i < params[line.inst].length; i++){
            if(line.params[i]){
                if(params[line.inst][i] & param_key[line.params[i].type]){
                    continue;
                }
                else{
                    return errors.params.incorrect_type + i;
                }
            }
            else{
                return errors.params.required_param + "for instruction " + line.inst;
            }
        }

        if(line.params.length == params[line.inst].length){
            return true;
        }
        else{
            return errors.params.unexpected_param + "for instruction " + line.inst;
        }
    }
    else{
        return errors.unknown.inst + " " + line.inst;
    }
}
