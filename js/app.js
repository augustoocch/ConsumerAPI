let clients = {
    table: '',
    hour: '',
    petition: []
}

const btnSave = document.querySelector('#guardar-cliente');
btnSave.addEventListener('click',  saveClient);


function saveClient() {
    const table = document.querySelector('#table').value;
    const hour = document.querySelector('#hour').value;

    validateBlank(table, hour);
}



function validateBlank(table, hour) {
    if(isBlank(table) || isBlank(hour)) {
        printResponse("Field empy or bad format", "error");
        return;
    } else {
        addClient(table, hour);
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

function addClient(table, hour) {
    clients = {...clients, table, hour};

    //Close modal with bootstrap class
    const modalForm = document.querySelector('#formulario');
    const modalBoots = bootstrap.Modal.getInstance(modalForm);
    modalBoots.hide();

}


function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}