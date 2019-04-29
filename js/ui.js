const text_area = document.getElementById('code');
const output = document.getElementById('console');

const sidebar = document.getElementById('sidebar');
const toolbar = document.getElementById('toolbar');

const run_btn = document.getElementById('run');
const toggle_btn = document.getElementById('toggle');

const base_10_text = document.getElementById('base_10');
const base_12_text = document.getElementById('base_12');

const input = document.getElementById('input');
const send = document.getElementById('send');

var toggle_status = false;

toggle_btn.addEventListener('click', toggle);

text_area.addEventListener('keydown', replace);
input.addEventListener('keydown', replace);
base_12_text.addEventListener('keydown', replace);

base_10_text.addEventListener('input', update_base_10_to_12);

function toggle(){
    if(toggle_status){
        sidebar.style.display = "";
        toolbar.style.display = "none";
    }
    else{
        toolbar.style.display = "";
        sidebar.style.display = "none";
    }

    toggle_status = !toggle_status;
}

function getInput(){
    return new Promise((resolve, reject) => {
        send.onclick = function(){
            input.disabled = true;
            send.disabled = true;
            resolve(parseInt(convert_from_radix(input.value, 12), 12));
        };
    });
};

function replace(event){
    var key = event.key;

    if(key in keys[10] && (event.altKey || event.ctrlKey || event.shiftKey) == false){
        var pos = event.target.selectionStart;
        event.target.value = event.target.value.substr(0, pos) + keys[10][key] + event.target.value.substr(event.target.selectionEnd);
        event.target.selectionStart = pos + keys[10][key].length;
        event.target.selectionEnd = event.target.selectionStart;

        if(event.target.id == "base_12"){
            base_10_text.value = parseInt(convert_from_radix(event.target.value, 12), 12);
        }

        event.preventDefault();
    }
    else if(key == "Backspace" && event.target.id == "base_12"){
        var pos = event.target.selectionStart;
        event.target.value = event.target.value.substr(0, pos - 2) + event.target.value.substr(event.target.selectionEnd);
        event.target.selectionStart = pos;
        event.target.selectionEnd = event.target.selectionStart;

        base_10_text.value = parseInt(convert_from_radix(event.target.value, 12), 12);
    }
    else if(key == "Enter" && event.target.id == "input"){
        send.onclick();
    }
}

function update_base_10_to_12(event){
    base_12_text.value = convert_from_radix(Number(event.target.value).toString(12), 10);
}
