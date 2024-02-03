let data;
fetch('./data.json')
  .then((response) => response.json())
  .then((json) => {data = json;})

const states = document.getElementsByTagName('path');
let stateClicked;

async function collectMigrationInformation(state){

}

// Assign a click listener for each state
for (let i = 0; i < states.length; i++){
    states[i].addEventListener('click', function(){
        if (states[i] === stateClicked) return; 

        stateClicked = states[i];

        collectMigrationInformation('a');

        document.getElementById('current').innerHTML = `Current Selection: ${stateClicked.dataset.name} (${stateClicked.dataset.id})`
        for (const state of states){
          if (document.getElementById(state.id).style.fill != 'rgb(202, 202, 202)')
            document.getElementById(state.id).style.fill = 'rgb(202, 202, 202)';
        }
        document.getElementById(stateClicked.id).style.fill = 'black';
    });
}

// Box appearing displaying the name of the state that mouse is hovering over
const detailsBox = document.getElementById('details-box');

document.addEventListener('mouseover', function (e) {
  if (e.target.tagName == 'path') {
    const content = e.target.dataset.name;
    detailsBox.innerHTML = content;
    detailsBox.style.opacity = "70%";
  }
  else {
    detailsBox.style.opacity = "0%";
  }
});

// Follow the mouse and assign the name of the state box below it
window.onmousemove = function (e) {
  const x = e.clientX,
      y = e.clientY;
  detailsBox.style.top = (y + 20) + 'px';
  detailsBox.style.left = (x + 50) + 'px';
};

