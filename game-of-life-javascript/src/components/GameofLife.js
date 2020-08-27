import React, {useState, useCallback, useRef} from 'react';
import produce from "immer";

import '../App.css'

// These are the initial variables we are using to set up the cells as well as the grid
let rowNumber = 25
let colNumber = 25
let id = 0
let cell = {alive: 0, id : id}

// This is used when calculating the neighbors of each cell - the first value is for the X axis on the grid and the second is for the y axis
const neighbors = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

// This function is used for inital setup and clearing the grid. It creates a blank 25x25 grid of cells
const blankGrid = () => {
  const rows = []
  for(let i = 0; i < rowNumber; i++){
    rows.push(Array.from(Array(colNumber), () => cell))
  }
  return rows
}

// This  function is used to create a 25x25 grid as well but instead of the cells all starting as dead this one will randomly assign them as dead or alive
const randomGrid = () => {
  const rows = []
  for(let i = 0; i < rowNumber; i++){
    rows.push(Array.from(Array(colNumber), () => ({alive: Math.round(Math.random())})))
  }
  return rows
}


function GameofLife() {
  // State for the grid itself this is where the current grid is stored and accessed in order to update it. You can see its inital state is using the blankgrid function for a clean 25x25 grid.
  const [grid, setGrid] = useState(() => {
    return blankGrid()
  })
  // This counter is used to track which generation of the game is currently being displayed. The number ticks up and is then set in state as genCounter
  let count = 0
  const [genCounter, setGenCounter] = useState(count)

  // State for whether or not the program is running
  const [simOn, setSimOn] = useState(false);

  // State to confirm which speed the program is running
  const [faster, setFaster] = useState(false);

  // States to confirm which grid size is being used and its size. I still have plans to make this variable. That is why it is not a simple true false boolean
  const [size, setSize] = useState({rowNumber: 10, colNumber: 10})
  const [changeGridSize, setChangeGridSize] = useState(false);
  
  // A ref used to confirm and point out to the sim when it is active
  const runningRef = useRef(simOn);
  runningRef.current = simOn;

  // This function is for one iteration of the program. It first confirms which grid size is being used. Then uses the immer library produce to create a new copy. As it does so it is checking the correct neighbors (based on grid size) and applying the rules for Conway's game of life to determine if the cell in that spot for the next iteration will be alive or dead
  const runIt = (oldGrid) => {
    if(!changeGridSize){
      return produce(oldGrid, (copy) => {
        for(let i = 0; i < rowNumber; i++){
          for (let m = 0; m < colNumber; m++){
            let simCount = 0
            neighbors.forEach(([x,y]) => {
              const newI = i + x
              const newM = m + y
              if (newI >= 0 && newI < rowNumber && newM >= 0 && newM < colNumber){
                simCount += (oldGrid[newI][newM]).alive
              }
          })
            if(oldGrid[i][m].alive == 0 && simCount == 3){
              copy[i][m].alive = 1
            }else if(simCount < 2 || simCount > 3){
              copy[i][m].alive = 0
            }else{
              copy[i][m] = oldGrid[i][m]
            }
        }
        }
      })
    }else if (changeGridSize){
      return produce(oldGrid, (copy) => {
        for(let i = 0; i < size.rowNumber; i++){
          for (let m = 0; m < size.colNumber; m++){
            let simCount = 0
            neighbors.forEach(([x,y]) => {
              const newI = i + x
              const newM = m + y
              if (newI >= 0 && newI < size.rowNumber && newM >= 0 && newM < size.colNumber){
                simCount += (oldGrid[newI][newM]).alive
              }
            })
            if(oldGrid[i][m].alive == 0 && simCount == 3){
              copy[i][m].alive = 1
            }else if(simCount < 2 || simCount > 3){
              copy[i][m].alive = 0
            }else{
              copy[i][m] = oldGrid[i][m]
            }
          }
        }
      })
    }
  }

  // This function is used to keep the sim itself running. It donfirms with running ref if it is in fact running and then will continue to run it through as long as the sim is on. This will also add one to the counter for it to be set in state and displayed on the screen. Finally there is also a timeout set in order for the function to know when to display the next version of the grid. We have set two speeds based on the faster state.
  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setGrid((oldGrid) => {
      return runIt(oldGrid);
    });
    count = count + 1
    setGenCounter(count)

    setTimeout(runSimulation, faster ? 1 : 1000);
  }, [faster]);

 
  // Here we are displaying what is on the screen itself
  return (
    <div class="flex">
    <div>
      <div>
        <h1>Conway's Game of Life</h1>
      </div>
     

      <button // the first button runs the program itself. Changing the state and making sure the ref is true. it also runs the function run sim to make sure it will keep itterating
          class="buttons"
          style={{backgroundColor: !simOn ? '#1DDAA6': 'red', width:'100px', fontSize: "20px"}}
        onClick={() => {
          setSimOn(!simOn);
          if (!simOn){
            runningRef.current = true
            runSimulation()
          }
          
        }}
      >
          {simOn ? 'stop' : 'start'}
      </button>

      {/* <button // the next button is to stop the program from running - simply by updating the state of simOn
        class="buttons"
        onClick={() => {
          setSimOn(false);
        }}
      >
        Stop
      </button> */}

      <button // This button updates the speed to the faster setting by chaning the state controling the speed. This is referenced in the runSimulation function 
          class="buttons"
          style={{backgroundColor: !faster ? 'pink': 'yellow', width:'100px', fontSize: "20px"}}
        onClick={() => {
          setFaster(!faster);
        }}
        
      >
        {faster ? 'lightspeed' : 'slow'}
      </button>



      <button // this button will clear the grid and reset it to 25x25
          class="buttons"
          style={{width:'100px', fontSize: "20px"}}
        onClick={() => {
          setChangeGridSize(false)
          setSimOn(false);
 
          setGrid(blankGrid());
          
        }}
      >
        Clear
      </button>

      <button // this button changes the grid size to 10x10 and updates the state to ensure it calculates neighbors correctly when the program is running
          class="buttons"
          style={{width:'100px',height:'30px', fontSize: "12px"}}
        onClick={() => {
          const rows = []
          for(let i = 0; i < size.rowNumber; i++){
            rows.push(Array.from(Array(size.colNumber), () => cell))}
          setGrid(rows)
          setChangeGridSize(true)
          setFaster(true)
        }}
      >
        Shrink to 10x10
      </button>

      <button // this button uses the randomGrid function to reset the grid to a randomized 25x25 grid
          class="buttons"
          style={{width:'100px',height:'30px', fontSize: "12px"}}
        onClick={() => {
          setChangeGridSize(false)
 
          setGrid(randomGrid());
        }}
      >
          Random
      </button>
      <p>Generation: {genCounter}</p>
      <div // In this div we are displaying the grid. Based on the size being used it will show differnt amounts. What is being shown in the div itself starting on line 145 is the grid and making each cell clickable. We are utilizing immer produce again in order to make a new copy of the grid when a cell is clicked - changing its status from dead to alive
        className="grid"
        style={!changeGridSize ? {
          display: "grid",
          gridTemplateColumns: `repeat(${colNumber},30px)`, 
        } : {display: "grid",
        gridTemplateColumns: `repeat(${size.colNumber},30px)`,}}
      >
        {grid.map((rows, k) =>
          rows.map((columns, e) => (
            <div
              key={`${k}-${e}`}
              onClick={() => {
                if (!simOn) {
                  const newGrid = produce(grid, (copy) => {
                    if(copy[k][e].alive === 0){
                      copy[k][e].alive = 1
                    }
                    else{
                      copy[k][e].alive = 0
                    }
                  });
                  setGrid(newGrid);
                } else {
                  return null;
                }
              }}
              style={{
                width: 30,
                height: 30,
                backgroundColor: grid[k][e].alive ? "dodgerblue" : "black",
                border: "dotted 1px white",
              }}
            ></div>
          ))
        )}
       
      </div>
    </div>
    </div>
  );
}

export default GameofLife;