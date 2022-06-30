// liste des Genres de film qu'on choisit d'afficher sur la page JustStreamIt:
const GenresList = ["Films_les_mieux_notes", "Comedy", "Crime", "Romance"]

//stockage des données des 20 premiers films récupérés de l'API pour chaque Genre:
const dataGenreList = [0,fetchDataByGenre(GenresList[1]),fetchDataByGenre(GenresList[2]),fetchDataByGenre(GenresList[3])]

window.onload = function() {

// crée les balises pour les films affichés:

createAllDivMovies();

//va chercher les images à afficher dans le carrousel des meilleurs films:

fetchDataBestMovies();

//va chercher les images à afficher dans les carrousels des catégories:

display()

}

function display(){
for (let i = 1; i < GenresList.length; i++){
      fetchDataByGenre(GenresList[i]);
}
}


// crée les balises pour les films affichés pour chaque Genre déclaré en variable:

function createAllDivMovies() {
    for (let i in GenresList) {
          createDivMovies(GenresList[i]);
         }
    }

// crée les balises pour les films affichés:

function createDivMovies(Genre) {
    const spreadMoviesList = [0,1,2,3,4,5,6];
    for (let i of spreadMoviesList) {
          // crée div pour les modales:
          const modalContainerDiv = document.createElement("div");
          modalContainerDiv.className = "modal-container";
          modalContainerDiv.classList.add("modal-container"+Genre+i);
          const modaleId = "Modale";
          modalContainerDiv.id = modaleId + i + Genre;
          //crée les balises pour les modales:
          const overlay = document.createElement("div");
          modalContainerDiv.appendChild(overlay);
          overlay.className = "overlay modal-trigger";
          const dialog = document.createElement("div");
          modalContainerDiv.appendChild(dialog);
          dialog.className = "modal";
          const closeModal = document.createElement("button");
          dialog.appendChild(closeModal);
          closeModal.className = "close-modal modal-trigger"+ Genre + i;
          closeModal.innerHTML = "x";
          // crée balises pour les images + trigger pour les modales:
          const image = document.createElement("img");
          image.className = "film modal-trigger"+Genre+i;
          const imageId = "Film";
          image.id = imageId + i + Genre;
          const idComedy = document.getElementById(Genre);
          idComedy.appendChild(modalContainerDiv);
          idComedy.appendChild(image);
          //active la modale si clic:
          const modalContainer = document.querySelector(".modal-container"+ Genre + i);
          const modalTriggers = document.querySelectorAll(".modal-trigger" + Genre + i);
          modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal));
          function toggleModal(){
                modalContainer.classList.toggle("active")
                const modalContainerDiv = document.getElementById("Modale"+ i + Genre);
                //affiche les données de la modale
                if (modalContainerDiv.firstChild.nextElementSibling.childNodes.length == 1){
                    const urlMovie = this.title; // this: va chercher attribut title dans l'évènement
                                                 // (== la page cliquée)
                    modalCreation(Genre,i,urlMovie);
                    } else {
                    //enlève les données de la modale
                    while (modalContainerDiv.firstChild.nextElementSibling.childNodes.length > 1) {
                        modalContainerDiv.firstChild.nextElementSibling.removeChild(
                        modalContainerDiv.firstChild.nextElementSibling.firstChild.nextElementSibling)
                    }}
        }
    }
}

// affiche les 7 premières images des carrousels:
function showSevenFirstMoviePics (Genre, imageURLsList, page = 0) {
    for (let j = 0; j < 7; j++){
    if (document.getElementById("Film"+ j + Genre) != null) {
          const billboardGenre = document.getElementById("Film" + j + Genre);
          billboardGenre.src = imageURLsList[j + (page)*7][0];
          billboardGenre.title = imageURLsList[j + (page)*7][1];    
          } else {
                continue
                }
    }
}


// flèches de défilement pour les carrousels:

