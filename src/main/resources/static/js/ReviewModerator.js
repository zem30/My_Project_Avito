$(async function () {
    await getUnmoderatedReviews();
    await getUnmoderatedReviewsCountAndSetBadge();
})

const reviewUrl = "http://" + window.location.hostname + ":8888/moderator/api/reviews";
const reviewFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    getUnmoderatedReviews: async () => await fetch(`${reviewUrl}/getUnmoderatedReviews`),
    getOneUnmoderatedReview: async (id) => await fetch(`${reviewUrl}/getOneUnmoderatedReview/${id}`),
    updateReview: async (item) => await fetch(`${reviewUrl}/editReview`, {
        method: 'PUT',
        headers: reviewFetchService.head,
        body: JSON.stringify(item)
    }),
    getUnmoderatedReviewsCounter: async () => await fetch(`${reviewUrl}/getUnmoderatedReviewsCount`)
}

async function getUnmoderatedReviews() {
    let reviewCards = $('#reviewsCards')
    await reviewFetchService.getUnmoderatedReviews()
        .then(res => res.json())
        .then(reviews => {
                // console.log(reviews);
                if (reviews.length === 0) {
                    reviewCards.append(`<div class="row">
                         <div class="col-sm-6">
                            <div class="card" id="emptyReviewList">
                                <div class="row card-body">
                                    <div class="col-sm-6">
                          <h5 class="card-title"><b>Отзывов для модерации нет!</h5>                        
                            </p>
                  
                        </div>
                    </div>
                </div>
                </div>
                </div>
                <br>`)
                } else {
                    reviews.forEach(review => {
                        let cardFilling =
                            `<div class="row">
                         <div class="col-sm-6">
                            <div class="card" id="reviewCard${review.id}">
                                <div class="row card-body">
                                    <div class="col-sm-6">
                          <h5 class="card-title"><b>Отзыв к: </b>${review.itemName} <b>из</b> ${review.shopName}</h5>
                       
                           <p class="card-text" id="cardText">Текст отзыва: <b>${review.text}</b> <br>
                           <b>Отзыв оставил: ${review.userFirstName} ${review.userLastName}<br>
                            <b>Рейтинг отзыва: </b>${review.rating}<br>
                            </p>
                        
                           <button data-reviewid="${review.id}" data-action="accept" class="btn btn-success">Одобрить</a>
                           <button data-reviewid="${review.id}" data-action="decline" class="btn btn-warning">Отклонить</button>
                           <button data-reviewid="${review.id}" data-action="edit" class="btn btn-primary">Редактировать</button>
                           <button data-reviewid="${review.id}" data-action="delete" class="btn btn-danger">Удалить</button>

                       
                        </div> 
                      </div>
                </div>
                </div>
                </div>
                <br>`
                        reviewCards.append(cardFilling);
                    })
                    getUnmoderatedReviewsCountAndSetBadge();
                }
            }
        )
    $(`#reviewsCards`).find('button').on('click', (event) => {
        let targetButton = $(event.target);
        let buttonItemId = targetButton.attr('data-reviewid');
        let buttonAction = targetButton.attr('data-action');
        let buttonReviewId = targetButton.attr('data-reviewid');
        if (buttonAction === "accept") {
            acceptReview(buttonItemId);
        } else if (buttonAction === "decline") {
            declineReview(buttonItemId);
        } else if (buttonAction === "edit") {
            getModalEdit(buttonReviewId);
        } else if (buttonAction === "delete") {
            deleteUser(buttonReviewId);
        }
    })
}

function deleteUser(id) {
    fetch("http://localhost:8888/api/review/deleteReview/" + id, {
        method: "DELETE",
        headers: {"Content-type": "application/json"}
    })
        .then(res => {
            $('#' + id).remove();
            location.assign('http://localhost:8888/moderator')
        });
}

