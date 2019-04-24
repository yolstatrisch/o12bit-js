run_btn.addEventListener('click', run);

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

async function run(){
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

    while(stack.length > 0){
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
                    if(line.params[0].type == "register"){
                        output.value += String.fromCharCode(registers[line.params[0].char]);
                    }
                    else if(line.params[0].type == "number"){
                        output.value += String.fromCharCode(line.params[0].char);
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
                    if(registers[line.params[1].char]){
                        registers[line.params[0].char] = registers[registers[line.params[1].char]];
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
                return errors.syntax[0];
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
