const Corridor = require('./corridor.js')

const init = () => {
  const stage = new createjs.Stage("myCanvas");

  let corridor = new Corridor(stage);
};

document.addEventListener("DOMContentLoaded", init)