function edit() {
    let text = document.getElementById('text').value;
    let flaw = document.getElementById('flaw').value;
    let dignity = document.getElementById('dignity').value;
    let id = document.getElementById('id').value;
    let userId = document.getElementById('userId').value;
    let itemId = document.getElementById('itemId').value;
    let date = document.getElementById('date').value;
    let rating = document.getElementById('rating').value;
    let shopId = document.getElementById('shopId').value;



    fetch('/api/review/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            id,
            userId,
            itemId,
            shopId,
            date,
            text,
            flaw,
            dignity,
            rating,

        })
    })
        .then(res => {

            console.log(res.json());
            location.assign('/moderator')
        })
}
function getModalEdit(id) {
    fetch('/api/review/' + id)
        .then(res => res.json())
        .then(review => {
            let modal = document.getElementById('reviewsCards');
            modal.innerHTML = '<div class="modal fade"  id="modalEdit"  tabindex="-1" role="dialog" aria-hidden="true">\n' +
                '                            <div class="modal-dialog">\n' +
                '                                <div class="modal-content">\n' +
                '                                    <div class="modal-header">\n' +
                '                                        <h5 class="modal-title">Edit User</h5>\n' +
                '                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n' +
                '                                            <span aria-hidden="true">&times;</span>\n' +
                '                                        </button>\n' +
                '                                    </div>\n' +
                '                                    <div class="modal-body">\n' +
                '                                        <div class="row justify-content-center align-items-center">\n' +
                '                                            <form class="text-center" method="PUT" >\n' +
                '                                                <div class="modal-body col-md text-cente">\n' +
                '                                        <label class="font-weight-bold">ID</label>\n' +
                '                                        <input type="number"\n' +
                '                                               class="form-control" \n' +
                '                                               name="ids" \n' +
                '                                               id="id" value="' + review.id + '" \n' +
                '                                               readonly> \n' +
                '                                        <br>\n' +
                '                                        <label class="font-weight-bold">User ID</label>\n' +
                '                                        <input type="number"\n' +
                '                                               class="form-control" \n' +
                '                                               name="userid" \n' +
                '                                               id="userId" value="' + review.userId + '" \n' +
                '                                               readonly> \n' +
                '                                        <br>\n' +
                '                                        <label class="font-weight-bold">Item ID</label>\n' +
                '                                        <input type="number"\n' +
                '                                               class="form-control" \n' +
                '                                               name="itemid" \n' +
                '                                               id="itemId" value="' + review.itemId + '" \n' +
                '                                               readonly> \n' +
                '                                        <br>\n' +
                '                                        <label class="font-weight-bold">Shop ID</label>\n' +
                '                                        <input type="number"\n' +
                '                                               class="form-control"\n' +
                '                                               name="shopId"\n' +
                '                                               id="shopId" min="1" max="3" value="1" \n' +
                '                                               required>\n' +
                '                                        <br>\n' +
                '                                        <label class="font-weight-bold">Date</label>\n' +
                '                                        <input type=""\n' +
                '                                               class="form-control" \n' +
                '                                               name="dates" \n' +
                '                                               id="date" value="' + review.date + '" \n' +
                '                                               readonly> \n' +
                '                                        <br>\n' +
                '                                        <label class="font-weight-bold">Text</label>\n' +
                '                                        <input type="text"\n' +
                '                                               class="form-control"\n' +
                '                                               name="texts"\n' +
                '                                               id="text" value="' + review.text + '"\n' +
                '                                               required>\n' +
                '                                        <br>\n' +
                '                                        <label class="font-weight-bold">Flaw</label>\n' +
                '                                        <input type="text"\n' +
                '                                               class="form-control"\n' +
                '                                               name="flaws"\n' +
                '                                               id="flaw" value="' + review.flaw + '"\n' +
                '                                               required>\n' +
                '                                        <br>\n' +
                '                                        <label class="font-weight-bold">Dignity</label>\n' +
                '                                        <input type="text"\n' +
                '                                               class="form-control"\n' +
                '                                               name="dignitys"\n' +
                '                                               id="dignity" value="' + review.dignity + '"\n' +
                '                                               required>\n' +
                '                                        <br>\n' +
                '                                        <label class="font-weight-bold">Rating</label>\n' +
                '                                        <input type="number"\n' +
                '                                               class="form-control"\n' +
                '                                               name="ratings"\n' +
                '                                               id="rating" min="1" max="5" value="' + review.rating + '"\n' +
                '                                               required>\n' +
                '                                        <br>\n' +
                '                                                </div>\n' +
                '                                            </form>\n' +
                '                                        </div>\n' +
                '                                    </div>\n' +
                '                                    <div class="modal-footer">\n' +
                '                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close\n' +
                '                                        </button>\n' +
                '                                        <button type="submit" data-dismiss="modal" class="btn btn-info" onclick="edit()">Edit\n' +
                '                                        </button>\n' +
                '                                    </div>\n' +
                '                                </div>\n' +
                '                            </div>\n' +
                '                        </div>';
            $("#modalEdit").modal();
        });
}


