//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//JQUERY
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function(){
	$("#divJquery").click(function(){
	  $("p").animate({
		height: 'toggle'
	  });
	});
  });

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Déclaration variables, constantes
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let frm = document.getElementById('connexion');
let btLogin = document.getElementById('btLogin');
let username = document.getElementById('username');
let password = document.getElementById('password');
let inputs = document.querySelectorAll('#connexion input');
let btSearch = document.querySelector('#btSearch');
let keyWordInput = document.querySelector('#keyWord');
let wines = [];
let user = null;
let pwd = 123;

let selectCountry= document.querySelector('#country');
let selectYear= document.querySelector('#year');

const btFilter = document.querySelector('#btFilter');

//Tableau des utilisateurs
const users = [
	'ced',
	'bob',
	'radad',
	'adam',
	'alain',
	'amin',
	'amine',
	'angeline',
	'badreddine',
	'belkacem',
	'gregory',
	'ismail',
	'appolinaire',
	'kwasi',
	'manuel',
	'maxime',
	'myriam',
	'nathalie',
	'mamadou',
	'rachida',
	'simon',
	'thomas',
	'youssef',
	'nathan'
];


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//FONCTIONS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*	Affiche tous les vins
 *	
 */
function displayAllWines(){
	let xhr = new XMLHttpRequest();
	xhr.onload = function(){
		if (this.status==200){
			wines = JSON.parse(this.responseText);
			displayWines(wines);
			addFilterCategories(wines, 'year');
			addFilterCategories(wines, 'country');
			console.log('displayed');
		} else {
			console.log('Bad status: '+this);
		}
	}
	xhr.open('get', 'http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines');
	xhr.send(null);
}


/*	Affiche les vins de wineList dans la section #grilleVins
 *	@param wineList : objet contenant les vins à afficher
 */
function displayWines(wineList){
	console.log(wineList);
	let grilleVins = document.getElementById('grilleVins');
	grilleVins.innerHTML ="";
	for (key in wineList){
		let wine = wineList[key];
		
		let bloc = createWineBloc(wine.name,wine.picture,wine.id);
		grilleVins.appendChild(bloc);
	}
}


/*	Crée un bloc de prévisualisation d'un vin
 *	@param name : nom du vin à afficher
 *	@param picture : nom de l'image à afficher
 *  @return un node span contenant le nom et l'image du vin
 */
function createWineBloc(name,picture,id){
	let p = document.createElement('p');
	p.innerText = name;
	let img = document.createElement('img');
	img.src = 'img/'+picture;
	img.alt = name;
	let bloc = document.createElement('span');
	bloc.appendChild(img);
	bloc.appendChild(p);
	
	//AJOUTER UN EVENT LISTENER POUR QUAND ON CLIQUE SUR LA CASE, ET UTILISER L'ID DU VIN
	bloc.addEventListener("click",function(){
		displayInfo(id);
		let infoVin = document.querySelector("#centre div:first-of-type");
		console.log(infoVin);
		infoVin.style.display = 'block';

	})

	return bloc;

}

/* Affiche le vin séléctionné
 * @param id : id du vin selectionné
 * 
 *  
 */
function displayInfo(id){
	let xhr = new XMLHttpRequest();
	xhr.onload = function(){
		if (this.status==200){
			let info = JSON.parse(this.responseText)[0];
			console.log(info);
			console.log(info.picture);
			//Afficher toutes les images
			displayImages(id,info.picture,info.name);
			
			//Afficher description
			let divInfoVin = document.querySelector('#infoVin');
			divInfoVin.innerHTML = '<h5 class="card-title">'+info.name+'</h5><p class="card-text">'+info.description+'</p>';
			divInfoVin.innerHTML += '<p class="card-text">Pays : '+info.country+' - '+info.region+'</p>';
			divInfoVin.innerHTML += '<p class="card-text">Année : '+info.year+'</p>';
			divInfoVin.innerHTML += '<p class="card-text">Quantité : '+info.capacity+'cl</p>';
			divInfoVin.innerHTML += '<p class="card-text">Couleur : '+info.color+'</p>';
			divInfoVin.innerHTML += '<p class="card-text">Prix : '+info.price+'€</p>';

			//Afficher commentaires (droite)
			//SI connecté : affichage note perso

		} else {
			console.log('Bad status: '+this);
		}
	}
	xhr.open('get','http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/'+id);
	xhr.send(null);

}

/* Affiche l'image du vin séléctionné
 * 
 * @param id : id du vin selectionné
 *  
 */
