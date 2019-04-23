run_btn.addEventListener('click', run);

function run(){
    // Clear the output
    output.value = "";

    const register_width = 2;
    const register_cnt = Math.pow(12, register_width);

    var registers = init_registers(register_cnt);
    var functions = get_functions();

    var stack = [0];
    var in_loop = 0;
    var program_counter = [0];

    while(stack.length > 0){
        code = functions[stack[stack.length - 1]].split("\n");

        while(code[program_counter[program_counter.length - 1]]){
            line = parse_line(code[program_counter[program_counter.length - 1]]);

            switch(line.inst){
                // cpy
                case "🐱":
                    if(line.params[0]){
                        if(line.params[0].type == "register"){
                            if(line.params[1]){
                                if(line.params[1].type == "register"){
                                    registers[line.params[0].char] = registers[line.params[1].char];
                                }
                                else if(line.params[1].type == "number"){
                                    registers[line.params[0].char] = line.params[1].char;
                                }
                                else{
                                    //error
                                }
                            }
                            else{
                                //error
                            }
                        }
                        else{
                            //error
                        }
                    }
                    else{
                        //error;
                    }

                    program_counter[program_counter.length - 1]++;
                    break;
                // raw
                case "🦌":
                    if(line.params[0]){
                        if(line.params[0].type == "register"){
                            output.value += String.fromCharCode(registers[line.params[0].char]);
                        }
                        else if(line.params[0].type == "number"){
                            output.value += String.fromCharCode(line.params[0].char);
                        }
                    }
                    else{
                        //error;
                    }

                    program_counter[program_counter.length - 1]++;
                    break;
                // out
                case "🦉":
                    if(line.params[0]){
                        if(line.params[0].type == "register"){
                            output.value += registers[line.params[0].char];
                        }
                        else if(line.params[0].type == "number"){
                            output.value += line.params[0].char;
                        }
                    }
                    else{
                        //error;
                    }

                    program_counter[program_counter.length - 1]++;
                    break;
                // add
                case "🍎":
                    if(line.params[0]){
                        if(line.params[0].type == "register"){
                            if(line.params[1]){
                                if(line.params[1].type == "register"){
                                    registers[line.params[0].char] += registers[line.params[1].char];
                                }
                                else if(line.params[1].type == "number"){
                                    registers[line.params[0].char] += line.params[1].char;
                                }
                                else{
                                    //error
                                }
                            }
                            else{
                                //error
                            }
                        }
                        else{
                            //error
                        }
                    }
                    else{
                        //error;
                    }

                    program_counter[program_counter.length - 1]++;
                    break;
                // sub
                case "🐧":
                    if(line.params[0]){
                        if(line.params[0].type == "register"){
                            if(line.params[1]){
                                if(line.params[1].type == "register"){
                                    registers[line.params[0].char] -= registers[line.params[1].char];
                                }
                                else if(line.params[1].type == "number"){
                                    registers[line.params[0].char] -= line.params[1].char;
                                }
                                else{
                                    //error
                                }
                            }
                            else{
                                //error
                            }
                        }
                        else{
                            //error
                        }
                    }
                    else{
                        //error;
                    }

                    program_counter[program_counter.length - 1]++;
                    break;
                // rnd
                case "🦋":
                    if(line.params[0]){
                        if(line.params[0].type == "register"){
                            registers[line.params[0].char] = Math.floor(Math.random() * 12 + 1);
                        }
                        else{
                            //error
                        }
                    }
                    else{
                        //error;
                    }

                    program_counter[program_counter.length - 1]++;
                    break;
                default:
                    program_counter[program_counter.length - 1]++;
            }
        }
        stack.pop();
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
