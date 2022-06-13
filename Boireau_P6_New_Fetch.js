



const GenresList = ["Films_les_mieux_notes", "Comedy", "Crime", "Romance"]


createAllDivMovies();

for (let i = 1; i < GenresList.length; i++){
      console.log(GenresList[i]);
      fetchDataByGenre(GenresList[i],1);
}

//récupère la première page des films les mieux notés
fetch("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&sort_by=-votes")
            .then(response => response.json())
            .then(data => {for (let i = 0; i < data.results.length; i++){
                    const getImageUrl_2 = data.results[i].image_url
                    const billboardGenre = document.getElementById("Film"+ i + "Films_les_mieux_notes");
                    billboardGenre.src = getImageUrl_2
                  }
                  //affichage des éléments du meilleur film
                    const getMovieTitle = data.results[0].title;
                    const bestMovieTitle = document.getElementById('Meilleur_film');
                    bestMovieTitle.innerHTML = "<h2>Meilleur Film: "+getMovieTitle+"</h2><img id=\"img_Meilleur_film\" alt = \"affiche du Meilleur Film\">";
                    const getImageUrl = data.results[0].image_url;
                    const billboardBestMovie = document.getElementById('img_Meilleur_film');
                    billboardBestMovie.src = getImageUrl;
                  })
//récupère les pages suivantes des films les mieux notés
fetchBestMovies(2);

fwd_Mieux_Notes.onclick = () => {
      fetchBestMoviesFirstPart(2);
      fetchBestMovies(3);
}

//récupération des films les mieux notés toutes catégories confondues 2e page
function fetchBestMovies(page){
      
      //récupération des films les mieux notés toutes catégories confondues 2eme page

      fetch("http://localhost:8000/api/v1/titles/?page="+page+"&sort_by=-imdb_score&sort_by=-votes")
            .then(response => response.json())
            .then(data => {for (let i = 0; i < data.results.length; i++){
                    const getImageUrl_2 = data.results[i].image_url
                    const secondIndex = 5 + i;
                    if (document.getElementById("Film"+ secondIndex + "Films_les_mieux_notes") != null) {
                    const billboardGenre = document.getElementById("Film"+ secondIndex + "Films_les_mieux_notes");
                    billboardGenre.src = getImageUrl_2
                    } else {
                        continue
                    }
                  }
                  })
}

function fetchBestMoviesFirstPart(page){
      
      //récupération des films les mieux notés toutes catégories confondues 2eme page

      fetch("http://localhost:8000/api/v1/titles/?page="+page+"&sort_by=-imdb_score&sort_by=-votes")
            .then(response => response.json())
            .then(data => {for (let i = 0; i < data.results.length; i++){
                    const getImageUrl_2 = data.results[i].image_url
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

function fetchDataByGenre(Genre,page){

      let imageURLsList = [];
      let secondPage = page + 1;
      let fetchURLsList = ["http://localhost:8000/api/v1/titles/?genre="+Genre+"&page="+page+"&sort_by=-imdb_score&sort_by=-votes",
                            "http://localhost:8000/api/v1/titles/?genre="+Genre+"&page="+secondPage+"&sort_by=-imdb_score&sort_by=-votes"];

      fetch(fetchURLsList[0])
            .then(response2 => response2.json())
            .then(data => {console.table(data);
                  for (let i = 0; i < data.results.length; i++){
              const getImageUrl_2 = data.results[i].image_url;
              console.log(getImageUrl_2);
              imageURLsList.push(getImageUrl_2);
              if (document.getElementById("Film"+ i + Genre) != null) {
                  const billboardGenre = document.getElementById("Film"+ i + Genre);
                  billboardGenre.src = getImageUrl_2
              } else {
                  continue
              }
              }
            })

      fetch(fetchURLsList[1])
            .then(response2 => response2.json())
            .then(data => {console.table(data);
                  for (let i = 0; i < data.results.length; i++){
              const getImageUrl_2 = data.results[i].image_url;
              console.log(getImageUrl_2);
              imageURLsList.push(getImageUrl_2);
              const secondIndex = 5 + i;
              if (document.getElementById("Film"+ secondIndex + Genre) != null) {
                    const billboardComedy2 = document.getElementById("Film"+ secondIndex + Genre);
                    billboardComedy2.src = getImageUrl_2
              } else {
                  continue
              }
              }
              })

      console.log(imageURLsList)
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