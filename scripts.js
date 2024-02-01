// Assign a click listener for each state
let states = document.getElementsByTagName('path')
let stateClicked

for (let i = 0; i < states.length; i++){
    states[i].addEventListener("click", function(){
        stateClicked = states[i];
        for (let state of states){
          if (document.getElementById(state.id).style.fill != 'rgb(202, 202, 202)')
            document.getElementById(state.id).style.fill = 'rgb(202, 202, 202)';
        }
        document.getElementById(stateClicked.id).style.fill = 'black';
    });
}

// Box appearing displaying the name of the state that mouse is hovering over
var detailsBox = document.getElementById('details-box');

document.addEventListener('mouseover', function (e) {
  if (e.target.tagName == 'path') {
    var content = e.target.dataset.name;
    detailsBox.innerHTML = content;
    detailsBox.style.opacity = "70%";
  }
  else {
    detailsBox.style.opacity = "0%";
  }
});

// Follow the mouse and assign the name of the state box below it
window.onmousemove = function (e) {
  var x = e.clientX,
      y = e.clientY;
  detailsBox.style.top = (y + 20) + 'px';
  detailsBox.style.left = (x + 50) + 'px';
};

