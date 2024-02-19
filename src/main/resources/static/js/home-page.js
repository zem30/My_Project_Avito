let shopItems = "";
// Отправить данные
function send_data(url, data, method) {
    const response = fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: data,
    })
}

async function getShop(url) {
    try {
        const response = await fetch(url);
        return response.json();
    } catch (e) {
        console.error(e);
    }
}

//получить популярные товары
async function popular_items() {
    await fetch("/shop/items")
        .then(res => res.json())
        .then(async items => {
            let logs = ``;
            for (const i of items) {
                const shop = await getShop("/shop_api/shop/" + i.shopId);
                if (i.moderateAccept && shop.moderateAccept) {
                    logs += `<div class="item-div">
                         <a href="/item/${i.id}"><img src="data:image/png;base64,${i.images[0].picture}" class="img-thumbnail"></a>
                         <h6>${i.name}</h6>
                         <h6>${i.price}</h6>
                         <p>${i.description}</p>
                         <p class="star">★ ${Math.round(i.rating, 2)}</p>
                         <button type="button" class="btn btn-primary basket-plus-div" id="${i.id}">В корзину</button>
                         </div>`;
                }
            }
            document.querySelector('.item-container').innerHTML = logs;
        })
}
popular_items();

//получить популярные магазины
async function popular_shops() {
    await fetch("http://localhost:8888/shop_api/shops")
        .then(res => res.json())
        .then(async shops => {
            let logs1 = ``;
            shops.forEach((s) => {
                if (s.moderateAccept) {
                    logs1 += `<div class="shop-div">
                        <a href="/shop/${s.id}"><img src="data:image/png;base64,${s.logo[0].picture}" class="img-thumbnail"></a>
                        <h6>${s.name}</h6>
                        <p>${s.description}</p>
                        <p class="star">★ ${Math.round(s.rating, 2)}</p>
                        <a href="/shop/${s.id}"><button type="button" class="btn btn-primary">Перейти</button></a>
                    </div>`;
                }
            })
            document.querySelector(".shop-container").innerHTML = logs1;
        })
}

popular_shops();

//получить объявления
async function popularAdverts() {
    await fetch('/api/adverts')
        .then(res => res.json())
        .then(async adverts => {
            console.log(adverts)
            let output = ''
            for (let a of adverts) {
                console.log(a)
                // if (a.moderateAccept) {
                    output += `<div class="advert-div float-start border p-2 m-2 text-center">
                        <a href="user/${a.userId}/advert/${a.id}"><img width="200" src="data:image/png;base64,${a.images[0].picture}" class="img-thumbnail"></a>
                        <h6>${a.name}</h6>
                        <p>${a.description}</p>
                        <p>${a.price}</p>
                        <a href="user/${a.userId}/advert/${a.id}"><button type="button" class="btn btn-primary">Перейти</button></a>
                    </div>`;
                // }
            }
            document.querySelector('.advert-container').innerHTML = output;
        })
}
popularAdverts();

//получение предметов по поиску
async function findItems() {
    // получаем значение поиска
    const searchInput = document.getElementById('searchHomePageInput');
    // обрабатываем нажатие кнопки поиска
    $(document.getElementById('searchHomePageButton')).on('click', async function () {
        await fetch("http://localhost:8888/shop/items")
            .then(res => res.json())
            .then(items => {
                document.querySelector('.item-container').innerHTML = search(items, searchInput);
            })
        await fetch("http://localhost:8888/shop_api/shops")
            .then(res => res.json())
            .then(async shops => {
                let output = ``;
                shops.forEach((s) => {
                    s.items.forEach((item) => {
                        shopItems += item.name.toLowerCase() + ",";
                        // console.log(s.items);
                    })
                    if (shopItems.includes(searchInput.value.toLowerCase())) {
                        output += `<div class="shop-div">
                        <a href="/shop/${s.id}"><img src="data:image/png;base64,${s.logo[0].picture}" class="img-thumbnail"></a>
                        <h6>${s.name}</h6>
                        <p>${s.description}</p>
                        <p class="star">★ ${Math.round(s.rating, 2)}</p>
                        <a href="/shop/${s.id}"><button type="button" class="btn btn-primary">Перейти</button></a>
                        </div>`;
                    }
                    shopItems = "";
                })
                document.querySelector(".shop-container").innerHTML = output;
            })
    });
}

