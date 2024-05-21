let data;
fetch("./data/migrate-2005-2022.json")
  .then((response) => response.json())
  .then((json) => {
    data = json;
  });

class StateInteraction {
  constructor() {
    this.states = document.getElementsByTagName("path");
    this.stateClicked;
    this.migrant_data;
    this.rankings;

    // Assign a click listener for each state
    for (let i = 0; i < this.states.length; i++) {
      this.states[i].addEventListener("click", () => {
        if (this.states[i] === this.stateClicked) return;

        this.stateClicked = this.states[i];

        document.getElementById(
          "current"
        ).innerHTML = `Current Selection: ${this.stateClicked.dataset.name} (${this.stateClicked.dataset.id})`;
        for (const state of this.states) {
          if (
            document.getElementById(state.id).style.fill != "rgb(202, 202, 202)"
          )
            document.getElementById(state.id).style.fill = "rgb(202, 202, 202)";
        }
        document.getElementById(this.stateClicked.id).style.fill = "black";

        this.migrant_data = this.collectMigrationInformation(
          this.stateClicked.dataset.name
        );
        this.rankings = this.calcNumSummary();

        this.colorStates();
      });
    }
  }

  collectMigrationInformation(target_state) {
    const target_state_data = data[target_state];
    let migrate_data = {};

    for (const year in target_state_data) {
      for (const state in target_state_data[year]) {
        if (state === target_state) continue;

        const estimate = target_state_data[year][state].estimate;
        if (!(state in migrate_data)) {
          migrate_data[state] = estimate;
        } else {
          migrate_data[state] += estimate;
        }
      }
    }
    delete migrate_data.null;
    return migrate_data;
  }

  calcNumSummary() {
    const max = Object.values(this.migrant_data).reduce((a, b) =>
      a > b ? a : b
    );
    const min = Object.values(this.migrant_data).reduce((a, b) =>
      a < b ? a : b
    );

    let rankings = {};

    for (const state in this.migrant_data) {
      const percentile = Math.ceil(
        ((this.migrant_data[state] - min) * 100) / (max - min)
      );
      rankings[state] = percentile;
    }

    return rankings;
  }

  colorStates() {
    const elements = document.getElementsByTagName("path");

    for (const state in this.migrant_data) {
      for (let element of elements) {
        if (element.dataset.name == state) {
          const lightness = Math.ceil((this.rankings[state] * 65) / 100 + 10);
          element.style.fill = `hsl(200, 100%, ${100 - lightness}%)`;
        }
      }
    }
  }
}

class StateDetailBox {
  constructor() {
    // Box appearing displaying the name of the state that mouse is hovering over
    this.detailsBox = document.getElementById("details-box");
  }

  mousetrack() {
    document.addEventListener("mouseover", (e) => {
      if (e.target.tagName == "path") {
        const content = e.target.dataset.name;
        this.detailsBox.innerHTML = content;
        this.detailsBox.style.opacity = "70%";
      } else {
        this.detailsBox.style.opacity = "0%";
      }
    });

    // Follow the mouse and assign the name of the state box below it
    window.onmousemove = (e) => {
      const x = e.clientX,
        y = e.clientY;
      this.detailsBox.style.top = y + 20 + "px";
      this.detailsBox.style.left = x + 50 + "px";
    };
  }
}

let d = new StateDetailBox();
d.mousetrack();

let i = new StateInteraction();
