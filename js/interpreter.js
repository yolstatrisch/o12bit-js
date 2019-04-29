run_btn.addEventListener('click', run);

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

async function run(){
    time = Date.now() / 1000;
    // Clear the output
    output.value = "";
    sidebar.style.display = "";
    toolbar.style.display = "none";

    toggle_status = false;

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
                output.value += out + " at function " + stack[stack.length - 1] + " line " + program_counter[program_counter.length - 1];
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
                        output.value += errors.stdout.out_of_range + " at function " + stack[stack.length - 1] + " line " + program_counter[program_counter.length - 1];
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
