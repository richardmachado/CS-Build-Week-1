import React, {useState, useCallback, useRef} from 'react';
import produce from 'immer';
var classNames = require('classnames');


const numRows = 50;
const numCols = 50;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];
const generateEmptyGrid = () => {

  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0))
  
  }
  return rows;
}
const App: React.FC = () => {
  const [grid, setGrid] = useState(() => {
  return generateEmptyGrid()
  });
 
  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid(g => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });
            // the logic that determines a live cell or dead cell
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
    });
    });
    setTimeout(runSimulation, 100)
  }, []);
  
  
  return (
    <>
      <h1 style={{textAlign:'center'}}>Conway's Game of Life</h1>
      <div style={{  display:'flex', justifyContent:'space-around', marginBottom:30}}>
    <button style={{backgroundColor: !running ? '#1DDAA6': 'red', width:'100px', fontSize: "20px"}} onClick={() =>  {
        setRunning(!running);
        if (!running) {
          runningRef.current = true;
          runSimulation();
        }
    }}
    >
          {running ? 'stop' : 'start'}
        </button>
        <button style={{
         
          border: 'none',
          color: 'black',
          padding: '15px 32px',
          textDecoration:'none',
          textAlign: 'center',
          display: 'inline-block',
          fontSize: '16px'
        }}
          
        onClick={() => {
         const rows = [];
         for (let i = 0; i < numRows; i++) {
           rows.push(Array.from(Array(numCols), () => Math.random() > .5 ? 1:0));
         
         }
         setGrid(rows);
      }}>random</button>
            <button onClick={() => {
        setGrid(generateEmptyGrid());
        }}>clear</button>
      </div>
      
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${numCols}, 20px)`
    }}>
      {grid.map((rows, i) =>
        rows.map((col, k) => <div
          key={`${i}-${k}`}
          onClick={() => {
            const newGrid = produce(grid, gridCopy => {
              gridCopy[i][k] = grid[i][k] ? 0 : 1;
            })
            setGrid(newGrid)
         
          }}
          style={{
            width: 20,
            height: 20,
            backgroundColor: grid[i][k] ? 'dodgerblue' : undefined,
            border: 'solid 1px black'
          }} />)
      )}
    </div>
  </>
  );
};

export default App;
