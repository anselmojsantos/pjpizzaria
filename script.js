const qs = (el) => document.querySelector(el);
const qsAll = (el) => document.querySelectorAll(el);

let modalQt = 1;
let modalkey = 0;
let cart = [];

pizzaJson.map((item, index) => {
    let pizzaItem = qs('.models .pizza-item').cloneNode(true);
    let actualPrice = 2;

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price[actualPrice].toFixed(2)}`;

    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();

        let key = e.target.closest('.pizza-item').getAttribute('data-key')
        modalQt = 1;
        modalkey = key;

        qs('.pizzaBig img').src = pizzaJson[key].img;
        qs('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        qs('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        qs('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price[actualPrice].toFixed(2)}`;
        qs('.pizzaInfo--size.selected').classList.remove('selected');

        qsAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];

            size.addEventListener('click', () => {
                qs('.pizzaInfo--size.selected').classList.remove('selected');
                size.classList.add('selected');
        
                qs('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price[sizeIndex].toFixed(2)}`;
            });
        });

        qs('.pizzaInfo--qt').innerHTML = modalQt;
        qs('.pizzaWindowArea').style.opacity = 0
        qs('.pizzaWindowArea').style.display = 'flex';

        setTimeout(() => {
            qs('.pizzaWindowArea').style.opacity = 1;
        }, 300);
    });
    qs('.pizza-area').append(pizzaItem);
});

// Fechando Modal

function closeModal() {
    qs('.pizzaWindowArea').style.opacity = 0;

    setTimeout(() => {
        qs('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

qsAll('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

//qs('body .pizzaWindowArea').addEventListener('click', closeModal)

qs('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        qs('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

qs('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    qs('.pizzaInfo--qt').innerHTML = modalQt;
});

qs('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(qs('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalkey].id+'@'+size;

    let key = cart.findIndex((item)=>{
        return item.identifier == identifier;
    });

    if(key > -1){
        cart[key].qt += modalQt;
    }else{
        cart.push({
            identifier,
            id:pizzaJson[modalkey].id,
            size,
            qt:modalQt
        });
    }
    updateCart();
    closeModal();
});

qs('.menu-openner').addEventListener('click',()=>{
    if(cart.length > 0){
        qs('aside').style.left = '0';
    }
});

qs('.menu-closer').addEventListener('click', ()=>{
    qs('aside').style.left = '100vw';
})

function updateCart(){
    qs('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0){
        qs('aside').classList.add('show');
        qs('.cart').innerHTML ='';

        let subtotal = 0;
        let desc = 0;
        let total = 0;

        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);

            subtotal+= pizzaItem.price[cart[i].size] * cart[i].qt;

            let cartItem = qs('.models .cart--item').cloneNode(true);
            let pizzaSizeName;

            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P'
                    break;
                case 1:
                    pizzaSizeName = 'M'
                    break
                case 2:
                    pizzaSizeName = 'G'
                break
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                }else{
                    cart.splice(i, 1);
                }

                updateCart();

            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                cart[i].qt++;
                updateCart();

            });
            qs('.cart').append(cartItem);
            
        }

        desc = (subtotal * 0.10);
        total = subtotal - desc;

        qs('.subtotal span:last-child').innerHTML = `RS ${subtotal.toFixed(2)}`
        qs('.desconto span:last-child').innerHTML = `RS ${desc.toFixed(2)}`
        qs('.total span:last-child').innerHTML = `RS ${total.toFixed(2)}`
          

    }else{
        qs('aside').classList.remove('show');
        qs('aside').style.left = '100vw';
    }
}  