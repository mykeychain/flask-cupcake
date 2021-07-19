"use strict"

const BASE_URL = "http://localhost:5000/api/cupcakes"

const $cupcakeList = $("#cupcake-list")

let cupcakeList;

// returns a list of cupcake flavors
async function getCupcakes() {
    let response = await axios.get(BASE_URL);

    return response.data.cupcakes.map(cupcake => cupcake.flavor);
}


// accepts array of cupcakes
function showCupcakeList(cupcakes) {

    for (let cupcake of cupcakes) {
        let entry = $(`<li>${cupcake}</li>`)
        $cupcakeList.append(entry)
    }
}

// handles page load
async function loadPage(){
    let cupcakes = await getCupcakes()
    showCupcakeList(cupcakes)
}


$(document).ready(loadPage)