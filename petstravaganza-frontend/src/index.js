// Variables
const SESSION_ANIMALS = 'http://localhost:3000/sessions'
const SESSION_TASKS = 'http://localhost:3000/sessions/update'
const LEADERBOARD_URL = 'http://localhost:3000/sessions/leaderboard'
const LEADERBOARD_UPDATE = 'http://localhost:3000/sessions/new_high_score'

const HOME_SCREEN = document.createElement('div');
HOME_SCREEN.id = 'home-screen'
HOME_SCREEN.innerHTML = `
<div class="wrapperz">
<header class="header"><h7>WELCOME TO PETE & PEYTON'S<br>PETSTRAVAGANZA</h7></header>
<article class="main" id="start-button-row">
<h6>HOW TO PLAY</h6>
<h3>Congratulations! You are now the proud owner of your very own pet daycare business!</h3>
<ul class='instructions'>
<li class='how-to'>Your workday begins at 8:00AM.</li>
<li class='how-to'>Every day, a batch of 6 new pets will arrive to be taken care of.</li>
<li class='how-to'>You must monitor your task list and press the correct button to satisfy each pet's needs.</li>
<li class='how-to'>The pets could be hungry, thirsty, need to use the bathroom or want some exercise.</li>
<li class='how-to'>Every completed correct task earns you a point.</li>
<li class='how-to'>Every expired task or incorrect button press deducts two points.</li>
<li class='how-to'>These pets are loved by their owners, so it is your duty to take perfect care of these lil chonks!</li>
<li class='how-to'>The pets will be picked up at the end of the day (6:00PM).</li>
<li class='how-to'>Have fun and good luck!</li>
</ul>

<h6>CHOOSE YOUR DIFFICULTY</h6><br>
<a class='start-game' id='butngreen'>EASY</a>
<a class='start-game' id='butnyellow'>MEDIUM</a>
<a class='start-game' id='butnred'>HARD</a>
<br><br><br>
<a class='leaderboard' id='leaderboard'><strong>LEADERBOARD</strong></a>


</article>
<aside class="aside aside-1"><br><br><br><br><img src="assets/beluga.jpg" class="animal-image"><p>"Please take good care of me!"<br>–- Peyton the Beluga</p></aside>
<aside class="aside aside-2"><br><br><br><br><img src="assets/corgi.jpg" class="animal-image"><p>"I don't want to die from your negligence!"<br>–- Pete the Corgi</p></aside>
<footer class="footer">
<p>Pete & Peyton's PETSTRAVAGANZA<br>by <a href="https://github.com/petehanner">Pete Hanner</a> & <a href="https://github.com/p6doyle">Peyton Doyle</a>
</footer>
</div>
`

const GAME_SCREEN = document.createElement('div');
GAME_SCREEN.id = 'animal-grid'
GAME_SCREEN.innerHTML = `
<div class="wrapper">
  <div id="sidebar" class="box sidebar">
    <div id="header"></div>
    <div>
      <h6>PETE & PEYTON'S PETSTRAVAGANZA</h6>
      <h1 id="clock"></h1>
      <a class='restart' id='restart'><strong>RESTART GAME</strong></a>
    </div>
    <div><h2>Score: <span id="score">0</span></h2></div>
    <div id="task-list"></div>
  </div>
  <div class='boxes'>
    <div class="box" id="1"></div>
    <div class="box" id="2"></div>
  </div>
  <div class='boxes'>
    <div class="box" id="3"></div>
    <div class="box" id="4"></div>
  </div>
  <div class='boxes'>
    <div class="box" id="5"></div>
    <div class="box" id="6"></div>
  </div>
</div>
`
let task_queue = []

