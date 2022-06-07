
function fetchMoviesData() {
    fetch("http://localhost:8000/api/v1/titles/?page=1")
      .then(response => response.json())
      .then(data => getMoviesResults(data));
    }

function getMoviesResults(data) {
    console.log(data);
    console.log(data.results);
    let getImageUrl = data.results[0].image_url;
    console.log(getImageUrl);
    const affiche_Meilleur_film = document.getElementById('img_Meilleur_film');
    affiche_Meilleur_film.src = getImageUrl;
    }

window.onload = function() {
      fetchMoviesData() 
          };


      