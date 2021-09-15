
/**
 * Вставка категорий
 */
function sendRequestForCategoryes(url, body) {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    let temp = '';
    return fetch(url).then(response => { // дописать актуальный Url
        return response.json().then(data => {
            data.forEach(
                category => {
                    temp += `<li><a class="dropdown-item" href="#">${category}</a></li>`;
                }
            )

            document.querySelector('#categoryItems').innerHTML = temp;
        });

    })
}

/**
 * Вставка магазинов
 */

function sendRequestForShops(url, body) {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    let temp = '';
    return fetch(url).then(response => { // дописать актуальный Url
        return response.json().then(data => {
            data.forEach(
                shops => {
                    temp += `<div className="card" style="width: 15rem;">
        <img src="${shops.logo}"
             className="card-img-top" alt="...">
        <div className="card-body">
            <h5 id="nameShop1" className="card-title">${shops.name}</h5>
            <h6>Описание: <h7>${shops.description}</h7></h6>
            <p className="card-text"></p>
            <a href="#" className="btn btn-primary">Перейти</a>
        </div>
    </div>`
                }
            )

            document.querySelector('#cardsPopularShops').innerHTML = temp;
        });

    })
}


/**
 * Вставка популярных товаров
 */

function sendRequestForItems(url, body) {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    let temp = '';
    return fetch(url).then(response => { // дописать актуальный Url
        return response.json().then(data => {
            data.forEach(
                items => {
                    temp += `<div class="cards_with_popular_products">
            <div class="card" style="width: 15rem;">
                <img src="${items.images}"
                     class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 id="item1" class="card-title">${items.name}</h5>
                    <h6>Цена: ${items.price}</h6>
                    <h7>Описание товара: ${items.description}</h7>
                    <p class="card-text"></p>
                    <a href="#" class="btn btn-primary">В Корзину</a>
                </div>
            </div>
        </div>`
                }
            )

            document.querySelector('#cardPopularItems').innerHTML = temp;
        });

    })
}