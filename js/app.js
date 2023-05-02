let clients = {
    table: '',
    hour: '',
    petition: []
}

const categorieEnv = {
    1: "Main dish",
    2: "Drinks",
    3: "Desserts"
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
        .then(dishes => showDishes(dishes))
        .catch(error => console.log(error))
}

function showDishes(dishes) {
    const content = document.querySelector('#dishes .content');

    dishes.forEach(element => {
        const row = document.createElement('div');
        row.classList.add('row', 'py-3', 'border-top');

        const name = document.createElement('div');
        name.classList.add('col-md-4');
        name.textContent = element.name;

        const price = document.createElement('div');
        price.classList.add('col-md-3', 'fw-bold');
        price.textContent = `$${element.price}`;

        const categorie = document.createElement('div');
        categorie.classList.add('col-md-3');
        categorie.textContent = categorieEnv[ element.categorie ]

        const inputQty = document.createElement('input');
        inputQty.type = 'number';
        inputQty.min = 0;
        inputQty.value = 0;
        inputQty.id = `product-${element.id}`;
        inputQty.classList.add('form-control');

        inputQty.onchange = function (){
            const qty = parseInt(inputQty.value);
            addMeal({...element, qty});
        }    

        const addInput = document.createElement('div');
        addInput.classList.add('col-md-2')

        addInput.appendChild(inputQty);
        row.appendChild(name);
        row.appendChild(price);        
        row.appendChild(categorie);    
        row.appendChild(addInput);    
        content.appendChild(row);

    })
    
}

function addMeal(prod) {
    //Check if qty > 0 to add the meal to the petition array
    let{ petition } = clients
    if(prod.qty > 0) {
        if(petition.some(article => article.id === prod.id)) {
            //element already exist in array, update array
            const updatedPetition = petition.map( article => {
                if (article.id == prod.id) {
                    article.qty = prod.qty;
                }  
                return article;
            })
            clients.petition = [...updatedPetition];
        } else{ 
            //element not existent in array            
            clients.petition = [...petition, prod];

        }
        
    } else {

    }

}



function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}