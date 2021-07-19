"use strict"

BASE_URL = "http://localhost:5000/api/cupcakes"

class Cupcake {

    constructor ({id, flavor, size, rating, image}) {
        this.id=id;
        this.flavor=flavor;
        this.size=size;
        this.rating=rating;
        this.image=image;

    }
}


class CupcakeList {

    constructor (cupcakes) {
        this.cupcakes = cupcakes;
    }

    
    static async getCupcakes() {
        const response = await axios.get(BASE_URL);

        cupcakes = response.data.cupcakes.map(cupcake => new Cupcake(cupcake));
        
        return new CupcakeList(cupcakes);
    }


    async addCupcake() {
        $()
    }
}
