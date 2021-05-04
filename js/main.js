//Déclaration variables, constantes
let frm = document.getElementById('connexion');
let btLogin = document.getElementById('btLogin');
let username = document.getElementById('username');
let password = document.getElementById('password');
let inputs = document.querySelectorAll('#connexion input');

let user = null;
let pwd = 123;

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

//Traitement des commandes

//AFFICHER TOUS LES VINS
let xhr = new XMLHttpRequest();
xhr.onload = function(){
	if (this.status==200){
		let wines = JSON.parse(this.responseText);
		displayWines(wines);
		
	} else {
		console.log('Bad status: '+this);
	}
}
xhr.open('get', 'http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines');
xhr.send(null);

function displayWines(wineList){
	console.log(wineList);
	let grilleVins = document.getElementById('grilleVins');
	for (key in wineList){
		let wine = wineList[key];
		
		let bloc = createWineBloc(wine.name, wine.picture);
		grilleVins.appendChild(bloc);
	}
}

function createWineBloc(name, picture){
	let p = document.createElement('p');
	p.innerText = name;
	let img = document.createElement('img');
	img.src = 'img/'+picture;
	img.alt = name;
	let bloc = document.createElement('span');
	bloc.appendChild(img);
	bloc.appendChild(p);
	
	//AJOUTER UN EVENT LISTENER POUR QUAND ON CLIQUE SUR LA CASE, ET UTILISER L'ID DU VIN
	return bloc;
}

//VALIDATION DU FORMULAIRE (et modification du DOM si connecté)
function checkLogin() {
	//console.log('ok');
	
	//UTILISATEUR
	if(users.indexOf(username.value) != -1) {
	//MOT DE PASSE
		if(password.value != pwd) {
			alert('Mot de passe invalide!');
		} else {
			//Username ET Mdp acceptés : login
			user = username.value;
			console.log('logged in');
			
			//MODIFICATION DU DOM APRES CONNEXION
			if(user != null) {
				frm.style.display = 'none';
				
				//Création du bouton de déconnexion
				let button = document.createElement('button');
				button.innerHTML = 'Se déconnecter';
				
				//Déconnexion via bouton
				button.addEventListener('click', function() {
					user = null;
					button.style.display = 'none';
					frm.style.display = 'block';
					console.log('logged out');
				});
				
				let header = document.querySelector('header');
				header.appendChild(button);				
			}
		}
	} else {
	//Pas trouvé d'utilisateur correspondant
		alert('Utilisateur non trouvé!');
	}
};

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