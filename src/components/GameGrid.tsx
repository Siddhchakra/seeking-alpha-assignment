import classNames from 'classnames';
import produce from 'immer';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Button from './Button';

const numRows: number = 50;
const numCols: number = 50;
const redundant: number[][] = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const GameGrid: React.FC = () => {
  const [Simulation, setSimulation] = useState(false);
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
  });
  const runningRef = useRef(Simulation);
  runningRef.current = Simulation;

  useEffect(() => {
    const generateRandomLiveCells = () => {
      const rows = [];
      for (let i = 0; i < numRows; i++) {
        rows.push(Array.from(Array(numCols), () => (Math.random() > 0.5 ? 1 : 0)));
      }
      return rows;
    };

    setGrid(generateRandomLiveCells());
  }, []);

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            redundant.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newK >= 0 && newI < numRows && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 100);
  }, []);

  return (
    <>
      <h1 className='text-2xl'>Rules:</h1>
      <div className='text-left flex justify-around mb-5'>
        <ul>
          <li className='list-disc'>
            Any live cell with fewer than two live neighbours dies, as if by underpopulation.
          </li>
          <li className='list-disc'>
            Any live cell with two or three live neighbours lives on to the next generation.
          </li>
          <li className='list-disc'>
            Any live cell with more than three live neighbours dies, as if by overpopulation.
          </li>
          <li className='list-disc'>
            Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
          </li>
        </ul>
      </div>
      <div className='border mx-10'></div>
      <div>
        <Button
          className='my-5'
          variant={Simulation ? 'error' : 'success'}
          onClick={() => {
            setSimulation(!Simulation);
            if (!Simulation) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {Simulation ? 'Stop' : 'Start'} Simulation
        </Button>
      </div>
      <div className='flex justify-around'>
        <div
          className='grid w-fit'
          style={{
            gridTemplateColumns: `repeat(${numCols}, 20px)`
          }}
        >
          {grid.map((rows, i) =>
            rows.map((data, k) => (
              <div
                className={classNames('border border-black h-5', {
                  'bg-black': grid[i][k]
                })}
                onClick={() => {
                  const newGrid = produce(grid, (gridCopy) => {
                    gridCopy[i][k] = grid[i][k] ? 0 : 1;
                  });
                  setGrid(newGrid);
                }}
                key={`${i}-${k}`}
              ></div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default GameGrid;