function arrows(Genre, imageUrlsList){
    //flèche de droite
    const otherFwdArrow = document.getElementById("fwd_"+ Genre);
    let otherFwdArrowClick = 0;

    otherFwdArrow.addEventListener("click",function(noMoreClick) {
          otherFwdArrowClick +=1;
          if (otherFwdArrowClick > 2) {
                noMoreClick.preventDefault(); //on ne peut cliquer que 2 fois à droite sur ce carrousel; 
                //(cas où on clique davantage) 
          } else {
                //si on clique une ou deux fois à droite:
                for (let j = 0; j < Math.min(7, imageUrlsList.length - 7*otherFwdArrowClick); j++){ 
                      if (document.getElementById("Film"+ j + Genre) != null) {
                      const billboardGenre = document.getElementById("Film"+ j + Genre);
                      billboardGenre.src = imageUrlsList[7*otherFwdArrowClick + j][0];
                      billboardGenre.title = imageUrlsList[7*otherFwdArrowClick + j][1]; 
                      } else {
                      continue
                      }
                      }
    }
})

    //flèche de gauche
    const otherBackArrow = document.getElementById('back_'+ Genre);

    otherBackArrow.addEventListener("click",function(noRightClick) {
          if (otherFwdArrowClick == 0) {
          noRightClick.preventDefault(); //cas où le carrousel n'a pas encore défilé vers la droite     
    } else {
          otherFwdArrowClick = otherFwdArrowClick - 1; //diminue le numéro de page consultée
          const pageNumber = otherFwdArrowClick;
          showSevenFirstMoviePics(Genre, imageUrlsList, page = pageNumber);
    }
    })
}

// fonction pour la récupération des données des 20 meilleurs films par Genre:

function fetchDataByGenre(Genre) {
    let imageURLsList = [];
    let URL = ["http://localhost:8000/api/v1/titles/?genre="+Genre+"&page_size=20&page=1&sort_by=-imdb_score&sort_by=-votes",
                ];
    fetch(URL)
            .then(response => response.json())
            .then(data => {for (let i = 0; i < data.results.length; i++){
                    const getImageUrl_2 = data.results[i].image_url;
                    const getMovieURL = data.results[i].url;
                    let tupleList = [];
                    tupleList.push(getImageUrl_2);
                    tupleList.push(getMovieURL);
                    imageURLsList.push(tupleList);
                    if (document.getElementById("Film"+ i + Genre) != null) {
                    const billboardGenre = document.getElementById("Film"+ i + Genre);
                    billboardGenre.src = getImageUrl_2;
                    billboardGenre.title = getMovieURL;
                    arrows(Genre, imageURLsList);
                    } else {
                        continue
                    }
                  }
                return imageURLsList
                }
            )
    
}

// fonction pour la récupération des données des meilleurs films toutes catégories:

function fetchDataBestMovies() {
    let imageURLsList = [];
    let URL_1 = ["http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=20&page=1&sort_by=-votes",
                ];
    fetch(URL_1)
            .then(response => response.json())
            .then(data => {
                    bestMovieDisplay(data);
                    for (let i = 0; i < data.results.length; i++){
                    const getImageUrl_2 = data.results[i].image_url;
                    const getMovieURL = data.results[i].url;
                    let tupleList = [];
                    tupleList.push(getImageUrl_2);
                    tupleList.push(getMovieURL);
                    imageURLsList.push(tupleList);
                    if (document.getElementById("Film"+ i +"Films_les_mieux_notes") != null) {
                    const billboardGenre = document.getElementById("Film"+ i +"Films_les_mieux_notes");
                    billboardGenre.src = getImageUrl_2;
                    billboardGenre.title = getMovieURL;
                    arrows("Films_les_mieux_notes", imageURLsList);
                    } else {
                        continue
                    }
                  }
                return imageURLsList
                }
            )
    
}

//fonction pour le traitement et la présentation de certains chiffres des modales:

