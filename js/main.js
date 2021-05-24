/**
 * Documentation de mon cellier - EPFC 2020/2021
 * 
 * SPA permmetant aux utilisateurs de gérer leur magasin de vin.
 * Les utilisateurs peuvent avoir accès à la description des vins, le prix, les images et ajouter des likes et commentaires.
 * Une API REST (http://cruth.phpnet.org/epfc/caviste/public/index.php/) communiquera et interagira avec le SPA en arrière plan.
 
 * Travail réalisé par : Lauren Swart, Alessandro Masson, Ali Haboula, Alexandre Gavriilidis 
 * 
 * Table des matières
 *
 * 1) Déclaration des variables, constantes
 * 2) Fonctions
 * 3) EventListeners
 * 4) Appel de fonction
*/

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 1) Déclaration des variables, constantes
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Variables pour le formulaire
 *
*/

let frm = document.getElementById('connexion');
let btLogin = document.getElementById('btLogin');
let username = document.getElementById('username');
let password = document.getElementById('password');
let inputs = document.querySelectorAll('#connexion input');
let user = null;
let pwd = 123;

let users = {
	'ced': 1,
	'bob': 2,
	'mehdi': 25,
	'youssef': 26,
	'mamadou': 27,
	'manuel': 28,
	'alain': 29,
	'alexandre': 30,
	'fred': 31,
	'ali': 32,
	'angeline': 33,
	'sylwester': 34,
	'alessandro': 35,
	'rachida': 35,
	'badredddine': 37,
	'amandine': 38,
	'guilherme': 39,
	'lauren': 40,
	'ismail': 41,
	'aboubacar': 42
};

/**
 * Variables pour filtrer les vins
 *
*/

let btSearch = document.querySelector('#btSearch');
let keyWordInput = document.querySelector('#keyWord');
let wines = [];
let selectCountry= document.querySelector('#country');
let selectYear= document.querySelector('#year');
const btFilter = document.querySelector('#btFilter');

/**
 * Variables pour la section des commentaires, des notes et description du vin
 *
*/

let comments = document.querySelector("#commentaires");
let divUtilisateur = document.getElementById('connected');	
let divNotes = document.getElementById('divNotes');
let divImgPerso = document.getElementById('imgPerso');
let divInfoVin = document.querySelector('#infoVin');
let infoVin = document.querySelector("#centre div:first-of-type");

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//2) Fonctions
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**	
 *	Affichage des vins
 *
 * @param void
 */
 
function displayAllWines(){
	let xhr = new XMLHttpRequest();
	xhr.onload = function(){
		if (this.status==200){
			wines = JSON.parse(this.responseText);
			displayWines(wines);
			addFilterCategories(wines, 'year'); // filtre les vins par année
			addFilterCategories(wines, 'country'); // filtre les vins par pays
		} else {
			console.log('Bad status: '+this);
		}
	}
	xhr.open('get', 'http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines');
	xhr.send(null);
}

/**
 *	Affiche les vins de wineList dans la section #grilleVins
 *
 *	@param wineList : objet contenant les vins à afficher.
 */
 
function displayWines(wineList){
	showCenter(false); // Cache la section centre contenant les info du vin et commentaires
	let grilleVins = document.getElementById('grilleVins');
	if (wineList.length==0){
		grilleVins.innerHTML ="<p style='color:white;'>Aucun vin trouvé...</p>";
		return;
	}
	
	grilleVins.innerHTML = '<p id="masquerImg" >Cliquez ici pour masquer les images</p>';
	$("#masquerImg").click(function(){ //Code JQUERY masquant/affichant les photos des vins
	  $("#grilleVins span img").animate({
		height: 'toggle'
	  });
	  $(this).html( $(this).html() == 'Cliquez ici pour afficher les images' ? 'Cliquez ici pour masquer les images':'Cliquez ici pour afficher les images');
	
	});
  
	for (key in wineList){
		let wine = wineList[key];
		let bloc = createWineBloc(wine.name,wine.picture,wine.id);
		grilleVins.appendChild(bloc);
		let animation = anime({
			  targets: '#grilleVins span',
			  translateX: 50,
			  delay: anime.stagger(100) // augmente le retard d'affichage de 100ms pour chaque éléments HTML.
		});
	}
}	

