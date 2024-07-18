import React from "react";
import Box from "./components/Box";
import MouseControl from "./components/MouseControl";
import { MatterProvider, canvasDimensions } from "./contexts/MatterContext";
import Boundaries from "./components/Boundries";

const App: React.FC = () => {
  const handleCollision = (pair: Matter.Pair) => {
    console.log('Collision detected!', pair);
  };

  const boxes = Array(20)
    .fill(0)
    .map((item, i) => ({
      x: (i * 10) % 1000,
      y: (i * 10) % 1000,
      width: 30,
      height: 30,
      options: { restitution: 0.1 },
      color: 'blue',
    }));

  return (
    <MatterProvider>
      <div className="App" style={{ overflow: 'hidden' }}>
        <Boundaries />
        {boxes.map((box, index) => (
          <Box key={index} {...box} onCollision={handleCollision} />
        ))}
        <Box x={400} y={200} width={60} height={60} options={{ restitution: 1 }} color="red" onCollision={handleCollision} />
        <Box x={450} y={50} width={80} height={80} options={{ density: 500 }} color="green" onCollision={handleCollision} />
        <Box x={500} y={100} radius={40} options={{ restitution: 0.8 }} color="purple" onCollision={handleCollision} />
        <MouseControl />
      </div>
    </MatterProvider>
  );
};

export default App;
