window.onload = init;

var SERVER_URL = "http://localhost:8081/";
var RESOURCE = "api/restaurants";

function init() {
    new Vue({
        el: "#app",
        data: {
            restaurants: [],
            nom: '',
            cuisine: '',
            nbRestaurants:0,
            page:0,
            pagesize: 10,
            name:"",
            addForm: false,
            restaurantToModify: null,
        },
        mounted() {
            console.log("AVANT AFFICHAGE");
            this.getRestaurantsFromServer();
        },
        methods: {
             getRestaurantsFromServer() {
                let url = SERVER_URL + RESOURCE +
                    "?page=" + this.page +
                    "&pagesize=" + this.pagesize +
                    "&name=" + this.name;

                fetch(url)
                    .then((reponseJSON) => {
                        reponseJSON.json()
                            .then((reponseJS) => {
                                this.restaurants = reponseJS.data;
                                this.nbRestaurants = reponseJS.count;
                                console.log(reponseJS.msg);
                            });
                    }).catch((err) => {
                        console.log(err);
                    });
                console.log("Page actuelle : " + this.page);
            },

            async formModifierRestaurant(id){
                this.restaurantToModify = await this.getRestaurant(id);
                console.log("a modifier : " + this.restaurantToModify._id);
            },

            async getRestaurant(id) {
                let url = SERVER_URL + RESOURCE + "/" + id;
                let response = await fetch(url);
                let ob = await response.json();
                let res = ob.restaurant;
                return res;
            },

            supprimerRestaurant(id) {
                let url = SERVER_URL + RESOURCE + "/" + id;

                fetch(url, {
                    method: "DELETE",
                })
                    .then((responseJSON) =>{
                        responseJSON.json()
                            .then((res) => {
                                console.log(res.msg);
                                this.getRestaurantsFromServer();
                            });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            },

            ajouterRestaurant(event) {
                event.preventDefault();
                let dataFormulaire = new FormData(event.target);

                let url = SERVER_URL + RESOURCE;

                fetch(url, {
                    method: "POST",
                    body: dataFormulaire
                })
                    .then((reponseJSON) => {
                        reponseJSON.json()
                            .then((reponseJS) => {
                                console.log(reponseJS.msg);
                                this.getRestaurantsFromServer();
                            });
                    })
                    .catch((err) => {
                        console.log(err);
                    });

                this.addForm = false;
            },

            async modifierRestaurant(event) {
                event.preventDefault();
                let dataFormulaire = new FormData(event.target);
                let id = (event.target)._id.value;

                let url = SERVER_URL + RESOURCE + "/" + id;

                await fetch(url, {
                    method: "PUT",
                    body: dataFormulaire
                })
                    .then((responseJSON) => {
                        responseJSON.json()
                            .then((res) => {
                                console.log(res.msg);
                            });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                this.restaurantToModify = null;
                this.getRestaurantsFromServer();
            },

            getColor(index) {
                return (index % 2) ? 'white' : 'lightgrey';
            },

            pagePrecedente() {
                if(this.page > 1)
                    this.page--;
                this.getRestaurantsFromServer();
            },

            pageSuivante() {
                if(this.page < this.getDernierePage())
                    this.page++;
                this.getRestaurantsFromServer();
                console.log(this.page);
            },

            premierePage() {
                this.page = 0;
                this.getRestaurantsFromServer();
            },

            dernierePage() {
                this.page = this.getDernierePage();
                this.getRestaurantsFromServer();
            },

            getDernierePage(){
                let res = (Math.ceil(this.nbRestaurants/this.pagesize)-1);
                return parseInt(res);
            },

            chercherRestaurants: _.debounce(function () {
                this.page = 0;
                this.getRestaurantsFromServer();
            }, 300),

            formAjouterRestaurant(){
                this.addForm = true;
            },

            cancelModifier() {
                 this.restaurantToModify = null;
            },

            cancelAjouter() {
                 this.addForm = false;
            }
        }
    })
}