/**
 *	Crée un bloc de prévisualisation d'un vin
 *
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
	
	//Affichage d'un vin, par translation vers la droite, au clique d'une image
	bloc.addEventListener("click",function(){
		let animation = anime({
			targets: 'section#centre',
			translateX: 250,
			delay: 1000
		});
		displayInfo(id);
		document.getElementById('recipient-name').value = id;
	})
	return bloc;
}

/**
 * Affiche le vin séléctionné
 *
 * @param id : id du vin selectionné  
 */
 
function displayInfo(id){
	//Récupérer les infos générales du vin
	let wineIndex  = null;
	for(let index in wines){
		if (parseInt(wines[index].id)==id){
			wineIndex = index;
		}
	}
	let wineInfo = wines[wineIndex];
	//Afficher les images suppélmentaires du vin
	displayImages(id,wineInfo.picture,wineInfo.name);
		
	//Afficher tous les commentaires
	displayComments(id);
	
	//Afficher notes perso si connecté
	if(user) {
		displayNotePerso(id);
	}
	
	//afficher la description et likes
	let xhr = new XMLHttpRequest();
	xhr.onload = function(){
		if (this.status==200){
			let info = JSON.parse(this.responseText)[0];
			divInfoVin.innerHTML = '<h5 class="card-title">'+info.name+'</h5><p id ="affichePlus" class="card-text">'+info.description.substring(0,42)+'...</p>';
			let descriptionComplete = info.description;
			
			//bouton pour afficher 'en savoir plus'
			let btAffiche = document.createElement('BUTTON');
			btAffiche.classList.add('btn', 'btn-outline-primary');
			btAffiche.innerHTML = 'En savoir plus';
			btAffiche.type = 'button';
			btAffiche.addEventListener('click', function(){
				document.querySelector("#affichePlus").innerHTML = descriptionComplete;
				$(this).hide();
			});
			divInfoVin.appendChild(btAffiche);
			divInfoVin.appendChild(document.createRange().createContextualFragment('<p class="card-text"><i class="fas fa-globe"> Pays</i> : '+info.country+' - '+info.region+'</p>'));
			divInfoVin.appendChild(document.createRange().createContextualFragment('<p class="card-text"><i class="fas fa-calendar-alt"> Année</i> : '+info.year+'</p>'));
			divInfoVin.appendChild(document.createRange().createContextualFragment('<p class="card-text"><i class="fas fa-wine-glass-alt"> Quantité</i> : '+info.capacity+'cl</p>'));
			divInfoVin.appendChild(document.createRange().createContextualFragment('<p class="card-text"><i class="fas fa-info-circle"> Couleur</i> : '+info.color+'</p>'));
			divInfoVin.appendChild(document.createRange().createContextualFragment('<p class="card-text"><i class="fas fa-tags"> Prix</i> : '+info.price+'€</p>'));
			displayLikes(id);
		} else {
			console.log('Bad status: '+this);
		}
	}
	xhr.open('get','http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/'+id);
	xhr.send(null);
}

/**
 * Affiche la note perso de l'utilisateur 
 *
 * @param id : identifiant du vin affiché actuellement
 * @param note : la note à afficher 
*/

function displayNotePerso(id, note = null) {
	divNotes.innerHTML = "";
	let defaultMessage = "Vous n'avez pas de note pour ce vin.";
	let header = document.createElement('h4');
	header.textContent = "Note personnelle";
	let pNote = document.createElement('p');
	let btnNote = document.createElement('button');
	btnNote.classList.add('btn', 'btn-primary');
	let possedeNote = false;
	divNotes.appendChild(header);
	divNotes.appendChild(pNote);
	divNotes.appendChild(btnNote);
	
	if(note != null || possedeNote) {
		if(possedeNote) {
			
		} else {
			pNote.innerHTML = note;			
		}
		
		btnNote.innerHTML = "Modifier la note";
		
		let btnDelete = document.createElement('button');
		btnDelete.classList.add('btn', 'btn-primary');
		btnDelete.innerHTML = "Supprimer la note";
		divNotes.appendChild(btnDelete);
		
		//Supression d'une note attribué à un vin. Affichage par défaut sinon
		btnDelete.addEventListener('click', function() {		
			if(confirm('Voulez-vous supprimer cette note?')) {
				displayNotePerso(id);
			}			
		});		
	} else {
		pNote.textContent = defaultMessage;
		btnNote.innerText = "Ajouter une note";
	}
	
	//Ajouter une note
	btnNote.addEventListener('click', function() { 
		let notePerso = prompt('Votre note personnelle concernant ce vin :');
		displayNotePerso(id, notePerso);
	});
}