function displayImages(id,picture,name){
	let xhr = new XMLHttpRequest();
	let pictures = [picture];
	xhr.onload = function(){
		console.log(pictures);
		if (this.status==200){
			let images = JSON.parse(this.responseText);
		
			//Ajouter images dans pictures si il y'en a 
			//Boucle de pictures
			let contenuDiapo = "";
			for(let carousel of pictures){
				console.log(carousel);
				contenuDiapo += '<div class="carousel-item active"><img src="img/'+carousel+'" class="d-block w-100" alt="'+name+'"></div>';
			} 
			let inner_Carousel = document.querySelector('#carousel');
			inner_Carousel.innerHTML = contenuDiapo;

			console.log(images);
			//Afficher toutes les images
			//Afficher description
			//Afficher commentaires (droite)
			//SI connecté : affichage note perso

		} else {
			console.log('Bad status: '+this);
		}
	}
	xhr.open('get','http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/'+id+'/pictures');
	xhr.setRequestHeader('Authorization', 'Basic '+btoa('ced:123'));
	xhr.send(null);

}

/*	VALIDATION DU FORMULAIRE (et modification du DOM si connecté)
 *	Connecte l'utilisateur si login et mdp validés
 */
function checkLogin() {
	//UTILISATEUR
	if(users.indexOf(username.value) != -1) {
	//MOT DE PASSE
		if(password.value != pwd) {
			alert('Mot de passe invalide!');
		} else {
			//Username ET Mdp acceptés : login
			user = username.value;
			console.log('logged in');
			//CHANGED : AJOUT DES 2 LIGNES SUIVANTES
			username.value = '';
			password.value = '';
			//MODIFICATION DU DOM APRES CONNEXION
			frm.style.display = 'none';
			//Création du bouton de déconnexion
			let button = document.createElement('button');
			button.innerHTML = 'Se déconnecter';
			
			//Déconnexion via bouton
			button.addEventListener('click', function() {
				user = null;
				//button.style.display = 'none'; CHANGED : RETIRER CETTE LIGNE ET METTRE LA SUIVANTE
				this.remove();
				frm.style.display = 'block';
				console.log('logged out');
			});
			let header = document.querySelector('header');
			header.appendChild(button);		
		}
	} else {
	//Pas trouvé d'utilisateur correspondant
		alert('Utilisateur non trouvé!');
	}
};


/*	Ajout dynamique de la liste des années/pays dans les balises <option>
 *	
 */
function addFilterCategories(liste, category) {

	let years = [];
	for(let key in liste){
		
		let	year = liste[key][category];
		if(years.indexOf(year) == -1){
			years.push(year);
		}	
	}

	years.sort();
	let select_year = document.querySelector('#'+category);
	let nom = category=='year' ? 'Année' : 'Pays';
	console.log(nom);
	let option = '<option disabled selected hidden>'+nom+'</option>';
	for(let year of years){
		option += '<option>'+year+'</option>';
	}
	select_year.innerHTML = option;
	
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//EVENTLISTENERS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//EVENTLISTENERS POUR VALIDATION DU FORMULAIRE DE CONNEXION
//via click souris
btLogin.addEventListener('click', checkLogin);

//via bouton Enter
for(input of inputs) {
	input.addEventListener('keyup', function(e) {
		if(e.keyCode == 13) {
			e.preventDefault();
			checkLogin();
		}
	});	
};


//EVENTLISTENERS POUR FILTRAGE DES VINS
btFilter.addEventListener("click",function(){
	//Affichage des Vins selons les values obtenu
	console.log(wines);
	let valeurYear = document.querySelector('#year').value;
	let valeurCountry = document.querySelector('#country').value;
	let vins_filtrer = [];
	for(let wine in wines){
		let wineCountry = wines[wine].country;
		let wineYear = wines[wine].year;
		if( wineCountry == valeurCountry && wineYear == valeurYear){
			vins_filtrer.push(wines[wine]);
		}
		/*}else{
			console.log("vin non dispo");
			break;
		}*/
	}
	displayWines(vins_filtrer);

	let optionYear = document.querySelector('#year option:first-of-type');
	let optionCountry = document.querySelector('#country option:first-of-type');

	optionYear.selected = true;
	optionCountry.selected = true;
	


});


//EVENTLISTENERS filtre par mots-clé

function checkKeyWord(){
	let value = keyWordInput.value;
	
	let xhr = new XMLHttpRequest();
	xhr.onload = function(){
		if (this.status==200){
			let vins = JSON.parse(this.responseText);
			console.log(value);
			console.log(vins);
			displayWines(vins);
		}
		keyWordInput.value = "";
	}
	xhr.open("GET","http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/search?keyword="+value);
	xhr.send();

};

//Via clique souris
btSearch.addEventListener("click",checkKeyWord);

//Via bouton enter
keyWordInput.addEventListener('keyup', function(e) {
	if(e.keyCode == 13) {
		e.preventDefault();
		checkKeyWord();
	}
});	

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//APPELS DE FONCTIONS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

displayAllWines();