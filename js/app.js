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

    showSections();
    getDishes();
}

//Making visible hided divs
function showSections() {
    const hidedSections = document.querySelectorAll('.d-none');
    hidedSections.forEach(section => {
        section.classList.remove('d-none');
    });
}

//Getting our API defined in json
function getDishes() {
    const url = 'http://localhost:4000/dishes';

    fetch(url)
        .then(response => response.json())
        .then(r => console.log(r))
        .catch(error => console.log(error))
}

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}