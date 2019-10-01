// Variables
const SESSION_ANIMALS = 'http://localhost:3000/sessions'
const SESSION_TASKS = 'http://localhost:3000/sessions/update'

const HOME_SCREEN = document.createElement('div');
HOME_SCREEN.id = 'home-screen'
HOME_SCREEN.innerHTML = `
  <div class="wrapperz">
    <header class="header"><h7>WELCOME TO PETE & PEYTON'S<br>PETSTRAVAGANZA</h7></header>
    <article class="main">
      <h6>HOW TO PLAY</h6><br>
    </article>
    <aside class="aside aside-1">Aside 1</aside>
    <aside class="aside aside-2">Aside 2</aside>
    <footer class="footer">
      <a href="#nada" class='butngreen' id='start-game'><span>EASY</span></a>
      <a href="#nada" class='butnyellow' id='start-game'><span>MEDIUM</span></a>
      <a href="#nada" class='butnred' id='start-game'><span>HARD</span></a>
    </footer>
  </div>
  <br><br>
`

const GAME_SCREEN = document.createElement('div');
GAME_SCREEN.id = 'animal-grid'
GAME_SCREEN.innerHTML = `
<div class="wrapper">
  <div id="sidebar" class="box sidebar">
    <div id="header"></div>
    <div><h1 id="clock"></h1></div>
    <div><h2>Score: <span id="score">0</span></h2></div>
    <div id="task-list"></div>
  </div>
  <div class="box" id="1"></div>
  <div class="box" id="2"></div>
  <div class="box" id="3"></div>
  <div class="box" id="4"></div>
  <div class="box" id="5"></div>
  <div class="box" id="6"></div>
</div>
`
let task_queue = []

const GAME_OVER_SCREEN = document.createElement('div');
GAME_OVER_SCREEN.id = 'game-over-screen'
GAME_OVER_SCREEN.innerHTML = `
<div>
  <h1>GAME OVER</h1>
  <h3>Your final score was <span id='final-score'></span></h3>
</div>
`

// Run as soon as the page loads

function clearDOM() {
  let child = document.body.lastElementChild;
  while (child) {
    document.body.removeChild(child)
    child = document.body.lastElementChild
  }
}

document.addEventListener('DOMContentLoaded', function(e) {
  document.body.appendChild(HOME_SCREEN)
  const startButton = document.getElementById('start-game')
  startButton.addEventListener('click', function(e) {
    clearDOM()
    document.body.appendChild(GAME_SCREEN)
    fetchAnimals();
    startClock();
    populateTasks();
    let taskPull = setInterval(pullTasks, 10000)
    let taskPush = setInterval(populateTasks, 2000)
    setTimeout( ()=> {
      const gameOver = new CustomEvent('gameOver')
      document.dispatchEvent(gameOver)
      console.log('GAME OVER!!!!')
      clearInterval(taskPull)
      clearInterval(taskPush)
      setFinalScore()
      clearDOM()
      document.body.appendChild(GAME_OVER_SCREEN)
      const finalScoreSpan = document.getElementById('final-score')
      finalScoreSpan.innerText = localStorage['finalScore']
    }, 60000)
  });
});

// Add header
function createHeader() {
  const header = document.getElementById('header')
  header.innerHTML = `<img src="assets/coming-soon.png" width=50%>`
}

// Keep a running timer at the top of the sidebar
function startClock() {
  createHeader()
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
  const clockTimer = window.setInterval(incrementClock, 1500)
  setTimeout( ()=> {
    clearInterval(clockTimer)
  }, 60000)
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
    foodBtn.className = 'taskbtn food'
    waterBtn.src = 'assets/water.png'
    waterBtn.className = 'taskbtn water'
    pottyBtn.src = 'assets/tinkle.png'
    pottyBtn.className = 'taskbtn potty'
    exerciseBtn.src = 'assets/exercise.png'
    exerciseBtn.className = 'taskbtn exercise'
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
      task.innerHTML = `<img src="${taskObject.image}" width="5%" align="center">   <strong>${currentAnimal.name}</strong> the ${currentAnimal.species} needs to <strong>${activityPhrases[taskObject.activity]}</strong>!`
      task.dataset.animalId = taskObject.animal_id
      task.dataset.taskId = taskObject.id
      task.dataset.task = taskObject.activity
      task.dataset.duration = taskObject.duration
      taskList.appendChild(task)
      startTaskTimer(task)
    }
  }
  // Add new tasks to sidebar every X seconds
  // setTimeout(populateTasks, 2000)
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
  flashScoreRed()
  currentScore.innerText = Number(currentScore.innerText) - 2
}

function incrementScore() {
  const currentScore = document.getElementById("score")
  flashScoreGreen()
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
  document.addEventListener('gameOver', () => clearInterval(countdown), false)
}

function setFinalScore() {
  const finalScoreVal = document.getElementById('score').innerText
  localStorage.setItem("finalScore", finalScoreVal)
}

function flashScoreGreen() {
  const score = document.getElementById('score')
  score.style.textShadow = '0px 0px 10px green';
  score.style.color = 'green';
  setTimeout( ()=> {
    score.style.textShadow = '';
    score.style.color = '#4A5AA8'
  }, 500)
}

function flashScoreRed() {
  const score = document.getElementById('score')
  score.style.textShadow = '0px 0px 10px red';
  score.style.color = 'red';
  setTimeout( ()=> {
    score.style.textShadow = '';
    score.style.color = '#4A5AA8'
  }, 500)
}