const GAME_OVER_SCREEN = document.createElement('div');
GAME_OVER_SCREEN.id = 'game-over-screen'
GAME_OVER_SCREEN.innerHTML = `
<div></div>

<div class="wrapperz">
<header class="header"><h7>GAME OVER</h7></header>
<article class="main" id="start-button-row">
<br><h6>YOUR FINAL SCORE WAS <span id='final-score'></span></h6>
<div id='leaderboard-entry-form'></div><br>
<a class='restart' id='restartend'><strong>RESTART GAME</strong></a>
</article>
<aside class="aside aside-1"><br><br><br><br><img src="assets/beluga.jpg" class="animal-image"><p>"I am so happy, what a great day! Thanks!"<br>–- Peyton the Beluga</p></aside>
<aside class="aside aside-2"><br><br><br><br><img src="assets/corgi.jpg" class="animal-image"><p>"At every second my survival was in doubt!"<br>–- Pete the Corgi</p></aside>
<footer class="footer">
<p>Pete & Peyton's PETSTRAVAGANZA<br>by <a href="https://github.com/petehanner">Pete Hanner</a> & <a href="https://github.com/p6doyle">Peyton Doyle</a>
</footer>
</div>
`

const LEADERBOARD_SCREEN = document.createElement('div');
LEADERBOARD_SCREEN.id = 'leaderboard-screen'
LEADERBOARD_SCREEN.innerHTML = `
<br><h6>HIGH SCORES:</h6>
<p class='hi-score'><strong>1st: </strong><span id='hiscore1'></span></p>
<p class='hi-score'><strong>2nd: </strong><span id='hiscore2'></span></p>
<p class='hi-score'><strong>3rd: </strong><span id='hiscore3'></span></p>
<p class='hi-score'><strong>4th: </strong><span id='hiscore4'></span></p>
<p class='hi-score'><strong>5th: </strong><span id='hiscore5'></span></p>
<p class='hi-score'><strong>6th: </strong><span id='hiscore6'></span></p>
<p class='hi-score'><strong>7th: </strong><span id='hiscore7'></span></p>
<p class='hi-score'><strong>8th: </strong><span id='hiscore8'></span></p>
<p class='hi-score'><strong>9th: </strong><span id='hiscore9'></span></p>
<p class='hi-score'><strong>10th: </strong><span id='hiscore10'></span></p>
`

// Run as soon as the page loads

function clearDOM() {
  let child = document.body.lastElementChild;
  while (child) {
    document.body.removeChild(child)
    child = document.body.lastElementChild
  }
}

let taskExpiration;
let taskAppearanceRate;

