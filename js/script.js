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
            restaurantToModify: "",
        },
        mounted() {
            console.log("AVANT AFFICHAGE");
            this.getRestaurantsFromServer();
        },
        methods: {
            getRestaurantsFromServer() {
                if(this.page > this.getDernierePage())
                    this.page = this.getDernierePage();

                if(this.page < 0)
                    this.page = 0;

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
                                //console.log(reponseJS.msg);
                            });
                    }).catch((err) => {
                        console.log(err);
                    });

                console.log("Page actuelle : " + this.page);
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
                                this.afficherMessage("supprimé");
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
                                this.afficherMessage("ajouté");
                                this.getRestaurantsFromServer();
                            });
                    })
                    .catch((err) => {
                        console.log(err);
                    });

                this.nom = "";
                this.cuisine = "";
            },

            modifierRestaurant(event) {
                event.preventDefault();
                let donneesFormulaire = new FormData(event.target);
                let id = (event.target)._id.value;

                let url = SERVER_URL + RESOURCE + "/" + id;

                fetch(url, {
                    method: "PUT",
                    body: donneesFormulaire
                })
                    .then((responseJSON) => {
                        responseJSON.json()
                            .then((res) => {
                                console.log(res.msg);
                                this.afficherMessage("modifié");
                            });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
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
                var res = (Math.ceil(this.nbRestaurants/this.pagesize)-1);
                return parseInt(res);
            },

            chercherRestaurants: _.debounce(function () {
                this.getRestaurantsFromServer();
            }, 300),

            afficherMessage(msg) {
                alert("Restaurant " + msg + " !");

            }

        }
    })
}