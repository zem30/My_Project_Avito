let key = 11;
let nullDate = new Date(null) // for if
function createCard(coupon) {
    let card = `<div class="card text-dark bg-light mb-3 text-center">`;
    card += `<div class="card-header"><h5>#${coupon.id}</h5></div>`;
    card += `<div class="card-body">`;
    card += `<div class="card-text">`;
    card += `<p><strong>Срок действия </strong>` + getNormalDate(new Date(coupon.start)) + `<strong> До: </strong>` + getNormalDate(new Date(coupon.end)) + `</p>`;
    card += `<p><strong>Магазин:</strong> ` + coupon.shop.name + `</p>`;
    card += `<p><strong>Статус купона:</strong> ` + coupon.status + `</p>`;
    card += `<p><strong>Купон на сумму:</strong> ` + coupon.sum + `</p>`;
    card += `</div></div></div>`;
    return card;
}

//----------------------------------------------------------------------------------------------------------------------
async function showCoupons() {
    let actual = "";
    let overdue = "";
    let used = "";
    let all = "";
    await fetch("/getUser")
        .then(res => res.json())
        .then(user => {
            let now = new Date();
            for (let c of user.coupons) {
                all += createCard(c);
                switch (c.status) {
                    case "ACTUAL":
                        if (new Date().getTime() > Date.parse(c.end)) {
                            updateToOverdue(c.id)
                            c.status = "OVERDUE"
                            overdue += createCard(c);
                        } else {
                            actual += createCard(c);
                        }
                        break;
                    case "USED":
                        used += createCard(c);
                        break;
                    case "OVERDUE":
                        overdue += createCard(c);
                        break;
                    default:
                        console.log("Внезапно :-)");
                }
            }
            document.querySelector(".allCoupons").innerHTML = all;
            document.querySelector(".actualCoupons").innerHTML = actual;
            document.querySelector(".usedCoupons").innerHTML = used;
            document.querySelector(".overdueCoupons").innerHTML = overdue;
        })
}

showCoupons();

//----------------------------------------------------------------------------------------------------------------------
async function updateToOverdue(id) {
    await fetch("/api/coupon/update/overdue/" + id, {
        method: 'PUT',
        // body: JSON.stringify(coupon),
        headers: {"Content-Type": "application/json"}
    })
    // .then(res => {console.log(res)})
}

function getNormalDate(date) {
    return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
}