/**
 * Affichage du nombre de likes associé à un vin
 *
 * @param : id du vin sélectionné
 */
 
function displayLikes(id){
	let xhr = new XMLHttpRequest();
	xhr.onload = function(){
		if(xhr.status === 200) {
			let likes = JSON.parse(this.responseText);
			
			if (user==null) {
				divInfoVin.appendChild(document.createRange().createContextualFragment('<p class="card-text"><i class="fas fa-thumbs-up"> Like(s)</i> : '+likes.total+'</p>'));
			} else {
				divInfoVin.appendChild(document.createRange().createContextualFragment('<p class="card-text"><i class="fas fa-thumbs-up"> Like(s)</i> : <span id="afficheLikes">'+likes.total+'</span><button id="btnLike" type="button" style="margin:15px;" class="btn btn-danger"></button></p>'));
				initialiseLikeBtn(id);
			}
		}	
	}
	xhr.open('get','http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/'+id+'/likes-count',true);
	xhr.send(null);	
}

/** 
 * Ajout/suppresion de "Like" pour un vin 
 * @param : id du vin "Liké"
 *
 */
 
function likeThisWine(id, like){
	let afficheLikes = document.querySelector("#afficheLikes");
	let nbLikes = null;
	let dataToSend = JSON.stringify({'like':like}); // Convertir les données en JSON
	let xhr = new XMLHttpRequest(); // Requete AJAX
	let btn = document.querySelector("#btnLike");
	xhr.onload = function () {
		if(this.status === 200) {
			nbLikes = (parseInt(afficheLikes.textContent));
			let validateLike = JSON.parse(this.response); 
			if (like){
				// l'utilisateur vient de liker le vin
				nbLikes +=1;
				afficheLikes.innerHTML = nbLikes;
				btn.innerHTML = 'Je n\'aime plus';
				btn.onclick = function(){
					likeThisWine(id, false)
				}
			} else {
				// l'utilisateur vient de disliker le vin
				nbLikes -=1;
				afficheLikes.innerHTML = nbLikes;
				btn.innerHTML = 'J\'aime';
				btn.onclick = function(){
					likeThisWine(id, true)
				}
			}
		}
	}

	xhr.open('put','http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/'+id+'/like',true);
	xhr.setRequestHeader('Authorization', 'Basic '+btoa(user+':123')); 
	xhr.send(dataToSend);

}


/**
 * Fonction d'initilation du bouton like selon que le statut du vin : Déjà "Liké" ou non
 *
 * @param : id du vin sélectionné
 */
 
function initialiseLikeBtn(id){
	let xhr = new XMLHttpRequest(); 
	xhr.onload = function () {
		if(this.status === 200) {
			let likedWines = JSON.parse(this.response);
			let btn = document.querySelector("#btnLike");
			
			for(let wine of likedWines){
				if (wine.id == id){
					btn.innerHTML = 'Je n\'aime plus';
					btn.onclick = function(){
						likeThisWine(id, false)
					}
					return;
				}
			}
			btn.innerHTML = 'J\'aime';
			btn.onclick = function(){
				likeThisWine(id, true)
			}
		}
	}
	xhr.open('get','http://cruth.phpnet.org/epfc/caviste/public/index.php/api/users/'+users[user]+'/likes/wines');
	xhr.send();
}

/** 
 * Affichage des commentaires associé à un vin
 * @param : id du vin sélectionné
 */
 
