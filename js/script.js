window.onload = init;

function init() {
    new Vue({
        el: "#app",
        data: {
            restaurants: [{
                    nom: 'café de Paris',
                    cuisine: 'Française'
                },
                {
                    nom: 'Sun City Café',
                    cuisine: 'Américaine'
                }
            ],
            nom: '',
            cuisine: '',
            nbRestaurants:0,
            page:0,
            pagesize:10,
            name:"",
        },
        mounted() {
            console.log("AVANT AFFICHAGE");
            this.getRestaurantsFromServer();
        },
        methods: {
            getRestaurantsFromServer() {
                let url = "http://localhost:8080/api/restaurants?page=" +
                    this.page + "&pagesize=" +
                    this.pagesize + "&name=" +
                    this.name;

                fetch(url)
                    .then((reponseJSON) => {
                        reponseJSON.json()
                            .then((reponseJS) => {
                                this.restaurants = reponseJS.data;
                                this.nbRestaurants = reponseJS.count;
                                console.log(reponseJS.msg);
                            });
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            },
            supprimerRestaurant(index) {
                this.restaurants.splice(index, 1);
            },
            ajouterRestaurant(event) {
                // eviter le comportement par defaut
                event.preventDefault();

                // Récupération du contenu du formulaire pour envoi en AJAX au serveur
                // 1 - on récupère le formulaire
                let form = event.target;

                // 2 - on récupère le contenu du formulaire
                let dataFormulaire = new FormData(form);

                // 3 - on envoie une requête POST pour insertion sur le serveur
                let url = "http://localhost:8080/api/restaurants";

                fetch(url, {
                        method: "POST",
                        body: dataFormulaire
                    })
                    .then((reponseJSON) => {
                        reponseJSON.json()
                            .then((reponseJS) => {
                                console.log(reponseJS.msg);
                                // On re-affiche les restaurants
                                this.getRestaurantsFromServer();
                            });
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
                
                this.nom = "";
                this.cuisine = "";
            },
            putRequest(event) {
                // Pour éviter que la page ne se ré-affiche
                event.preventDefault();
            
                // Récupération du formulaire. Pas besoin de document.querySelector
                // ou document.getElementById puisque c'est le formulaire qui a généré
                // l'événement
                let form = event.target;
                // Récupération des valeurs des champs du formulaire
                // en prévision d'un envoi multipart en ajax/fetch
                let donneesFormulaire = new FormData(event.target);
            
                let id = form._id.value; 
                let url = "/api/restaurants/" + id;
            
                fetch(url, {
                    method: "PUT",
                    body: donneesFormulaire
                })
                .then(function(responseJSON) {
                    responseJSON.json()
                        .then(function(res) {
                            // Maintenant res est un vrai objet JavaScript
                            afficheReponsePUT(res);
                        });
                    })
                    .catch(function (err) {
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
                console.log(this.page);
            },
            getDernierePage(){
                var rs = (Math.ceil(this.nbRestaurants/this.pagesize)-1);
                console.log(rs);
                return parseInt(rs);
            },
            chercherRestaurants: _.debounce(function () {
                this.getRestaurantsFromServer();
            }, 300)
        }
    })
}