function convertToInternationalCurrencySystem (labelValue) {
      // Six Zeroes for Millions 
      return Math.abs(Number(labelValue)) >= 1.0e+6
      ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(1) + " M"
      : Math.abs(Number(labelValue));
    }
//fonction pour remplir de données les modales du Carrousel, quand on clique sur les images:

function modalCreation(Genre, i, urlMovie){
    fetch(urlMovie)
        .then(response => response.json())
        .then(data2 => {
        const modalContainerDiv = document.getElementById("Modale"+ i + Genre);
        const dialog = modalContainerDiv.children[1]
        // va chercher et injecte les données du film dans la modale:
        const movieImage = document.createElement("img");
        movieImage.src = data2.image_url;
        movieImage.className = "floatingIMG"
        dialog.appendChild(movieImage);
        const movieTitle = document.createElement("h2");
        dialog.appendChild(movieTitle);
        movieTitle.innerHTML = data2.title;
        const pubDate = document.createElement("h4");
        dialog.appendChild(pubDate);
        pubDate.innerHTML = "Rated: "+data2.rated+"     - "+data2.genres;
        const IMDBScore = document.createElement("h5");
        dialog.appendChild(IMDBScore);
        IMDBScore.innerHTML = "Score IMDB: "+data2.imdb_score;
        const director = document.createElement("h5");
        dialog.appendChild(director);
        director.innerHTML = "Film Director: "+data2.directors[0];
        const actors = document.createElement("h5");
        dialog.appendChild(actors);
        actors.innerHTML = "Actors: "+data2.actors[0];
        for (let i = 1; i < data2.actors.length; i++){
            actors.innerHTML += ", "+data2.actors[i];
        }
        const duration = document.createElement("h5");
        dialog.appendChild(duration);
        duration.innerHTML = "Duration: "+data2.duration+" min";
        const country = document.createElement("h5");
        dialog.appendChild(country);
        country.innerHTML = "Country: "+data2.countries[0];
        if (data2.countries.length > 1) {
            for (let i = 1; i < data2.countries.length; i++){
                    country.innerHTML += ", "+data2.countries[i];
            }
            } else {};
        const boxOffice = document.createElement("h5");
        dialog.appendChild(boxOffice);
        const boxOfficeConverted = convertToInternationalCurrencySystem(data2.usa_gross_income);
        boxOffice.innerHTML = "Box Office: "+boxOfficeConverted;
        const summary = document.createElement("p");
        dialog.appendChild(summary);
        summary.innerHTML = "Summary: "+data2.long_description;        
        })
    }


//fonction pour l'affichage des éléments du Meilleur Film:

