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
    var program_counter = 0;

    while(stack.length > 0){
        code = text_area.value.split("\n");

        for(var i = 0; i < code.length; i++){
            // Remove all whitespaces in the line
            code[i] = code[i].replace(/\s/g,'');

            inst = getUnicodeAt(code[i], 0);

            switch(inst){
                // cpy
                case "🐱":
                    // Gets the 2nd and 3rd unicode as destination and check if it exists
                    dest = getUnicodesAt(code[i], 2, 2);

                    if(dest){
                        // Converts dest to base 10
                        dest = parseInt(convert_from_radix(dest, 12), 12);

                        // Gets the 4th and 5th unicode and check if it is a number (starts with 🐺🐺) or a register
                        src_test = getUnicodesAt(code[i], 6, 2);

                        if(src_test == "🐺🐺"){
                            // Gets the 6th to 13th unicode (8 chars) as source and check if it exists
                            src = getUnicodesAt(code[i], 10, 8);

                            if(src){
                                // Converts src to base 10
                                src = parseInt(convert_from_radix(src, 12), 12);

                                registers[dest] = src;
                            }
                        }
                        else{
                            if(src_test){
                                // Converts src_test to base 10
                                src_test = parseInt(convert_from_radix(src_test, 12), 12);

                                registers[dest] = registers[src_test];
                            }
                        }
                    }
                    else{
                        // Return false, cpy requires a register as the first parameter
                        return errors.syntax[1];
                    }

                    program_counter++;
                    break;
                // raw
                case "🦌":
                    // Gets the 2nd and 3rd unicode as source and check if it exists
                    src = getUnicodesAt(code[i], 2, 2);

                    if(src){
                        // Converts src to base 10
                        src = parseInt(convert_from_radix(src, 12), 12);

                        output.value += String.fromCharCode(registers[src]);
                    }
                    else{
                        // Return false, out requires a register as the first parameter
                        return errors.syntax[2];
                    }

                    program_counter++;
                    break;
                // out
                case "🦉":
                    // Gets the 2nd and 3rd unicode as source and check if it exists
                    src = getUnicodesAt(code[i], 2, 2);

                    if(src){
                        // Converts src to base 10
                        src = parseInt(convert_from_radix(src, 12), 12);

                        output.value += registers[src];
                    }
                    else{
                        // Return false, out requires a register as the first parameter
                        return errors.syntax[3];
                    }

                    program_counter++;
                    break;
                // add
                case "🍎":
                    // Gets the 2nd and 3rd unicode as destination and check if it exists
                    dest = getUnicodesAt(code[i], 2, 2);

                    if(dest){
                        // Converts dest to base 10
                        dest = parseInt(convert_from_radix(dest, 12), 12);

                        // Gets the 4th and 5th unicode and check if it is a number (starts with 🐺🐺) or a register
                        src_test = getUnicodesAt(code[i], 6, 2);

                        if(src_test == "🐺🐺"){
                            // Gets the 6th to 13th unicode (8 chars) as source and check if it exists
                            src = getUnicodesAt(code[i], 10, 8);

                            if(src){
                                // Converts src to base 10
                                src = parseInt(convert_from_radix(src, 12), 12);

                                registers[dest] += src;
                            }
                        }
                        else{
                            if(src_test){
                                // Converts src_test to base 10
                                src_test = parseInt(convert_from_radix(src_test, 12), 12);

                                registers[dest] += registers[src_test];
                            }
                        }
                    }
                    else{
                        // Return false, out requires a register as the first parameter
                        return errors.syntax[4];
                    }

                    program_counter++;
                    break;
                // sub
                case "🐧":
                    // Gets the 2nd and 3rd unicode as destination and check if it exists
                    dest = getUnicodesAt(code[i], 2, 2);

                    if(dest){
                        // Converts dest to base 10
                        dest = parseInt(convert_from_radix(dest, 12), 12);

                        // Gets the 4th and 5th unicode and check if it is a number (starts with 🐺🐺) or a register
                        src_test = getUnicodesAt(code[i], 6, 2);

                        if(src_test == "🐺🐺"){
                            // Gets the 6th to 13th unicode (8 chars) as source and check if it exists
                            src = getUnicodesAt(code[i], 10, 8);

                            if(src){
                                // Converts src to base 10
                                src = parseInt(convert_from_radix(src, 12), 12);

                                registers[dest] -= src;
                            }
                        }
                        else{
                            if(src_test){
                                // Converts src_test to base 10
                                src_test = parseInt(convert_from_radix(src_test, 12), 12);

                                registers[dest] -= registers[src_test];
                            }
                        }
                    }
                    else{
                        // Return false, out requires a register as the first parameter
                        return errors.syntax[4];
                    }

                    program_counter++;
                    break;
                // rnd
                case "🦋":
                    // Gets the 2nd and 3rd unicode as source and check if it exists
                    src = getUnicodesAt(code[i], 2, 2);

                    if(src){
                        // Converts src to base 10
                        src = parseInt(convert_from_radix(src, 12), 12);

                        registers[src] = Math.floor(Math.random() * 12 + 1);
                    }
                    else{
                        // Return false, rnd requires a register as the first parameter
                        return errors.syntax[3];
                    }

                    program_counter++;
                    break;
            }
        }

        return;
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
}
