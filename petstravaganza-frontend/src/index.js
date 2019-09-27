document.addEventListener('DOMContentLoaded', function(e) {
  console.log('Up and running!')
  fetch('http://localhost:3000/sessions')
  .then(resp => resp.json())
  .then(data => console.log(data))
});

