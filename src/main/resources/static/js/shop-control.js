const pathname = document.location.pathname; // shop/control/?
const key = 11;
let shopDto;
//----------------------------------------------------------------------------------------------------------------------
function getNormalDate(date){
    return date.getDate() + "." + (date.getMonth()+1) + "." + date.getFullYear();
}
//----------------------------------------------------------------------------------------------------------------------
async function userShops() {
    await fetch("http://localhost:8888/shop_api/shop/" + pathname.substring("/shop/control/".length, pathname.length))
        .then(res => res.json())
        .then(shop => {
            shopDto = shop;
            // shop logo -----------------------------------------------------------------------------------------------
            let logo;
            logo = `<div class="shop-div">
                        <img src="data:image/png;base64,${shop.logo[0].picture}" class="img-thumbnail">
                        <ul>
                            <h3><li>Название: ${shop.name}</li></h3>
                            <h3><li>Местонахождение: ${shop.location.name}</li></h3>
                            <h3><li>Рейтинг: ★ ${Math.round(shop.rating, 2)}</li></h3>
                            <h3><li>mail: ${shop.email}</li></h3>
                            <h3><li>Phone: ${shop.phone}</li></h3>
                        </ul>
                    </div>`;
            // shop items ----------------------------------------------------------------------------------------------
            let anotherItems = ``;
            let activeItem = ``;
            shop.items.forEach((i) => {
                if (activeItem === ``) {
                    activeItem +=  `<div class="carousel-item active">
                                        <img src="data:image/png;base64,${i.images[0].picture}" class="img-thumbnail">
                                        <div class="carousel-caption d-none d-md-block">
                                         <h6 style="color: black">${i.name}</h6>
                                         <input type="button" class="btn btn-info edit-btn" id="${i.id}" data-toggle="modal" data-target="#updateModal" value="Редактировать">
                                         <input type="button" class="btn btn-danger del-btn"  id="${i.id}" value="Удалить">
                                        </div>
                                      </div>`
                } else {
                    anotherItems += `<div class="carousel-item">
                                        <img src="data:image/png;base64,${i.images[0].picture}" class="img-thumbnail">
                                        <div class="carousel-caption d-none d-md-block">
                                            <h6 style="color: black">${i.name}</h6>
                                            <input type="button" class="btn btn-info edit-btn" id="${i.id}" data-toggle="modal" data-target="#updateModal" value="Редактировать">
                                            <input type="button" class="btn btn-danger del-btn"  id="${i.id}" value="Удалить">
                                        </div>
                                      </div>`
                }
            })
            // shop orders ---------------------------------------------------------------------------------------------
            let myClients = ``;
            let order_items = ``;
            shop.orders.forEach((order) => {
                console.log(order)
                order.items.forEach((item) => {
                    order_items += `<img src="data:image/png;base64,${item.images[0].picture}" style="height: 100px; width: 100px">
                                   <h6 style="color: black">${item.name}</h6>`
                })
                myClients += `<tr>
                                <th>${order.buyerName}</th>
                                <th>${order.buyerPhone}</th>
                                <th>${order_items}</th>
                                <th>${order.total}</th>
                                <th>${order.status}</th>
                                `;
                order_items = ``;
            })
            // end -----------------------------------------------------------------------------------------------------
            document.querySelector(".carousel-inner").innerHTML = activeItem + anotherItems;
            document.querySelector(".shop-info").innerHTML = logo;
            document.querySelector(".buyerTable").innerHTML = myClients;
        })
    // for modal coupons -----------------------------------------------------------------------------------------------
    let shopActiveCoupons = ``;
    await fetch("http://localhost:8888/api/coupon/" + shopDto.name)
        .then(res => res.json())
        .then((couponList) => {
            let now = new Date();
            couponList.forEach((coupon) => {
                let date = new Date(coupon.end);
                if (now.getFullYear() >= date.getFullYear()) {
                    if(now.getMonth() >= date.getMonth()) {
                        if(now.getDay() > date.getDay()) {
                            updateToOverdue(coupon)
                        }
                    }
                }
                shopActiveCoupons += `<tr>
                                        <th>${coupon.id * key}</th>
                                        <th>${getNormalDate(date)}</th>
                                        <th>${coupon.status}</th>
                                        <th>${coupon.sum}</th>
                                        <th>`
                if (coupon.status === "ACTUAL") {
                    shopActiveCoupons += `<input type="button" class="btn btn-info use-coupon-btn" id="${coupon.id}" data-toggle="modal" data-target="#useCouponModal" value="Отправить купон">`
                } else {
                    shopActiveCoupons += `<input type="button" class="btn btn-secondary" id="${coupon.id}" disabled value="Отправить купон">`
                }
                shopActiveCoupons += `
                                        </th>
                                      </tr>`;
            })
            document.querySelector(".coupon-table-in-shop-panel").innerHTML = shopActiveCoupons;
        })
}
userShops();
//----------------------------------------------------------------------------------------------------------------------
$(document).on('click', '.del-btn', function ()  {
    fetch('/shop/item/' + $(this).attr('id'), {method: 'DELETE',})
        .then((res) => {
            console.log(res);
            alert("Товар на рассмотрении")
        })
});
//----------------------------------------------------------------------------------------------------------------------
let arrForEditImages = []
$(document).on('click', '.edit-btn', function () {
    fetch("/shop/item/" + $(this).attr('id'), {method: "GET", dataType: 'json',})
        .then((res) => {
            res.json().then((item) => {
                console.log(item);
                $('#editId').val(item.id);
                $('#editName').val(item.name);
                $('#editCount').val(item.count);
                $('#editPrice').val(item.price);
                $('#editDescription').val(item.description);
                $('#editRating').val(item.rating);
                $('#editShopName').val(shopDto.name);
                $('#editCategoriesName').val(item.categories[0].name);
                arrForEditImages = item.images
            })
        })
})
$('#update').on('click', (event) => {
    event.preventDefault()
    fetch('http://localhost:8888/shop/item', {
        method: 'PUT',
        body: JSON.stringify({
            id: $('#editId').val(),
            name: $('#editName').val(),
            price: $('#editPrice').val(),
            description: $('#editDescription').val(),
            count: $('#editCount').val(),
            rating: $('#editRating').val(),
            shopName: $('#editShopName').val(),
            categoriesName: $('#editCategoriesName').val(),
            shopId: shopDto.id,
            images : arrForEditImages
        }),
        headers: { "Content-Type": "application/json; charset=utf-8" }
    }).then((res) => {
        alert("Item`s been updated successfully");
        console.log(res);
    })
});
//----------------------------------------------------------------------------------------------------------------------
$("#addItem").on('click', () => {
    let input = $('#imageInput')[0].files[0]
    let image
    if (input !== undefined) {
        image = imageToBinary(input)
    }
    let images = []
    let img = {
        picture: image
    }
    images.push(img)

    let options = document.querySelector('#selectedCategories').options
    let categoryNameFromSelect;
    for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
            categoryNameFromSelect = options[i].value
        }
    }
    fetch('http://localhost:8888/shop/item', {
        method: 'POST',
        body: JSON.stringify({
            name: $('#name').val(),
            price: $('#price').val(),
            description: $('#description').val(),
            count: $('#count').val(),
            rating: $('#rating').val(),
            shopId: shopDto.id,
            shopName: shopDto.name,
            images: images,
            categoriesName: categoryNameFromSelect
        }),
        headers: {"Content-Type": "application/json; charset=utf-8"}
    }).then(res => {
        console.log(res)
        alert("Item`s been added")
    })
    const { myForm } = document.forms;
    myForm.reset()
    userShops()
});
// for add item panel (select)
async function getSelectCategories() {
    await fetch("http://localhost:8888/shop/items/category/names")
        .then(res => res.json())
        .then(data => {
            let head = `<p style="color: black">Choose Category name</p>`
            let mySelect = `<select id="selectedCategories" multiple required size="${data.length}">`
            data.forEach((category) => {
                mySelect += `<option value="${category.name}">${category.name}</option>`
            })
            mySelect += `</select>`
            document.querySelector('.forSelectCategoryNames').innerHTML = head + mySelect;
        })
}
getSelectCategories()
//----------------------------------------------------------------------------------------------------------------------
// for coupon panel
async function updateToOverdue(coupon){
    console.log(coupon)
    await fetch('http://localhost:8888/api/coupon/update/overdue/' + coupon.id, {
        method: 'PUT',
        body: JSON.stringify(coupon),
        headers: { "Content-Type": "application/json; charset=utf-8" }
    }).then(res => {console.log(res)})
}
$("#addNewCoupon").on('click', () => {
    fetch("http://localhost:8888/api/coupon/addCoupon", {
        method: 'POST',
        body: JSON.stringify({
            shopId: shopDto.id,
            start: new Date(),
            end: new Date($('#end').val()),
            sum: $('#sum').val()
        }),
        headers: {"Content-Type": "application/json; charset=utf-8"}
    }).then(res => {
        console.log(res);
    })
    const { myCouponForm } = document.forms;
    myCouponForm.reset()
    userShops()
});
//----------------------------------------------------------------------------------------------------------------------