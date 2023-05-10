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
        addInput.classList.add('col-md-2');

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
    let{ petition } = clients;
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
            //This else, erases the elements that aren't set in the array
        } else{ 
            clients.petition = [...petition, prod];
        }
    
    } else{ 
        const result = petition.filter(element => element.id !== element.id);  
        clients.petition = [...result];
    }
    cleanHtml();   
    
    //If the order is empty, then restarts and cleans the DOM
    if( clients.petition.length ) {
        updateBrief();
    } else {
        emptyOrder()
    }

}

//Adds the brief of the client order with the info of the customer
function updateBrief() {

    const content= document.querySelector('#brief .content');

    const brief = document.createElement('div');
    brief.classList.add('col-md-6', 'card', 'py-3', 'px-3', 'shadow');

    //Adds the table data
    const table = document.createElement('p');
    table.textContent = 'Table: ';
    table.classList.add('fw-bold');

    const tableSpan = document.createElement('span');
    tableSpan.textContent = clients.table;
    tableSpan.classList.add('fw-normal');

    //Adds the hour data
    const hour = document.createElement('p');
    hour.textContent = 'Hour: ';
    hour.classList.add('fw-bold');

    const hourSpan = document.createElement('span');
    hourSpan.textContent = clients.hour;
    hourSpan.classList.add('fw-normal');

    //Title of the section
    const title = document.createElement('h3');
    title.textContent = "Client's order";
    title.classList.add('my-4', 'text-center');

    //Appends the client order after it returns the result
    const orderGroup = updateOrderBrief();

    brief.appendChild(title);
    table.appendChild(tableSpan);
    hour.appendChild(hourSpan);
    brief.appendChild(table);
    brief.appendChild(hour);
    brief.appendChild(orderGroup);

    content.appendChild(brief);

    //Creates the tip form in the order
    tipForm();
}

//This function returns the brief of the client order in a list
function updateOrderBrief() {
    
    const group = document.createElement('ul');
    group.classList.add('list-group');

    let { petition } = clients;

    //Creates the element 
    petition.forEach(element => {
        const { name, qty, price, id} = element;
        const list = document.createElement('li');
        list.classList.add('list-group-item');

        const nameArt = document.createElement('h4');
        nameArt.classList.add('list-group-item');
        nameArt.textContent = name;

        const qtyArt = document.createElement('p');
        qtyArt.classList.add('fw-bold');
        qtyArt.textContent = 'Quantity: ';

        const qtyVal = document.createElement('span');
        qtyVal.classList.add('fw-normal');
        qtyVal.textContent = qty;

        const artPrice = document.createElement('p');
        artPrice.classList.add('fw-bold');
        artPrice.textContent = 'Price: ';

        const artValue = document.createElement('span');
        artValue.classList.add('fw-normal');
        artValue.textContent = `$${price}`;

        const subTot = document.createElement('p');
        subTot.classList.add('fw-bold');
        subTot.textContent = 'Sub total: ';

        const subTotVal = document.createElement('span');
        subTotVal.classList.add('fw-normal');
        subTotVal.textContent = `$${price * qty}`;

        const buttnDel = document.createElement('button');
        buttnDel.classList.add('btn', 'btn-danger');
        buttnDel.textContent = 'Delete';

        buttnDel.onclick = function() {
            deleteProduct(id);
        } 

        qtyArt.appendChild(qtyVal);
        artPrice.appendChild(artValue);
        subTot.appendChild(subTotVal)

        //Add values to the container
        list.appendChild(nameArt);
        list.appendChild(qtyArt);
        list.appendChild(artPrice);
        list.appendChild(subTot);
        list.appendChild(buttnDel);        

        //Add list to main group
        group.appendChild(list);
    })

    return group;

}

//Deletes the product of the order in the DOM
function deleteProduct(id) {
    console.log(id);
    let{ petition } = clients;
    const result = petition.filter(element => element.id !== id);  
    clients.petition = [...result];

    cleanHtml();   
    
    //If the order is empty, then restarts and cleans the DOM
    if( clients.petition.length ) {
        updateBrief();
    } else {
        emptyOrder()
    }
    
    //Put form item in value = 0, after deletion
    const productToZero = `#product-${id}`;
    const inputDeletedProd = document.querySelector(productToZero);
    inputDeletedProd.value = 0;
}

//Resets the DOM, when no order is set
function emptyOrder() {
    const content = document.querySelector('#brief .content');

    const text = document.createElement('p');
    text.classList.add('text-center');
    text.textContent = "Add the client's order";

    content.appendChild(text);

}

function tipForm() {

    const content = document.querySelector('#brief .content');

    const form = document.createElement('div');
    form.classList.add('col-md-6', 'form');

    const divForm = document.createElement('div');
    divForm.classList.add('card', 'shadow', 'py-2', 'px-3');

    const heading = document.createElement('h3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Tip';

    const radioBtn = document.createElement('input');
    radioBtn.type = 'radio';
    radioBtn.name = 'tip';
    radioBtn.value = "10";
    radioBtn.classList.add('form-check-input');
    
    const radioLabel = document.createElement('label');
    radioLabel.textContent = '10%';
    radioLabel.classList.add('form-check-label');

    const radioDiv = document.createElement('div');
    radioDiv.classList.add('form-check');
    radioDiv.appendChild(radioBtn);
    radioDiv.appendChild(radioLabel);

    const radioBtn2 = document.createElement('input');
    radioBtn2.type = 'radio';
    radioBtn2.name = 'tip';
    radioBtn2.value = "20";
    radioBtn2.classList.add('form-check-input');
    
    const radioLabel2 = document.createElement('label');
    radioLabel2.textContent = '20%';
    radioLabel2.classList.add('form-check-label');

    const radioDiv2 = document.createElement('div');
    radioDiv2.classList.add('form-check');
    radioDiv2.appendChild(radioBtn2);
    radioDiv2.appendChild(radioLabel2);

    radioBtn.onclick = function() {
        calculateTip();
    }

    radioBtn2.onclick = function() {
        calculateTip();
    }

    divForm.appendChild(heading);
    divForm.appendChild(radioDiv);
    divForm.appendChild(radioDiv2);
    form.appendChild(divForm);
    content.appendChild(form);
}

//Clean the petition of the customer each time I update the request
function cleanHtml() {

    const content = document.querySelector('#brief .content');
    
    while(content.firstChild) {
        content.removeChild(content.firstChild);
    }

}

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}