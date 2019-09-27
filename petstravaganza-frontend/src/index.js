//Variables
const SESSION_ANIMALS = 'http://localhost:3000/sessions'

document.addEventListener('DOMContentLoaded', function(e) {
  // console.log('Up and running!')
  // fetch('http://localhost:3000/sessions')
  // .then(resp => resp.json())
  // .then(data => console.log(data))
  fetchAnimals()
});

//Render Items
let renderAnimalGrid = function(dataObj){
  i = 1
  dataObj.forEach(animal => {
    let animalImage = document.createElement("img")
    let animalName = document.createElement("h4")
    animalImage.src = animal.image
    animalImage.className = "animal-image"
    animalName.innerText = animal.name
    let box = document.getElementById(`${i}`)
    box.appendChild(animalImage)
    box.appendChild(animalName)
    i++
  })
}


//Fetches
let fetchAnimals = function(){
  let animalObj;
  fetch(SESSION_ANIMALS)
  .then(resp => resp.json())
  .then(data => {
    // animalObj = data
    // localStorage.setItem("sessionAnimals", JSON.stringify(data))
    renderAnimalGrid(data)
  })
}
