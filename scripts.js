let data;
fetch('./data.json')
  .then((response) => response.json())
  .then((json) => {data = json;})

const states = document.getElementsByTagName('path');
let stateClicked;

function collectMigrationInformation(target_state){
  const target_state_data = data[target_state];
  let migrate_data = {};

  for (const year in target_state_data){
    for (const state in target_state_data[year]){
      if (state === target_state) continue;

      const estimate = target_state_data[year][state].estimate;
      if (!(state in migrate_data)){
        migrate_data[state] = estimate;
      }
      else{
        migrate_data[state] += estimate;
      }
    }
  }
  delete migrate_data.null
  return migrate_data;
}

function calcNumSummary(migrant_data){
  const max = Object.values(migrant_data).reduce((a,b) => a > b ? a : b);
  const min = Object.values(migrant_data).reduce((a,b) => a < b ? a : b);
  
  let rankings = {};

  for (const state in migrant_data){
    const percentile = Math.ceil(((migrant_data[state] - min)*100) / (max - min));
    rankings[state] = percentile;
  }

  return rankings;
}

function colorStates(migrant_data, rankings){
  const elements = document.getElementsByTagName('path');

  for (const state in migrant_data){
    for (let element of elements){
      if (element.dataset.name == state){
        const lightness = Math.ceil((rankings[state]*65)/100+10);
        element.style.fill = `hsl(200, 100%, ${100-lightness}%)`;
      }
    }
  }
}

// Assign a click listener for each state
for (let i = 0; i < states.length; i++){
    states[i].addEventListener('click', function(){
        if (states[i] === stateClicked) return; 

        stateClicked = states[i];

        document.getElementById('current').innerHTML = `Current Selection: ${stateClicked.dataset.name} (${stateClicked.dataset.id})`
        for (const state of states){
          if (document.getElementById(state.id).style.fill != 'rgb(202, 202, 202)')
            document.getElementById(state.id).style.fill = 'rgb(202, 202, 202)';
        }
        document.getElementById(stateClicked.id).style.fill = 'black';
        
        const migrant_data = collectMigrationInformation(stateClicked.dataset.name);
        const rankings = calcNumSummary(migrant_data);
        
        colorStates(migrant_data, rankings);
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

