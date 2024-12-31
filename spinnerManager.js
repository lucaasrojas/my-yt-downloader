const { log } = require("./helpers");

const figures = {
  tick: "✔",
};

function SpinnerManager() {
  const characters = ["|", "/", "-", "\\"];
  let index = 0;
  let spinners = [];
  let stop = false;
  let running = false

  const addSpinner = (message) => {
    const newSpinner = {
      state: "inprogress",
      message,
    };
    const newLength = spinners.push(newSpinner);
    //return new item index

    // if(!running){
      start()
      process.stdout.moveCursor(0, -(newLength));
    // }
    return newLength - 1;
  };

  const completeSpinner = {
    byMessage: function (message) {
      const index = spinners.findIndex((content) => content.message === message);

      spinners[index].state = "complete";
    },
    byIndex: function (index) {
      if (spinners[index]) {
        spinners[index].state = "complete";
      }
    },
  };

  const printSpinners = () => {
    spinners.forEach((spinner) => {
      switch (spinner.state) {
        case "inprogress":
          log(`\n ${characters[index % characters.length]} ${spinner.message}`);
          break;
        case "complete":
          log(`\n ${figures.tick} ${spinner.message}`);
          break;
        case "todo":
          log(`\n todo: ${spinner.message}`);
          break;
        default:
          log(`\n Default: ${spinner.message}`);
          break;
      }
    });
    if (spinners.every((s) => s.state === "complete")) {
      log("\n All Completed");
    } else if (stop) {
      log("\n Stopped");
    } else {
      index++;
      setTimeout(() => {
        process.stdout.moveCursor(0, -(spinners.length));
        printSpinners();
      }, 100);
    }
  };

  const start = () => {
    running=true
    stop = false;
    printSpinners();
  };

  const stopAll = () => {
    stop = true;
    running=false
  };

  return {
    addSpinner,
    printSpinners,
    spinners,
    start,
    completeSpinner,
    stopAll,
  };
}

module.exports = SpinnerManager;
