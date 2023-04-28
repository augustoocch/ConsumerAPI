let clients = {
    mesa: '',
    hora: '',
    pedido: []
}

const btnSave = document.querySelector('#guardar-cliente');
btnSave.addEventListener('click',  saveClient);


function saveClient() {
    const table = document.querySelector('#mesa').value;
    const hour = document.querySelector('#hora').value;

    validateBlank(table, hour);
}



function validateBlank(table, hour) {
    if(isBlank(table) || isBlank(hour)) {
        printResponse("Field empy or bad format", "error");
        return;
    } 
}

function printResponse(response, type) {
    if(!document.querySelector('.invalid-feedback')){
        const alert = document.createElement('div');
        alert.classList.add('invalid-feedback','d-block','text-center');
        alert.textContent= response;
        document.querySelector('.modal-body form').appendChild(alert);

        setTimeout(() => {
            alert.remove();
        },3000);
        
        return
    }
}


function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}