function displayComments(id) {
	let btComment = document.getElementById('btComment');
	
	// créer une variable qui correspond à l'ID du vin
	let xhr = new XMLHttpRequest();
	xhr.onload = function () {
		if(this.status === 200) {
			
			//Bouton affiché ou non
			if(user == null) {		
				btComment.style.display = 'none';		
			} else {
				btComment.style.display = 'block';
			};
			
			let commentaires = JSON.parse(this.responseText);
			let div = document.querySelector('#commentaires .list-group');
			div.innerHTML = "";
			
			for(let comment of commentaires){
				if(user && comment.user_id == users[user]) {
					// Chaine avec icones
					div.innerHTML += '<span class="list-group-item list-group-item-action" aria-current="true"><div class="d-flex w-100 justify-content-between">'+comment.content+'<small><i class="fas fa-edit" onclick="editComment('+comment.id+', '+id+', \''+comment.content+'\')"></i> <i class="far fa-trash-alt" onclick="deleteComment('+comment.id+', '+id+')"></i></small></div></p><small>Utilisateur: '+comment.user_id+'</small></span>';
				} else {
					// Chaine sans icones
					//AJOUTÉ 17.05 la ligne ci dessous, et commenté celle d'apres. Il y avait un double +=
					div.innerHTML += '<span class="list-group-item list-group-item-action" aria-current="true"><div class="d-flex w-100 justify-content-between">'+comment.content+'</div></p><small>Utilisateur: '+comment.user_id+'</small></span>';
					//div.innerHTML += += '<span class="list-group-item list-group-item-action" aria-current="true"><div class="d-flex w-100 justify-content-between">'+comment.content+'</div></p><small>Utilisateur: '+comment.user_id+'</small></span>';
				};
			}			
		}
	}
	xhr.open('get','http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/'+id+'/comments',true);
	xhr.send(null);	
}

/** 
 * Supression d'un commentaire posté
 *
 * @param : commentId - identifiant unique du commentaire
 * @param : wineId - identifiant unique du vin
 */

function deleteComment(commentId, wineId) {	
	if(confirm('Voulez-vous supprimer ce commentaire?')) {
		let xhr = new XMLHttpRequest();
		xhr.onload = function () {
			if(this.status === 200) {
				displayComments(wineId);
			}
		}
		xhr.open('delete','http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/'+wineId+'/comments/'+commentId,true);
		xhr.setRequestHeader('Authorization', 'Basic '+btoa(user+':123'));
		xhr.send(null);
	};
};

/** 
 * Modification d'un commentaire posté
 *
 * @param : commentId - identifiant unique du commentaire
 * @param : wineId - identifiant unique du vin
 * @param : currentComment - commentaire actuel du vin sélectionné
*/

function editComment(commentId, wineId, currentComment) {
	//Demande et récupère le commentaire modifié
	let commentModif = prompt('Modifiez votre commentaire :', currentComment);
	
	//Vérification chaine vide ET bouton annulé
	if(commentModif != '' && commentModif != null) {
		// Requête PUT (modification)		
		let data = { "content" : commentModif };
		data = JSON.stringify(data);
		
		let xhr = new XMLHttpRequest();	
		xhr.onload = function () {
			if(this.status === 200) {
				//Rafraîchis
				displayComments(wineId);
			}
		}
		xhr.open('put','http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/'+wineId+'/comments/'+commentId,true);
		xhr.setRequestHeader('Authorization', 'Basic '+btoa(user+':123'));
		xhr.send(data);		
	}			
};

/** 
 * Affiche les images supplémentaire du vin séléctionné
 *
 * @param id : id du vin selectionné
 * @param : picture - image du vin sélectionné
 * @param : name - nom du vin sélectionné 
 */
 
function displayImages(id,picture,name){
	let inner_Carousel = document.querySelector('#carousel');
	//on affiche l'image par défaut
	inner_Carousel.innerHTML = '<div class="carousel-item active"><img src="img/'+picture+'" class="d-block w-100" alt="'+name+'"></div>';	
	
	if (user){
		//si connecté, aller rechercher ses images personnelles pour ce vin
		let xhr = new XMLHttpRequest();
		xhr.onload = function(){
			if (this.status==200){
				let extraImages = JSON.parse(this.responseText);
				for(let img of extraImages){
					inner_Carousel.innerHTML += '<div class="carousel-item"><img src="http://cruth.phpnet.org/epfc/caviste/public/uploads/'+img.url+'" class="d-block w-100" alt="'+name+'"></div>';
				}
			} else {
				console.log('Bad status: '+this);
			}
		}
		xhr.open('get','http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/'+id+'/pictures');
		xhr.setRequestHeader('Authorization', 'Basic '+btoa(user+':123'));
		xhr.send(null);
	}
	showCenter();
}

/**
 *	Validation du formulaire d'identification
 *	
 * @param: void 
 */
 
