const cart_wrap = document.querySelector('.cart_wrap');

function deleteProduct(id) {
    fetch('https://fakestoreapi.com/products/' + id, {
        method: "DELETE"
    })
    .then(res => console.log(res));
}

function addCart(event) {
    const id = event.target.parentElement.getAttribute('data-id');
    const cart_ids_text = localStorage.getItem('cart_ids') || '[]';
    const cart_ids = JSON.parse(cart_ids_text);
    cart_ids.push(id);
    localStorage.setItem('cart_ids', JSON.stringify(cart_ids));
}

fetch('https://fakestoreapi.com/products').then((response) => {
    return response.json();
}).then((data) => {
    console.log(data);
    for (let i = 0; i < data.length; i++) {
        document.querySelector('.all_products').innerHTML += `
    <div class="all_products_item" data-id="${data[i].id}">
        <img src="${data[i].image}">
        <h2>Name:${data[i].title}</h2>
        <h2>Price:${data[i].price}</h2>
        <button class="addCart" onclick="addCart(event)">Добавить в корзину</button>
        <button class="deleteBtn" style="border-color:red;color:red;margin-top:10px">Удалить</button>
    </div>
    `;
    }
    const deleteBtns = document.querySelectorAll('.deleteBtn');

    for (let i = 0; i < deleteBtns.length; i++) {
        const id = deleteBtns[i].parentElement.getAttribute('data-id');

        deleteBtns[i].addEventListener('click', () => {
            deleteBtns[i].parentElement.remove();
            deleteProduct(id);
        });
    }

});

function sort(target) {
    fetch(`https://fakestoreapi.com/products?sort=${target.value}`)
        .then(res => res.json())
        .then(data => {
            document.querySelector('.all_products').innerHTML = '';
            for (let i = 0; i < data.length; i++) {
                document.querySelector('.all_products').innerHTML += `
            <div class="all_products_item" data-id="${data[i].id}">
                <img src="${data[i].image}">
                <h2>Name:${data[i].title}</h2>
                <h2>Price:${data[i].price}</h2>
                <button class="addCart">Добавить в корзину</button>
                <button class="deleteBtn" style="border-color:red;color:red;margin-top:10px">Удалить</button>
            </div>
            `;
            }

            document.querySelectorAll('.addCart').forEach(btn => {
                btn.addEventListener('click', addCart);
            });

            document.querySelectorAll('.deleteBtn').forEach(btn => {
                btn.addEventListener('click', (event) => {
                    const id = btn.parentElement.getAttribute('data-id');
                    btn.parentElement.remove();
                    deleteProduct(id);
                });
            });
        });
}

document.querySelector('select').addEventListener('change', (event) => {
    sort(event.target);
});

function openCart() {
    const cart_products_container = document.querySelector('.cart_products');

    cart_wrap.style.display = 'block';
    const cart_ids = JSON.parse(localStorage.getItem("cart_ids") || '[]');
    const products = [];
    const promises = [];
    cart_products_container.innerHTML+='<div class="loader" id="loader"></div>'

    cart_ids.forEach((id) => {
        console.log(id);
        const prom = fetch('https://fakestoreapi.com/products/' + id).then(async (response) => {
            const data = await response.json();
            console.log(data);
            products.push(data);
        });
        promises.push(prom);
    });
    console.log(promises);

    Promise.all(promises).then(() => {
        cart_products_container.innerHTML = '';     

        products.forEach((data) => {
            cart_products_container.innerHTML += `


            <div class="cart_item" data-id="${data.id}">
            <img src="${data.image}">
            <div>
                <h2>Name:${data.title}</h2>
                <h2>Price:${data.price}</h2>
                <button class="addCart">Добавить в корзину</button>
                <button class="deleteBtn" style="border-color:red;color:red;margin-top:10px">Удалить</button>
            </div>
        </div>
         `;


        
    });

    document.querySelectorAll('.cart_item .deleteBtn').forEach(btn => {
        btn.addEventListener('click', removeFromCart);
    });
}).finally(()=>{
    document.querySelector('#loader').style.display = 'none'
})
}

document.getElementById('cart').addEventListener('click', openCart);

document.querySelector('#close').addEventListener('click', () => {
cart_wrap.style.display = 'none';
});

function removeFromCart(event) {
const id = event.target.closest('.cart_item').getAttribute('data-id');
const cart_ids_text = localStorage.getItem('cart_ids');
const cart_ids = JSON.parse(cart_ids_text);

const index = cart_ids.indexOf(id);
if (index > -1) {
    cart_ids.splice(index, 1);
}

localStorage.setItem('cart_ids', JSON.stringify(cart_ids));

event.target.closest('.cart_item').remove();
}
function showLoader() {
loader.style.display = 'block';
}

function hideLoader() {
loader.style.display = 'none';
}