async function acceptReview(id) {
    await reviewFetchService.getOneUnmoderatedReview(id)
        .then(res => res.json())
        .then(async review => {
            review.moderated = true;
            review.moderateAccept = true;
            console.log(review)
            const response = await reviewFetchService.updateReview(review);
            if (response.ok) {
                let reviewsCards = $('#reviewsCards')
                reviewsCards.find(`#reviewCard${review.id}`).remove()
                await reviewFetchService.getUnmoderatedReviews()
                    .then(res => res.json())
                    .then(items => {
                        if (items.length === 0) {
                            reviewsCards.append(`<div class="row">
                         <div class="col-sm-6">
                            <div class="card" id="emptyReviewList">
                                <div class="row card-body">
                                    <div class="col-sm-6">
                          <h5 class="card-title"><b>Отзывов для модерации нет!</h5>                        
                            </p>                  
                        </div>
                    </div>
                </div>
                </div>
                </div>
                <br>`)
                        }
                    })
                await getUnmoderatedReviewsCountAndSetBadge();
            } else {
                console.log("Произошла ошибка")
            }
        })
}

async function declineReview(id) {
    let form;
    let cardField;
    if (!(document.getElementById(`declineReview${id}`))) {
        await reviewFetchService.getOneUnmoderatedReview(id)
            .then(res => res.json())
            .then(review => {
                    if (!(document.getElementById(`declineReview${review.id}`))) {
                        form = `<form id="declineReview${review.id}">
                    <input type="text" class="form-control" id="rejectedReasonToReview${review.id}" name="rejectedReasonToReview${review.id}" placeholder="Введите причину отказа" style="width: 200px; height: 150px;" 
                    min="5">
                    <button type="button" class="btn btn-primary" id="rejectReviewReason${review.id}">Отправить</button>\
                    </form>`
                        cardField = $("#reviewsCards").find(`#reviewCard${review.id}`);
                        cardField.append(form);
                        console.log("Created form")
                    }
                    $(`#declineReview${review.id}`).find('button').on('click', () => {
                        review.moderated = true;
                        review.moderateAccept = false;
                        review.moderatedRejectReason = document.querySelector(`#rejectedReasonToReview${review.id}`).value;
                        sendReviewAndDeleteCard(review);
                    })
                }
            )
    }
}

async function sendReviewAndDeleteCard(review) {
    const response = await reviewFetchService.updateReview(review);
    if (response.ok) {
        let reviewsCards = $('#reviewsCards')
        console.log(reviewsCards);
        reviewsCards.find(`#reviewCard${review.id}`).remove()
        await reviewFetchService.getUnmoderatedReviews()
            .then(res => res.json())
            .then(reviews => {
                if (reviews.length === 0) {
                    reviewsCards.append(`<div class="row">
                         <div class="col-sm-6">
                            <div class="card" id="emptyReviewList">
                                <div class="row card-body">
                                    <div class="col-sm-6">
                          <h5 class="card-title"><b>Отзывов для модерации нет!</h5>                        
                            </p>                
                        </div>
                    </div>
                </div>
                </div>
                </div>
                <br>`)
                }
                getUnmoderatedReviewsCountAndSetBadge();
            })
    } else {
        console.log("Произошла ошибка")
    }
}

async function getUnmoderatedReviewsCountAndSetBadge() {
    let precounter = await reviewFetchService.getUnmoderatedReviewsCounter();
    let counter = precounter.json();
    counter.then(counter => {
        $("#v-pills-tab #v-pills-reviews-tab").html(`Отзывы <span
                        class="badge badge-secondary">${counter}</span>
                    <span class="sr-only">unmoderated reviews</span></a>`)
    })
}