document.addEventListener('DOMContentLoaded', function(e) {
  document.body.appendChild(HOME_SCREEN)
  const startButtons = document.getElementById('start-button-row')
  const leaderboardButton = document.getElementById('leaderboard')
  var timesClicked = 0;
  leaderboardButton.addEventListener('click', function(e) {
    timesClicked++;
    if (timesClicked%2==0){
      document.getElementById('leaderboard-screen').remove()
    } else {
      pullLeaderboard()}
    });
    startButtons.addEventListener('click', function(e) {
      let difficulty = e.target.id;
      if (difficulty === 'butngreen') {
        taskAppearanceRate = 1900
        taskExpiration = 11000
        localStorage.setItem("difficulty", 'easy')
        clearDOM()
        startGame()
      } else if (difficulty === 'butnyellow') {
        taskAppearanceRate = 1600
        taskExpiration = 9500
        localStorage.setItem("difficulty", 'medium')
        clearDOM()
        startGame()
      } else if (difficulty === 'butnred'){
        taskAppearanceRate = 1200
        taskExpiration = 8500
        localStorage.setItem("difficulty", 'hard')
        clearDOM()
        startGame()
      } else ( {})
    });
  });

  function startGame() {
    document.body.appendChild(GAME_SCREEN)

    const restartButton = document.getElementById('restart')
    restartButton.addEventListener('click', () => {
      console.log("yolo")
      location.reload();
    })

    const taskList = document.getElementById('task-list')
    taskList.addEventListener('pauseCountdown', () => {
      let holdUp = new CustomEvent('holdUp')
      taskList.childNodes.forEach(childTask => {
        childTask.dispatchEvent(holdUp)
      })
      // setTimeout(countdown, 2000)
    }, false);
    fetchAnimals();
    startClock();
    populateTasks();
    let taskPull = setInterval(pullTasks, 10000)
    let taskPush = setInterval(populateTasks, taskAppearanceRate)
    setTimeout( ()=> {
      endGame(taskPull, taskPush)
    }, 60000)
  }

  // Add header
  // function createHeader() {
  //   const header = document.getElementById('header')
  //   header.innerHTML = `<img src="assets/coming-soon.png" width=50%>`
  // }

  // Keep a running timer at the top of the sidebar
  function startClock() {
    // createHeader()
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
    // check if there are tasks available in the queue
    if (task_queue.length > 0) {
      // if so, check if there are already 10 tasks in the sidebar
      if (taskList.childElementCount < 5) {
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
    let timer = taskExpiration
    const taskList = document.getElementById('task-list')
    const pauseCountdown = new CustomEvent('pauseCountdown')
    // start timer
    let decrementTimer = () => {
      timer = timer - 1000
      let taskUnfinished = (!!(document.querySelector(`[data-task-id='${task.dataset.taskId}']`)))
      if (timer <= 0) {
        clearInterval(countdown)
        if (taskUnfinished) {
          task.remove()
          console.log('timer down')
          decrementScore()
          taskList.dispatchEvent(pauseCountdown)
        }
      }
    }

    let countdown = setInterval(decrementTimer, 1000)

    task.addEventListener('holdUp', (e) => {
      timer = timer + 2400
    });
    // countdown()

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

  function endGame(taskPull, taskPush) {
    const gameOver = new CustomEvent('gameOver')
    document.dispatchEvent(gameOver)
    clearInterval(taskPull)
    clearInterval(taskPush)
    setFinalScore()
    clearDOM()
    document.body.appendChild(GAME_OVER_SCREEN)
    const finalScoreSpan = document.getElementById('final-score')
    finalScoreSpan.innerText = localStorage['finalScore']
    checkForHighScore()
    const restartButton = document.getElementById('restartend')
    restartButton.addEventListener('click', () => {
      location.reload();
    })
  }

  function checkForHighScore() {
    fetch(LEADERBOARD_URL)
    .then(rsp => rsp.json())
    .then(leaderboard => {
      let userScore = Number(localStorage['finalScore']);
      if (leaderboard[0] === undefined) {
        createHighScoreEntry()
      } else {
        let highScoreThreshold = Number(leaderboard[0].score)
        if (leaderboard.length < 10 || userScore > highScoreThreshold) {
          createHighScoreEntry()
        }
      }
    })
  }

  function createHighScoreEntry() {
    const lbEntryFormDiv = document.getElementById('leaderboard-entry-form')
    const lbEntryForm = document.createElement('form');
    lbEntryForm.id = 'create-leaderboard-entry'
    lbEntryForm.innerHTML = `
    <h6>CONGRATS, YOU GOT A HIGH SCORE!</h6><br>
    <label for="username"><h3>Please enter a name for the leaderboard: </h3></label>
    <input type="text" name="username" value=""><br><br>
    <input type="submit" value="YOU DID IT GOOD JOB" class='leaderboard' id='leaderboard'>
    `
    lbEntryFormDiv.appendChild(lbEntryForm)
    lbEntryForm.addEventListener('submit', function(e) {
      e.preventDefault()
      let userName = e.target.childNodes[6].value
      patchLeaderboard(userName)
      let submitButton = document.getElementById('leaderboard')
      submitButton.remove()
    });
  }

  function patchLeaderboard(userName) {
    let userScore = Number(localStorage['finalScore']);
    let bodyData = {username: userName, score: userScore, difficulty: localStorage['difficulty']}
    let configObj = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(bodyData)
    };
    fetch(LEADERBOARD_UPDATE, configObj)
    .then(rsp => rsp.json())
    .then(topScores => {
      pullLeaderboard()
      // showLeaderboard(topScores, document.body)
    })
  }

  function showLeaderboard(topScores, targetNode) {
    targetNode.appendChild(LEADERBOARD_SCREEN)
    let maxIndex = topScores.length - 1
    for (let i = 0; i < topScores.length; i++) {
      let scoreEntry = document.getElementById(`hiscore${i+1}`)
      scoreEntry.innerText = `${topScores[maxIndex].username.toUpperCase()} | ${topScores[maxIndex].score} Points on ${topScores[maxIndex].difficulty.toUpperCase()}`
      maxIndex--
    }
  }

  // Pulls leaderboard for homescreen
  function pullLeaderboard() {
    let article = document.querySelector("article")
    fetch(LEADERBOARD_URL)
    .then(rsp => rsp.json())
    .then(leaderboard => {
      showLeaderboard(leaderboard, article)
    })
  }



