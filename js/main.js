//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//JQUERY
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////



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

let comments = document.querySelector("#commentaires");
let divUtilisateur = document.getElementById('connected');	
let divNotes = document.getElementById('divNotes');
let divImgPerso = document.getElementById('imgPerso');
//Afficher description
let divInfoVin = document.querySelector('#infoVin');

let selectCountry= document.querySelector('#country');
let selectYear= document.querySelector('#year');

let infoVin = document.querySelector("#centre div:first-of-type");

const btFilter = document.querySelector('#btFilter');

//Tableau des utilisateurs

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


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//FONCTIONS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**	
 *	Affiche tous les vins
 */
function displayAllWines(){
	let xhr = new XMLHttpRequest();
	xhr.onload = function(){
		if (this.status==200){
			wines = JSON.parse(this.responseText);
			displayWines(wines);
			addFilterCategories(wines, 'year');
			addFilterCategories(wines, 'country');
		} else {
			console.log('Bad status: '+this);
		}
	}
	xhr.open('get', 'http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines');
	xhr.send(null);
}

/**
 *	Affiche les vins de wineList dans la section #grilleVins
 *	@param wineList : objet contenant les vins à afficher
 */
function displayWines(wineList){
	//hide center
	showCenter(false);
	let grilleVins = document.getElementById('grilleVins');
	if (wineList.length==0){
		grilleVins.innerHTML ="<p style='color:white;'>Aucun vin trouvé...</p>";
		return;
	}
	
	//JQUERY
	grilleVins.innerHTML = '<p id="masquerImg" >Cliquez ici pour masquer les images</p>';
	$("#masquerImg").click(function(){
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
			  delay: anime.stagger(100) // increase delay by 100ms for each elements.
		});
	}
}	

/**
 *	Crée un bloc de prévisualisation d'un vin
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
 * @param id : id du vin selectionné  
 */
 
function displayInfo(id){
	
	//Récupérer les infos générales du vin, disponibles dans wines déclaré en haut
	let wineIndex  = null;
	for(let index in wines){
		if (parseInt(wines[index].id)==id){
			wineIndex = index;
		}
	}
	let wineInfo = wines[wineIndex];
	//Afficher toutes les images
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
			//TODO : REQUETE AJAX POUR RECUPERER LES NOTES
			// pNote = 
		} else {
			pNote.innerHTML = note;			
		}
		
		// Si il y a une note :
		btnNote.innerHTML = "Modifier la note";
		
		let btnDelete = document.createElement('button');		//Création du bouton de suppression
		btnDelete.classList.add('btn', 'btn-primary');
		
		btnDelete.innerHTML = "Supprimer la note";
		divNotes.appendChild(btnDelete);
		
		//EVENTLISTENERS POUR SUPPRIMER UNE NOTE
		btnDelete.addEventListener('click', function() {
			//TODO : Supression de la note (Requête AJAX) :
			
			//Met l'affichage à jour
			if(confirm('Voulez-vous supprimer cette note?')) {
				displayNotePerso(id);
			}			
		});
		
	} else {
		// Sinon afficher un message par défaut
		pNote.textContent = defaultMessage;
		btnNote.innerText = "Ajouter une note";
	}
	
	//EVENTLISTENERS POUR RAJOUTER UNE NOTE
	btnNote.addEventListener('click', function() {
		//Bouton AJOUTER une note génère un prompt 
		let notePerso = prompt('Votre note personnelle concernant ce vin :');
		displayNotePerso(id, notePerso);
	});
}

/**
 * Affichage du nombre de likes associé à un vin
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
				
				//BOUTONS DE MODIF DES IMAGES
				divInfoVin.appendChild(document.createRange().createContextualFragment('<p class="card-text"><i class="fas fa-images">  Gérer mes images</i></p>'));
				
				let btnAjouterImg = document.createElement('BUTTON');
				btnAjouterImg.classList.add('btn', 'btn-outline-primary');
				btnAjouterImg.innerHTML = 'Ajouter';
				btnAjouterImg.type = 'button';
				btnAjouterImg.addEventListener('click', function(){ajouterImg(id)});
				divInfoVin.appendChild(btnAjouterImg);
				
				let btnSupprimerImg = document.createElement('BUTTON');
				btnSupprimerImg.classList.add('btn', 'btn-outline-primary');
				btnSupprimerImg.innerHTML = 'Supprimer';
				btnSupprimerImg.type = 'button';
				btnSupprimerImg.addEventListener('click', function(){supprimerImg(id)});
				divInfoVin.appendChild(btnSupprimerImg);
				
					
			}
			
		}	
	}
	xhr.open('get','http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/'+id+'/likes-count',true);
	xhr.send(null);
	
}

/**
 * @param : id du vin affiché
 */
function ajouterImg(id){
	console.log('TODO ALESSANDRO/ALEX');
}



/** 
 * @param : id du vin affiché
 */
function supprimerImg(id){
	console.log('TODO ALI/LAUREN');
}




/** 
 * Ajout de "Like" pour un vin 
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
 *
 */
function initialiseLikeBtn(id){
	let xhr = new XMLHttpRequest(); // Requete AJAX
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
 * @param : id du commentaire
 */

function deleteComment(commentId, wineId) {	
	if(confirm('Voulez-vous supprimer ce commentaire?')) {
		//Requête DELETE
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
 * @param : id du commentaire
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
 * Affiche l'image du vin séléctionné
 * @param id : id du vin selectionné
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
				//mettre dans le dom
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
 *	VALIDATION DU FORMULAIRE (et modification du DOM si connecté)
 *	Connecte l'utilisateur si login et mdp validés
 */
function checkLogin() {
	//UTILISATEUR
	if(users[username.value] != undefined) {
	//MOT DE PASSE
		if(password.value != pwd) {
			alert('Mot de passe invalide!');
		} else {
			//Username ET Mdp acceptés : login
			user = username.value;
			console.log('logged in');
			username.value = '';
			password.value = '';
			//MODIFICATION DU DOM APRES CONNEXION
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
 *	Ajout dynamique de la liste des années/pays dans les balises <option>
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
 *	Fonction filtre par mots-clé
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

//Revenir au début du site
function scrollToTop() {
	$(window).scrollTop(0);
}

/**
 * Fonction qui affiche la partie centre ou la cache
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


//EVENTLISTENERS POUR FILTRAGE DES VINS
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
//APPELS DE FONCTIONS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

displayAllWines();
//////////////////TEST

/*
$("#btnSavoirPlus").click(function(){
  $("#affichePlus").hide(1000)({
	  
  });
});
*/


