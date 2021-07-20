"use strict"

const BASE_URL = "http://localhost:5000/api/cupcakes"

const $cupcakeList = $("#cupcake-list")

let cupcakeList;


// returns a list of cupcake flavors return array of cupcake flavors
// [cupcake.flavor, cupcake.flavor, ......]
async function getCupcakes() {
    let response = await axios.get(BASE_URL);

    return response.data.cupcakes.map(cupcake => cupcake.flavor);
}


// accepts array of cupcakes 
// shows sounds like there is a  hide function
//append cupcakes

function appendCupcakesList(cupcakes) {

    for (let cupcake of cupcakes) {
        let $cupcake = $(`<li>${cupcake}</li>`);
        $cupcakeList.append($cupcake);
    }
}

// handles page load
//populate all cupcake

async function populateCupcakesList(){
    let cupcakes = await getCupcakes();
    appendCupcakesList(cupcakes);
}

async function addCupcakeForm(evt){
    evt.preventDefault();

    let flavor = $("#flavor-form").val();
    let size = $("#size-form"). val();
    let rating = $("#rating-form").val();
    let image = $("#image-form").val();

    let newCupcake = await axios.post(BASE_URL, {flavor, size, rating,image});

    updateCupcakeList(newCupcake.data.cupcake.flavor)
    
}

async function updateCupcakeList(cupcake){
    $("#add-cupcake-form").trigger("reset");
    let $cupcake = $(`<li>${cupcake}</li>`);
    $cupcakeList.append($cupcake);

}

// populate cupcake list
//submit cupcake form as new function name

$(document).ready(populateCupcakesList)
$("#add-cupcake-form").on("submit" , addCupcakeForm)