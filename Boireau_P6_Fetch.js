

function createAllDivMovies(){
      const GenresList = ["Films_les_mieux_notes", "Comedy", "Crime", "Romance"]
      for (let i in GenresList) {
            createDivMovies(GenresList[i]);
           }
      }

function createDivMovies(Genre) {
      const spreadMoviesList = [0,1,2,3,4,5,6]
      for (let i of spreadMoviesList) {
            const image = document.createElement("img");
            image.className = "film";
            const imageId = "Film";
            image.id = imageId + i;
            const idComedy = document.getElementById(Genre);
            idComedy.appendChild(image);
          }
      }


function fetchMoviesData() {
    fetch("http://localhost:8000/api/v1/titles/?page=1")
      .then(response => response.json())
      .then(data => getMoviesResults(data));
    }

function getMoviesResults(data) {
    console.log(data);
    console.log(data.results);
    const getImageUrl = data.results[0].image_url;
    console.log(getImageUrl);
    const affiche_Meilleur_film = document.getElementById('img_Meilleur_film');
    affiche_Meilleur_film.src = getImageUrl;
    }

//fonctions à refactoriser plus tard:

function ComedyMoviesData() {
    fetch("http://localhost:8000/api/v1/titles/?genre=Comedy&page=1&sort_by=-imdb_score")
      .then(response2 => response2.json())
      .then(data2 => getComedyMoviesResults(data2));
    }

function getComedyMoviesResults(data2) {
    console.log(data2);
    console.log(data2.results);
    // rapatrie l'url du film le mieux noté récemment
    const getImageUrl_2 = data2.results[0].image_url;
    console.log(getImageUrl_2);
    const affiche_Comedy = document.getElementById('img_Comedy1');
    affiche_Comedy.src = getImageUrl_2;
    }

window.onload = function() {
      fetchMoviesData(); 
      ComedyMoviesData();
      createAllDivMovies();
    };

      