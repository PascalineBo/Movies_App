

const GenresList = ["Films_les_mieux_notes", "Comedy", "Crime", "Romance"]
const dataGenreList = [0,fetchDataByGenre(GenresList[1],1),fetchDataByGenre(GenresList[2],1),fetchDataByGenre(GenresList[3],1)]

// crée les balises pour les films affichés:

createAllDivMovies();

//va chercher les données à afficher dans les carrousels:

for (let i = 1; i < GenresList.length; i++){
      fetchDataByGenre(GenresList[i], 1);
      console.log(GenresList[i]);
      console.log(dataGenreList[i]);
      arrowsOther(GenresList[i], dataGenreList[i]);
}

//récupère la première page des films les mieux notés

let bestMoviesPicsList = [];

fetch("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&sort_by=-votes")
            .then(response => response.json())
            .then(data => {for (let i = 0; i < data.results.length; i++){
                    const getImageUrl_2 = data.results[i].image_url
                    bestMoviesPicsList.push(getImageUrl_2);
                    const billboardGenre = document.getElementById("Film"+ i + "Films_les_mieux_notes");
                    billboardGenre.src = getImageUrl_2
                  }
                  //affichage des éléments du meilleur film:
                  //titre
                    const getMovieTitle = data.results[0].title;
                    const bestMovieTitle = document.getElementById('Meilleur_film');
                    bestMovieTitle.innerHTML = "<h2>Meilleur Film: "+getMovieTitle+"</h2><div id=\"Meilleur_film_content\"><img id=\"img_Meilleur_film\" alt = \"affiche du Meilleur Film\"></div>"; 
                    //affiche
                    const getImageUrl = data.results[0].image_url;
                    const billboardBestMovie = document.getElementById('img_Meilleur_film');
                    billboardBestMovie.src = getImageUrl;
                    billboardBestMovie.className = "floatingIMG";
                      //cherche le lien vers la page où se trouve le résumé:
                      const movieURL = data.results[0].url;
                      console.log(movieURL);
                    fetch(""+movieURL+"")
                        .then(response2 => response2.json())
                        .then(data2 => {
                               console.log(data2);
                               const meilleurFilmContent = document.getElementById("Meilleur_film_content");
                               const divBestMovieRightSide= document.createElement("div");
                               meilleurFilmContent.appendChild(divBestMovieRightSide);
                               //crée la modale du meilleur film
                               const modalContainerDiv = document.createElement("div");
                               divBestMovieRightSide.appendChild(modalContainerDiv);
                               modalContainerDiv.className = "modal-container";
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
                                          countries.innerHTML += ", "+data2.countries[i];
                                    }
                                    } else {};
                              const boxOffice = document.createElement("h5");
                              dialog.appendChild(boxOffice);
                              const boxOfficeConverted = convertToInternationalCurrencySystem(data2.usa_gross_income);
                              boxOffice.innerHTML = "Box Office: "+boxOfficeConverted;
                              const summary = document.createElement("p");
                              dialog.appendChild(summary);
                              summary.innerHTML = "Summary: "+data2.long_description;                               

                               //crée le bouton pour la modale du meilleur film
                               const bestButton = document.createElement("button");
                               bestButton.className = "modal-btn modal-trigger";
                               bestButton.innerHTML = "Plus d'infos";
                               divBestMovieRightSide.appendChild(bestButton);
                               //met un résumé du meilleur film
                               const sumUp = document.createElement("p");
                               sumUp.innerHTML = data2.description;
                               sumUp.id = "bestMovieParagraph";
                               divBestMovieRightSide.appendChild(sumUp);
                               divBestMovieRightSide.style.display = "block"; 
                               //active la modale si clic:
                               const modalContainer = document.querySelector(".modal-container");
                               const modalTriggers = document.querySelectorAll(".modal-trigger");
                               modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal));
                               function toggleModal(){
                                    modalContainer.classList.toggle("active")
                                  }
                              })
                        //récupère la page suivantes des films les mieux notés
                        fetchBestMovies(2);                   
                  })


//met des flèches de défilement aux films les mieux notés
arrowsBest("Films_les_mieux_notes", bestMoviesPicsList);


// flèches de défilement pour les films les mieux notés:
function arrowsBest(Genre, imageUrlsList){
      //flèche de droite
      const otherFwdArrow = document.getElementById("fwd_"+ Genre);
      let otherFwdArrowClick = 0;

      otherFwdArrow.addEventListener("click",function(noMoreClick) {
            otherFwdArrowClick +=1;
            if (otherFwdArrowClick > 2) {
                  noMoreClick.preventDefault(); //on ne peut cliquer que 2 fois à droite sur ce carrousel; 
                  //cas où on clique davantage 
            } else {
                  for (let j = 0; j < Math.min(7, imageUrlsList.length - 7*otherFwdArrowClick); j++){ 
                        if (document.getElementById("Film"+ j + Genre) != null) {
                        const billboardGenre = document.getElementById("Film"+ j + Genre);
                        billboardGenre.src = imageUrlsList[7*otherFwdArrowClick + j];
                        } else {
                        continue
                        }
                        }
                  console.log("otherfwdArrowClick = "+ otherFwdArrowClick);
      }
})

      //flèche de gauche
      const otherBackArrow = document.getElementById('back_'+ Genre);

      otherBackArrow.addEventListener("click",function(noRightClick) {
            if (otherFwdArrowClick == 0) {
            noRightClick.preventDefault(); //cas où le carrousel n'a pas encore défilé vers la droite     
      } else {
            otherFwdArrowClick = otherFwdArrowClick - 1; //diminue le numéro de page consultée
            console.log("otherfwdArrowClick = "+ otherFwdArrowClick);
            const pageNumber = otherFwdArrowClick;
            showSevenFirstMoviePics(Genre, imageUrlsList, page = pageNumber);
            console.log(otherFwdArrowClick);
      }
      })
}

