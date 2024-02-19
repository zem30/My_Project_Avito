const discountModal = document.getElementById('discount-modal')
const applyDiscountModal = document.getElementById('apply-discount-modal')

const getResponse = response => response.json()
const requestOptions = (action, data) => ({
    method: action,
    body: JSON.stringify(data),
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})

function setAttrSize(list, id) {
    let size = (list.length < 20) ? list.length : 20
    document.getElementById(id).setAttribute('size', size+1)
}

function renderDiscount(discount) {
    const tbody = document.querySelector('.table-discounts').getElementsByTagName('TBODY')[0]
    let output = ''
    const tr = document.createElement('tr')
    output += `
             <td>${discount.minOrder}</td>
             <td>${discount.percentage}</td>
             <td>${discount.fixedDiscount}</td>
             <td>
             <button type="button" class="btn btn-md btn-success my-3" data-bs-toggle="modal" data-bs-target="#apply-discount-modal"
              data-min-order=${discount.minOrder}
              data-percentage=${discount.percentage} 
              data-fixed-discount=${discount.fixedDiscount}
              >Применить</button>
              </td>`
    tr.innerHTML = output
    tbody.appendChild(tr)
    return tr
}


function renderSelectUsers(user, id) {
    const select = document.getElementById(id)
    const option = document.createElement('option')
    option.setAttribute('value', user.username)
    option.innerHTML = user.username
    select.appendChild(option)
    return select
}

// GET
async function getDiscounts() {
    const shopId = window.location.pathname.replace('/shop/control/', '')
    await fetch('/api/shop/' + shopId + '/discounts')
        .then(getResponse)
        .then(discounts => {
            for (let discount of discounts) {
                renderDiscount(discount)
            }
        })
}

// GET
async function getBuyers(id) {
    const shopId = window.location.pathname.replace('/shop/control/', '')
    const response = await fetch('/api/shop/' + shopId + '/buyers')
        .then(getResponse)
        .then(buyers => {
            setAttrSize(buyers, id)
            for (let buyer of buyers) {
                renderSelectUsers(buyer, id)
            }
            return buyers
        })

}
getBuyers('clients')

// GET
async function getUsers(id) {
    const shopId = window.location.pathname.replace('/shop/control/', '')

    fetch('/api/shop/' + shopId + '/buyers')
        .then(getResponse)
        .then(b => buyers = b)

    await fetch('/api/userlist/all')
        .then(getResponse)
        .then(users => {
            setAttrSize(users, id)

            const props = ['username'];
            const otherClients = users.filter(function (o1) {
                return !buyers.some(function (o2) {
                    return o1.id === o2.id;
                });
            }).map(function (o) {
                return props.reduce(function (newo, name) {
                    newo[name] = o[name];
                    return newo;
                }, {})
            });

            for (let user of otherClients) {
                renderSelectUsers(user, id)
            }
        })
}
getUsers('other-clients')

document.getElementById('btn-show-discounts-shop').onclick = async function () {
    const tbody = document.querySelector('.table-discounts').getElementsByTagName('TBODY')[0]
    tbody.replaceChildren()
    await getDiscounts()
}

// POST
discountModal.querySelector('.btn-add-discount').onclick = function () {

    let discount = {
        minOrder: discountModal.querySelector('#min-order-discount').value,
        percentage: discountModal.querySelector('#percentage-discount').value,
        fixedDiscount: discountModal.querySelector('#fixed-discount').value,
        shopId: window.location.pathname.replace('/shop/control/', '')
    }
    fetch('/api/discounts', requestOptions('POST', discount))
        .then(getResponse)
        .then(discount => {
            renderDiscount(discount)
        })
    discountModal.getElementsByTagName('form')[0].reset()
}


// POST
document.querySelector('.table-discounts').onclick = function (e) {
    let tds = e.target.closest('TR').getElementsByTagName('TD')

    applyDiscountModal.querySelector('.btn-apply-discount').onclick = async function () {

        let isTabClients = document.getElementById('tab-clients-for-discount').classList.contains('active')
        let select = isTabClients ? '#clients' : '#other-clients'

        const selected = applyDiscountModal.querySelector(select).querySelectorAll('option:checked')
        const users = Array.from(selected).map(el => {
            let user = {}
            user.username = el.value
            return user
        })

        let discount = {
            minOrder: tds[0].innerHTML,
            percentage: tds[1].innerHTML,
            fixedDiscount: tds[2].innerHTML,
            shopId: window.location.pathname.replace('/shop/control/', ''),
            users: users
        }

        await fetch('/api/discounts/users', requestOptions('POST', discount))
            .then(() => {
                applyDiscountModal.getElementsByTagName('form')[0].reset()
            })
    }
}