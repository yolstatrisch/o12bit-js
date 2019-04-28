run_btn.addEventListener('click', run);

async function run(){
    time = Date.now() / 1000;
    // Clear the output
    output.value = "";

    input.disabled = true;
    send.disabled = true;

    const register_width = 2;
    const register_cnt = Math.pow(12, register_width);

    var registers = init_registers(register_cnt);
    var functions = get_functions();

    var stack = [0];
    var in_loop = [];
    var exit_loop = false;
    var program_counter = [0];

    if(typeof functions == "string"){
        output.value += functions;
        return false;
    }

    while(stack.length > 0 && functions[stack[stack.length - 1]]){
        while(functions[stack[stack.length - 1]].split("\n")[program_counter[program_counter.length - 1]]){
            line = parse_line(functions[stack[stack.length - 1]].split("\n")[program_counter[program_counter.length - 1]]);
            out = check_params(line);

            if(out != true){
                output.value += out + " at line " + program_counter[program_counter.length - 1];
                return false;
            }

            if(exit_loop){
                if(line.inst == "🐺"){
                    exit_loop = false;
                }
                program_counter[program_counter.length - 1]++;
                continue;
            }

            switch(line.inst){
                // cpy
                case "🐱":
                    if(line.params[1].type == "register"){
                        registers[line.params[0].char] = registers[line.params[1].char];
                    }
                    else if(line.params[1].type == "number"){
                        registers[line.params[0].char] = line.params[1].char;
                    }

                    program_counter[program_counter.length - 1]++;
                    break;
                // in
                case "🕊":
                    input.value = "";
                    input.disabled = false;
                    send.disabled = false;
                    input.focus();

                    in_value = await getInput();

                    if(isNaN(in_value)){
                        in_value = 0;
                    }

                    registers[line.params[0].char] = in_value;

                    program_counter[program_counter.length - 1]++;
                    break;
                // je
                case "🐸":
                    program_counter[program_counter.length - 1]++;

                    var val = "";
                    if(line.params[2].type == "register"){
                        val = registers[line.params[2].char];
                    }
                    else if(line.params[2].type == "number"){
                        val = line.params[2].char;
                    }

                    if(registers[line.params[1].char] == val){
                        program_counter.push(0);

                        stack.push(line.params[0].char);
                        break;
                    }

                    break;
                // raw
                case "🦌":
                    var val = "";

                    if(line.params[0].type == "register"){
                        val = registers[line.params[0].char];
                    }
                    else if(line.params[0].type == "number"){
                        val = line.params[0].char;
                    }
                    try{
                        output.value += String.fromCodePoint(val);
                    }
                    catch(e){
                        output.value += errors.stdout.out_of_range + " at line " + program_counter[program_counter.length - 1];
                        return false;
                    }

                    program_counter[program_counter.length - 1]++;
                    break;
                // out
                case "🦉":
                    if(line.params[0].type == "register"){
                        output.value += registers[line.params[0].char];
                    }
                    else if(line.params[0].type == "number"){
                        output.value += line.params[0].char;
                    }

                    program_counter[program_counter.length - 1]++;
                    break;
                // dp
                case "🐟":
                    if(registers[line.params[0].char]){
                        registers[registers[line.params[0].char]] = registers[line.params[1].char];
                    }
                    else{
                        //error
                    }

                    program_counter[program_counter.length - 1]++;
                    break;
                // itr
                case "🦇":
                    if(registers[line.params[0].char] != 0){
                        in_loop.push(program_counter[program_counter.length - 1]);
                    }
                    else{
                        exit_loop = true;
                    }

                    program_counter[program_counter.length - 1]++;
                    break;
                // add
                case "🍎":
                    if(line.params[1].type == "register"){
                        registers[line.params[0].char] += registers[line.params[1].char];
                    }
                    else if(line.params[1].type == "number"){
                        registers[line.params[0].char] += line.params[1].char;
                    }

                    program_counter[program_counter.length - 1]++;
                    break;
                // sub
                case "🐧":
                    if(line.params[1].type == "register"){
                        registers[line.params[0].char] -= registers[line.params[1].char];
                    }
                    else if(line.params[1].type == "number"){
                        registers[line.params[0].char] -= line.params[1].char;
                    }

                    program_counter[program_counter.length - 1]++;
                    break;
                // rnd
                case "🦋":
                    registers[line.params[0].char] = Math.floor(Math.random() * 12 + 1);

                    program_counter[program_counter.length - 1]++;
                    break;
                case "🐺":
                    if(in_loop.length > 0){
                        program_counter[program_counter.length - 1] = in_loop.pop();
                    }
                    else{
                        //error
                    }
                    break;
                default:
                    program_counter[program_counter.length - 1]++;
            }
        }
        stack.pop();
        program_counter.pop();
    }

    output.value += ((output.value == "") ? "" : "\n") + "---\nProgram finished executing in " + ((Date.now() / 1000) - time).toFixed(2) + " second(s)";
}

/*
 * init_registers()
 *
 * Returns a list of registers(variables) initialized to 0
 */
function init_registers(register_cnt){
    var registers = [];

    for(var i = 0; i < register_cnt; i++){
        registers[i] = 0;
    }

    return registers;
}

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