// flèches de défilement pour les films des autres catégories:

function arrowsOther(Genre, imageUrlsList){
      //flèche de droite
      const otherFwdArrow = document.getElementById("fwd_"+ Genre);
      let otherFwdArrowClick = 0;

      otherFwdArrow.addEventListener("click",function(noMoreClick) {
            otherFwdArrowClick +=1;
            if (otherFwdArrowClick > 2) {
                  noMoreClick.preventDefault(); //on ne peut cliquer que 2 fois à droite sur ce carrousel; 
                  //cas où on clique davantage 
            } else {
                  for (let j = 0; j < Math.min(7, imageUrlsList.length - 7*otherFwdArrowClick); j++){ 
                        if (document.getElementById("Film"+ j + Genre) != null) {
                        const billboardGenre = document.getElementById("Film"+ j + Genre);
                        billboardGenre.src = imageUrlsList[7*otherFwdArrowClick + j];
                        } else {
                        continue
                        }
                        }
                  console.log("otherfwdArrowClick = "+ otherFwdArrowClick);
      }
})

      //flèche de gauche
      const otherBackArrow = document.getElementById('back_'+ Genre);

      otherBackArrow.addEventListener("click",function(noRightClick) {
            if (otherFwdArrowClick == 0) {
            noRightClick.preventDefault(); //cas où le carrousel n'a pas encore défilé vers la droite     
      } else {
            otherFwdArrowClick = otherFwdArrowClick - 1; //diminue le numéro de page consultée
            console.log("otherfwdArrowClick = "+ otherFwdArrowClick);
            const pageNumber = otherFwdArrowClick;
            showSevenFirstMoviePics(Genre, imageUrlsList, page = pageNumber);
            console.log(otherFwdArrowClick);
      }
      })
}

//récupération des films les mieux notés toutes catégories confondues 2e page
function fetchBestMovies(page){
      const thirdPage = page + 1;
      const fourthPage = page + 2;
      //récupération des films les mieux notés toutes catégories confondues 2eme page
      fetch("http://localhost:8000/api/v1/titles/?page="+page+"&sort_by=-imdb_score&sort_by=-votes")
            .then(response => response.json())
            .then(data => {for (let i = 0; i < data.results.length; i++){
                    const getImageUrl_2 = data.results[i].image_url
                    bestMoviesPicsList.push(getImageUrl_2);
                    const secondIndex = 5 + i;
                    if (document.getElementById("Film"+ secondIndex + "Films_les_mieux_notes") != null) {
                    const billboardGenre = document.getElementById("Film"+secondIndex+"Films_les_mieux_notes");
                    billboardGenre.src = getImageUrl_2
                    } else {
                        continue
                    }
                  }
                  showSevenFirstMoviePics ("Films_les_mieux_notes", bestMoviesPicsList, page = 0);
                  //récupération des films les mieux notés toutes catégories confondues 3eme page
                  fetch("http://localhost:8000/api/v1/titles/?page="+thirdPage+"&sort_by=-imdb_score&sort_by=-votes")
                        .then(response => response.json())
                        .then(data => {for (let i = 0; i < data.results.length; i++){
                              const getImageUrl_2 = data.results[i].image_url
                              bestMoviesPicsList.push(getImageUrl_2);
                              const secondIndex = 5 + i;
                              if (document.getElementById("Film"+ secondIndex + "Films_les_mieux_notes") != null) {
                              const billboardGenre = document.getElementById("Film"+secondIndex+"Films_les_mieux_notes");
                              billboardGenre.src = getImageUrl_2
                              } else {
                                    continue
                              }
                              }
                              showSevenFirstMoviePics ("Films_les_mieux_notes", bestMoviesPicsList, page = 0);
                              //récupération des films les mieux notés toutes catégories confondues 4eme page
                              fetch("http://localhost:8000/api/v1/titles/?page="+fourthPage+"&sort_by=-imdb_score&sort_by=-votes")
                                    .then(response => response.json())
                                    .then(data => {for (let i = 0; i < data.results.length; i++){
                                          const getImageUrl_2 = data.results[i].image_url
                                          bestMoviesPicsList.push(getImageUrl_2);
                                          const secondIndex = 5 + i;
                                          if (document.getElementById("Film"+ secondIndex + "Films_les_mieux_notes") != null) {
                                          const billboardGenre = document.getElementById("Film"+secondIndex+"Films_les_mieux_notes");
                                          billboardGenre.src = getImageUrl_2
                                          } else {
                                                continue
                                          }
                                          }
                                          showSevenFirstMoviePics ("Films_les_mieux_notes", bestMoviesPicsList, page = 0);
                              })
                  })      
            })
            console.log(bestMoviesPicsList);
            return bestMoviesPicsList;
}