function bestMovieDisplay(data){
    //affichage des éléments du meilleur film:
    //titre
    const getMovieTitle = data.results[0].title;
    const bestMovieTitle = document.getElementById('Meilleur_film');
    bestMovieTitle.innerHTML = "<h2>Meilleur Film: "+getMovieTitle+"</h2><div id=\"Meilleur_film_content\"><img id=\"img_Meilleur_film\" alt = \"affiche du Meilleur Film\"></div>"; 
    //affiche
    const getImageUrl = data.results[0].image_url;
    const billboardBestMovie = document.getElementById('img_Meilleur_film');
    billboardBestMovie.src = getImageUrl;
    billboardBestMovie.alt = "Image du meilleur film";
    billboardBestMovie.title = "Meilleur Film";
    billboardBestMovie.className = "floatingIMG";
    //cherche le lien vers la page où se trouvent le résumé et les détails du film:
    const movieURL = data.results[0].url;
    fetch(""+movieURL+"")
        .then(response2 => response2.json())
        .then(data2 => {
            const meilleurFilmContent = document.getElementById("Meilleur_film_content");
            const divBestMovieRightSide= document.createElement("div");
            divBestMovieRightSide.id = "bestMovieRightSide";
            meilleurFilmContent.appendChild(divBestMovieRightSide);
            //crée la modale du meilleur film
            const modalContainerDiv = document.createElement("div");
            divBestMovieRightSide.appendChild(modalContainerDiv);
            modalContainerDiv.className = "modal-container";
            modalContainerDiv.classList.add("modal-containerBestMovie");
            const overlay = document.createElement("div");
            modalContainerDiv.appendChild(overlay);
            overlay.className = "overlay modal-trigger";
            const dialog = document.createElement("div");
            modalContainerDiv.appendChild(dialog);
            dialog.className = "modal";
            const closeModal = document.createElement("button");
            dialog.appendChild(closeModal);
            closeModal.className = "close-modal modal-trigger";
            closeModal.innerHTML = "x";
            // va chercher et injecte les données du film dans la modale:
            const movieImage = document.createElement("img");
            movieImage.src = data2.image_url;
            movieImage.className = "floatingIMG"
            dialog.appendChild(movieImage);
            const movieTitle = document.createElement("h2");
            dialog.appendChild(movieTitle);
            movieTitle.innerHTML = data2.title;
            const pubDate = document.createElement("h4");
            dialog.appendChild(pubDate);
            pubDate.innerHTML = "Rated: "+data2.rated+"     - "+data2.genres;
            const IMDBScore = document.createElement("h5");
            dialog.appendChild(IMDBScore);
            IMDBScore.innerHTML = "Score IMDB: "+data2.imdb_score;
            const director = document.createElement("h5");
            dialog.appendChild(director);
            director.innerHTML = "Film Director: "+data2.directors[0];
            const actors = document.createElement("h5");
            dialog.appendChild(actors);
            actors.innerHTML = "Actors: "+data2.actors[0];
            for (let i = 1; i < data2.actors.length; i++){
                actors.innerHTML += ", "+data2.actors[i];
                }
            const duration = document.createElement("h5");
            dialog.appendChild(duration);
            duration.innerHTML = "Duration: "+data2.duration+" min";
            const country = document.createElement("h5");
            dialog.appendChild(country);
            country.innerHTML = "Country: "+data2.countries[0];
            if (data2.countries.length > 1) {
                for (let i = 1; i < data2.countries.length; i++){
                    country.innerHTML += ", "+data2.countries[i];
                        }
                        } else {};
            const boxOffice = document.createElement("h5");
            dialog.appendChild(boxOffice);
            const boxOfficeConverted = convertToInternationalCurrencySystem(data2.usa_gross_income);
            boxOffice.innerHTML = "Box Office: "+boxOfficeConverted;
            const summary = document.createElement("p");
            dialog.appendChild(summary);
            summary.innerHTML = "Summary: "+data2.long_description;                               
            // crée une div pour la mise en page des deux boutons du meilleur film
            const divButtonsLayOut = document.createElement("div");
            divBestMovieRightSide.appendChild(divButtonsLayOut);
            divButtonsLayOut.className = "layOut"
            //crée le bouton pour la modale du meilleur film
            const bestButton = document.createElement("button");
            bestButton.className = "modal-btn modal-trigger";
            bestButton.innerHTML = "Plus d'infos";
            divButtonsLayOut.appendChild(bestButton);
            //crée le bouton pour proposer le visionnage du meilleur film
            const playbestButton = document.createElement("button");
            playbestButton.className = "play";
            playbestButton.innerHTML = "Play";
            divButtonsLayOut.appendChild(playbestButton);
            //met un résumé du meilleur film
            const sumUp = document.createElement("p");
            sumUp.innerHTML = data2.description;
            sumUp.id = "bestMovieParagraph";
            divBestMovieRightSide.appendChild(sumUp); 
            //active la modale si clic:
            const modalContainer = document.querySelector(".modal-containerBestMovie");
            const modalTriggers = document.querySelectorAll(".modal-trigger");
            modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal));
            function toggleModal(){
                modalContainer.classList.toggle("active")
                    }
                    })
                }