function checkLogin() {
	
	if(users[username.value] != undefined) {
	
		if(password.value != pwd) {
			alert('Mot de passe invalide!');
		} else {
			//Username ET Mdp acceptés : login
			user = username.value;
			console.log('logged in');
			username.value = '';
			password.value = '';
			
			//Modification du DOM après connexion
			frm.style.display = 'none';
			displayAllWines();
			
			//Création du bouton de déconnexion
			let button = document.createElement('button');
			button.innerHTML = 'Se déconnecter';
			button.classList.add('btn');
			button.classList.add('btn-outline-primary');
			
			//Déconnexion via bouton
			button.addEventListener('click', function() {
				user = null;
				this.remove();
				frm.style.display = 'block';
				displayAllWines();
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


/**	
 * Filtre les vins selon l'année et les pays 
 * 
 * @param : liste des vins
 * @param : category du vin
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
	let option = '<option disabled selected hidden>'+nom+'</option>';
	for(let year of years){
		option += '<option>'+year+'</option>';
	}
	select_year.innerHTML = option;
}

/**	
 * Filtre les vins par mots-clés
 *
 * @param : void
 */
 
function checkKeyWord(){
	let motCle = keyWordInput.value;
	
	let xhr = new XMLHttpRequest();
	xhr.onload = function(){
		if (this.status==200){
			let vins = JSON.parse(this.responseText);
			displayWines(vins);
			
		}
		keyWordInput.value = "";
	}
	xhr.open("GET","http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/search?keyword="+motCle);
	xhr.send();

};

/**
* Revenir au début du document HTML
* 
* @param : void 
*/

function scrollToTop() {
	$(window).scrollTop(0);
}

/**
 * Fonction qui affiche/cache la partie centre (cad Affichage du sélectionné, description, commentaires et likes associés) 
 * 
 * @param show : si false la fonction cache le centre. Si true ou undefined, la fonction affiche le centre
 */
 
function showCenter(show = true){
	if(show){
		document.querySelector("#centre").style.display = "flex";
		infoVin.style.display = 'flex';
		comments.style.display = 'flex';
		if(user) {
			divUtilisateur.style.display = 'flex';
			divNotes.style.display = 'flex';
		}
		
	} else {
		document.querySelector("#centre").style.display = "none";
		infoVin.style.display = 'none';
		comments.style.display = 'none';
		divUtilisateur.style.display = 'none';			
		divNotes.style.display = 'none';
	}
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


//EVENTLISTENERS POUR FILTRER LES VINS
btFilter.addEventListener("click",function(){
	//Affichage des Vins selons les values obtenu
	let valeurYear = document.querySelector('#year').value;
	let valeurCountry = document.querySelector('#country').value;
	let vins_filtrer = [];
	for(let wine in wines){
		let wineCountry = wines[wine].country;
		let wineYear = wines[wine].year;
		if( wineCountry == valeurCountry && wineYear == valeurYear){
			vins_filtrer.push(wines[wine]);
		}
	}
	displayWines(vins_filtrer);
	let optionYear = document.querySelector('#year option:first-of-type');
	let optionCountry = document.querySelector('#country option:first-of-type');

	optionYear.selected = true;
	optionCountry.selected = true;
});


//EVENTLISTENERS filtre par mots-clé
//Via clique souris
btSearch.addEventListener("click",checkKeyWord);

//Via bouton enter
keyWordInput.addEventListener('keyup', function(e) {
	if(e.keyCode == 13) {
		e.preventDefault();
		checkKeyWord();
	}
});	


//EVENTLISTENERS POUR REINITIALISER LE CATALOGUE DES VINS
let reset = document.querySelector(".resetDisplay");
reset.addEventListener("click",function(){
	displayAllWines();
});

document.getElementById('addComment').addEventListener('click', function(){
	if (user!=null){
		
		//récupérer les valeurs entrées
		let message = document.getElementById('message-text').value;
		let wineId = document.getElementById('recipient-name').value;
		if(message != '' && message != null) {	//AJOUTÉ 17.05
			//vider le champ du formulaire
			document.getElementById('message-text').value = ''; //AJOUTÉ 17.05
			let data = { "content" : message };
			data = JSON.stringify(data);
			//requete ajax
			let xhr = new XMLHttpRequest();
			xhr.onload = function(){
				if (this.status==200){
					displayComments(wineId);
					$('.modal').modal('hide');
				}
			}
			xhr.open("post","http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/"+wineId+"/comments");
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.setRequestHeader('Authorization', 'Basic '+btoa(user+':123'));
			xhr.send(data);
		}
	}
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//APPELS DE FONCTION(S)
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

displayAllWines();