function fetchBestMoviesFirstPart(page){
      
      //récupération des films les mieux notés toutes catégories confondues 1ere page

      fetch("http://localhost:8000/api/v1/titles/?page="+page+"&sort_by=-imdb_score&sort_by=-votes")
            .then(response => response.json())
            .then(data => {for (let i = 0; i < data.results.length; i++){
                    const getImageUrl_2 = data.results[i].image_url;
                    bestMoviesPicsList.push(getImageUrl_2);
                    const secondIndex = i;
                    if (document.getElementById("Film"+ secondIndex + "Films_les_mieux_notes") != null) {
                    const billboardGenre = document.getElementById("Film"+ secondIndex + "Films_les_mieux_notes");
                    billboardGenre.src = getImageUrl_2
                    } else {
                        continue
                    }
                  }
                  })
}

//récupération des films les mieux notés par genre

function fetchDataByGenre(Genre, page){

      let imageURLsList = [];
      let secondPage = page + 1;
      let thirdPage = secondPage + 1;
      let fourthPage = thirdPage + 1;
      let URLsList = ["http://localhost:8000/api/v1/titles/?genre="+Genre+"&page="+page+"&sort_by=-imdb_score&sort_by=-votes",
                              "http://localhost:8000/api/v1/titles/?genre="+Genre+"&page="+secondPage+"&sort_by=-imdb_score&sort_by=-votes",
                              "http://localhost:8000/api/v1/titles/?genre="+Genre+"&page="+thirdPage+"&sort_by=-imdb_score&sort_by=-votes",
                              "http://localhost:8000/api/v1/titles/?genre="+Genre+"&page="+fourthPage+"&sort_by=-imdb_score&sort_by=-votes"
                              ];
            fetch(URLsList[0]) // met les urls image de la première page dans une liste
                .then(response2 => response2.json())
                .then(data => {console.table(data);
                  for (let j = 0; j < data.results.length; j++){
                    const getImageUrl_2 = data.results[j].image_url;
                    console.log(getImageUrl_2);
                    imageURLsList.push(getImageUrl_2);
                  };
                  fetch(URLsList[1]) // puis ajoute les urls image de la deuxième page dans la liste
                        .then(response2 => response2.json())
                        .then(data => {console.table(data);
                        for (let j = 0; j < data.results.length; j++){
                        const getImageUrl_2 = data.results[j].image_url;
                        console.log(getImageUrl_2);
                        imageURLsList.push(getImageUrl_2);
                        };
                        fetch(URLsList[2]) // puis ajoute les urls image de la troisième page dans la liste
                              .then(response2 => response2.json())
                              .then(data => {console.table(data);
                              for (let j = 0; j < data.results.length; j++){
                                    const getImageUrl_2 = data.results[j].image_url;
                                    console.log(getImageUrl_2);
                                    imageURLsList.push(getImageUrl_2);
                              };
                              fetch(URLsList[3]) // puis ajoute les urls image de la troisième page dans la liste
                                    .then(response2 => response2.json())
                                    .then(data => {console.table(data);
                                    for (let j = 0; j < data.results.length; j++){
                                          const getImageUrl_2 = data.results[j].image_url;
                                          console.log(getImageUrl_2);
                                          imageURLsList.push(getImageUrl_2);
                                    };
                                    showSevenFirstMoviePics(Genre, imageURLsList, page = 0); //
                                    // affiche les 7 premières images de la liste dans le carrousel
                                    console.log(Genre);
                                    console.log(imageURLsList);
                                    });
                              });
                        });
                  })
      return imageURLsList;
      }

function createAllDivMovies() {
      for (let i in GenresList) {
            createDivMovies(GenresList[i]);
           }
      }

function createDivMovies(Genre) {
      const spreadMoviesList = [0,1,2,3,4,5,6];
      for (let i of spreadMoviesList) {
            const image = document.createElement("img");
            image.className = "film";
            const imageId = "Film";
            image.id = imageId + i + Genre;
            const idComedy = document.getElementById(Genre);
            idComedy.appendChild(image);
          }
      }

function convertToInternationalCurrencySystem (labelValue) {
      // Six Zeroes for Millions 
      return Math.abs(Number(labelValue)) >= 1.0e+6
      ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(1) + " M"
      : Math.abs(Number(labelValue));
    }

// affiche les 7 premières images des carrousels:
function showSevenFirstMoviePics (Genre, imageURLsList, page = 0) {
      for (let j = 0; j < 7; j++){
      if (document.getElementById("Film"+ j + Genre) != null) {
            console.log("Film"+ j + Genre);
            const billboardGenre = document.getElementById("Film" + j + Genre);
            billboardGenre.src = imageURLsList[j + (page)*7];
      } else {
            continue
            }
      }          
}   
