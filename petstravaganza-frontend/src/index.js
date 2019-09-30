//Variables
const SESSION_ANIMALS = 'http://localhost:3000/sessions'
const SESSION_TASKS = 'http://localhost:3000/sessions/update'
let task_queue = []

document.addEventListener('DOMContentLoaded', function(e) {
  // console.log('Up and running!')
  // fetch('http://localhost:3000/sessions')
  // .then(resp => resp.json())
  // .then(data => console.log(data))
  fetchAnimals()
});

let fetchAnimals = function() {
  fetch(SESSION_ANIMALS)
  .then(resp => resp.json())
  .then(data => {
    localStorage.setItem("sessionAnimals", JSON.stringify(data))
    renderAnimalGrid(data)
    pullTasks()
  })
}

//Render Items
let renderAnimalGrid = function(dataObj){
  i = 1
  dataObj.forEach(animal => {
    let animalImage = document.createElement("img")
    let animalName = document.createElement("h4")
    let buttonrow = document.createElement('span');
    let foodBtn = document.createElement('img');
    foodBtn.addEventListener("click", adjustScore)
    let waterBtn = document.createElement('img');
    waterBtn.addEventListener("click", adjustScore)
    let pottyBtn = document.createElement('img');
    pottyBtn.addEventListener("click", adjustScore)
    let exerciseBtn = document.createElement('img');
    exerciseBtn.addEventListener("click", adjustScore)
    animalImage.src = animal.image
    animalImage.className = "animal-image"
    animalName.innerText = animal.name
    buttonrow.className = "button-row"
    foodBtn.src = 'assets/food.png'
    foodBtn.className = 'taskBtn food'
    waterBtn.src = 'assets/water.png'
    waterBtn.className = 'taskBtn water'
    pottyBtn.src = 'assets/tinkle.png'
    pottyBtn.className = 'taskBtn potty'
    exerciseBtn.src = 'assets/exercise.png'
    exerciseBtn.className = 'taskBtn exercise'
    buttonrow.appendChild(foodBtn);
    buttonrow.appendChild(waterBtn);
    buttonrow.appendChild(pottyBtn);
    buttonrow.appendChild(exerciseBtn);
    let box = document.getElementById(`${i}`)
    box.dataset.animalId = animal.id
    box.appendChild(animalImage)
    box.appendChild(animalName)
    box.appendChild(buttonrow)
    i++
  })
}


let pullTasks = function() {
  // set current animals in play as body object
  let currentAnimals = localStorage['sessionAnimals'] //JSON.parse()
  // set up config
  let configObj = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({currentAnimals: currentAnimals})
  }
  // receive tasks as JSON obj
  fetch(SESSION_TASKS, configObj)
  .then(rsp => rsp.json())
  .then(tasks => {
    tasks.forEach(task => task_queue.push(task))
  })
  populateTasks()
}

function populateTasks() {
  const taskList = document.getElementById('task-list')
  const activityPhrases = {
    'food': 'eat something',
    'water': 'drink something',
    'potty': 'go tinkle',
    'exercise': 'get some exercise'
  }
  // every 5 seconds
  // check if there are tasks available in the queue
  if (task_queue.length > 0) {
    // if so, check if there are already 10 tasks in the sidebar
    if (taskList.childElementCount < 10) {
      let task = document.createElement('div');
      task.className = 'task'
      let taskObject = task_queue.shift()
      let currentAnimals = JSON.parse(localStorage['sessionAnimals'])
      let currentAnimal = currentAnimals.find(animal => {
        return animal.id === taskObject.animal_id
      })
      task.innerText = `${currentAnimal.name} the ${currentAnimal.species} needs to ${activityPhrases[taskObject.activity]}!`
      task.dataset.animalId = taskObject.animal_id
      task.dataset.task = taskObject.activity
      taskList.appendChild(task)
    }
  }
  setTimeout(populateTasks, 200)
}

function adjustScore(e) {
  const targetAnimalId = e.target.parentElement.parentElement.dataset.animalId
  const targetTask = e.target.classList[1]
  const activeTasks = Array.from(document.getElementById("task-list").childNodes)
  const currentScore = document.getElementById("score")
  let animalMatches = activeTasks.filter(task => task.dataset.animalId === targetAnimalId)
  let taskMatches = animalMatches.filter(task => task.dataset.task === targetTask)
  if (taskMatches.length) {
    currentScore.innerText = Number(currentScore.innerText)+ 1
  }
}