findItems();

//получить name cookies
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

//прибавить количество товара
let itemCount;

function basket_plus_click() {
    $(document).on("click", ".basket-plus-div", async function (e) {
        await fetch("http://localhost:8888/shop/item/" + e.target.id)
            .then(res => res.json())
            .then(item => {
                itemCount = item.count;
            })
        if (itemCount === 0 || itemCount === null) {
            alert('Данного товара нет в наличии')
        } else {
            let id = e.target.id;
            let user_tag = document.getElementById("userTag");
            if (user_tag === null) {
                let cookie_value = getCookie(id + "basket")
                if (cookie_value !== undefined) {
                    let value = Number(cookie_value) + 1;
                    document.cookie = id + "basket" + "=" + value + "; path=/";
                } else {
                    document.cookie = id + "basket" + "=" + 1 + "; path=/";
                }
            } else {
                let data = {}
                send_data("http://localhost:8888/api/cart-item/add/item/" + id, data, "POST");
                alert('Добавлено в корзину')
            }
        }
    })
}

basket_plus_click();

//кнопка корзина
function basket_button() {
    let user_tag = document.getElementById("userTag");
    let text = ``;
    if (user_tag === null) {
        text = `<a href="/basket">
                    <button type="button" class="btn btn-outline-warning basket-btn">Корзина</button>
                </a>`
    } else {
        text = `<a href="/user-cart-page">
                    <button type="button" class="btn btn-outline-warning basket-btn">Корзина</button>
                </a>`
    }
    document.querySelector(".div-header-right-one").innerHTML = text;
}

basket_button();

// получение категорий в каталоге
async function catalog() {
    await fetch("allCategories")
        .then(res => res.json())
        .then(category => {
            let temp = ``;
            category.forEach((category) => {
                temp += `<li><a class="dropdown-item" href="javascript:getData(${category.id})">${category.name}</a></li>`;
            })
            document.querySelector('#catalog').innerHTML += temp;
        })
}

catalog()

function getData(id) {
    let itemsId = [];
    fetch(`shop/itemsByCategory/${id}`)
        .then(res => res.json())
        .then(items => {
            let logs = ``;
            items.forEach((i) => {
                itemsId.push(i.id)
                logs += `<div class="item-div">
                         <a href="/item/${i.id}"><img src="data:image/png;base64,${i.images[0].picture}" class="img-thumbnail"></a>
                         <h6>${i.name}</h6>
                         <h6>${i.price}</h6>
                         <p>${i.description}</p>
                         <p class="star">★ ${Math.round(i.rating, 2)}</p>
                         <button type="button" class="btn btn-primary basket-plus-div" id="${i.id}">В корзину</button>
                         </div>`;
            })
            document.querySelector('.item-container').innerHTML = logs;
        })

    let shopsId = [];
    fetch("http://localhost:8888/shop_api/shops")
        .then(res => res.json())
        .then(shops => {
            let output = ``;
            shops.forEach((s) => {
                s.items.forEach((item) => {
                    if (itemsId.includes(item.id)) {
                        if (!shopsId.includes(s.id)) {
                            shopsId.push(s.id);
                            output += `<div class="shop-div">
                           <a href="/shop/${s.id}"><img src="data:image/png;base64,${s.logo[0].picture}" class="img-thumbnail"></a>
                           <h6>${s.name}</h6>
                           <p>${s.description}</p>
                           <p class="star">★ ${Math.round(s.rating, 2)}</p>
                           <a href="/shop/${s.id}"><button type="button" class="btn btn-primary">Перейти</button></a>
                           </div>`;
                        }
                    }
                })
            })
            document.querySelector(".shop-container").innerHTML = output;
        })
}