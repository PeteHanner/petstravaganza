//Variables
const SESSION_ANIMALS = 'http://localhost:3000/sessions'
const SESSION_TASKS = 'http://localhost:3000/sessions/update'
let task_queue = []

// Run as soon as the page loads
document.addEventListener('DOMContentLoaded', function(e) {
  fetchAnimals()
  startClock()
  setTimeout(populateTasks, 1500)
  setInterval(pullTasks, 15000)
});

// Keep a running timer at the top of the sidebar
function startClock() {
  const clock = document.getElementById('clock')
  let time = new Date('January 1, 1980 08:00:00')
  clock.innerText = time.toLocaleTimeString([], {
    hour: '2-digit',
    minute:'2-digit'
  })

  // Increment clock so 1 game hour = 30 real seconds
  let incrementClock = () => {
    let newTime = new Date(time.getTime() + 15*60000)
    time = newTime
    clock.innerText = time.toLocaleTimeString([], {
      hour: '2-digit',
      minute:'2-digit'
    });
  }
  const clockTimer = window.setInterval(incrementClock, 7500)
}

// Pull random animals from server
let fetchAnimals = function() {
  fetch(SESSION_ANIMALS)
  .then(resp => resp.json())
  .then(data => {
    // Store animals locally & get first round of tasks
    localStorage.setItem("sessionAnimals", JSON.stringify(data))
    renderAnimalGrid(data)
    pullTasks()
  })
}

// Populate page with animals and task buttons
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

// Pull tasks for animals from server
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
}

// Convert tasks to strings and add them to sidebar
function populateTasks() {
  const taskList = document.getElementById('task-list')
  const activityPhrases = {
    'food': 'eat something',
    'water': 'drink something',
    'potty': 'go potty',
    'exercise': 'get some exercise'
  }
  // every 5 seconds
  // check if there are tasks available in the queue
  if (task_queue.length > 0) {
    // if so, check if there are already 10 tasks in the sidebar
    if (taskList.childElementCount < 10) {

      let taskObject = task_queue.shift()
      let task = document.createElement('div');
      task.className = 'task'
      let currentAnimals = JSON.parse(localStorage['sessionAnimals'])
      let currentAnimal = currentAnimals.find(animal => {
        return animal.id === taskObject.animal_id
      })
      debugger
      task.innerHTML = ` ${currentAnimal.name} the ${currentAnimal.species} needs to <strong>${activityPhrases[taskObject.activity]}</strong>!`
      task.dataset.animalId = taskObject.animal_id
      task.dataset.taskId = taskObject.id
      task.dataset.task = taskObject.activity
      task.dataset.duration = taskObject.duration
      taskList.appendChild(task)
      startTaskTimer(task)
    }
  }
  // Add new tasks to sidebar every X seconds
  setTimeout(populateTasks, 2000)
}

// Add to or subtract from score based on user action.
function adjustScore(e) {
  const targetAnimalId = e.target.parentElement.parentElement.dataset.animalId
  const targetTask = e.target.classList[1]
  const activeTasks = Array.from(document.getElementById("task-list").childNodes)
  let animalMatches = activeTasks.filter(task => task.dataset.animalId === targetAnimalId)
  let taskMatches = animalMatches.filter(task => task.dataset.task === targetTask)
  if (taskMatches.length) {
    incrementScore()
    taskMatches.forEach(node => node.remove())
  } else {
    decrementScore()
  }
}

function decrementScore() {
  const currentScore = document.getElementById("score")
  currentScore.innerText = Number(currentScore.innerText) - 2
}

function incrementScore() {
  const currentScore = document.getElementById("score")
  currentScore.innerText = Number(currentScore.innerText) + 1
}

// If user does not complete task in time, delete it and deduct score
function startTaskTimer(task) {
  // find timer
  let timer = task.dataset.duration
  // start timer
  let decrementTimer = () => {
    timer = timer - 1000
    let taskUnfinished = (!!(document.querySelector(`[data-task-id='${task.dataset.taskId}']`)))
    if (timer <= 0) {
      clearInterval(countdown)
      if (taskUnfinished) {
        task.remove()
        decrementScore()
      }
    }
  }
  let countdown = setInterval(decrementTimer, 1000)
  // CONSEQUENCES if timer runs out
}


