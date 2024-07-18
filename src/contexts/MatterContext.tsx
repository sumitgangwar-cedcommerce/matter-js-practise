import React, { createContext, useContext, useEffect, useState } from 'react';
import Matter from 'matter-js';

const { Engine, Render, Runner, Events } = Matter;

interface MatterContextType {
  engine: Matter.Engine | null;
  render: Matter.Render | null;
  world: Matter.World | undefined;
}

// Constants for canvas dimensions
const CANVAS_WIDTH = window.innerWidth - 10;
const CANVAS_HEIGHT = window.innerHeight - 10;

const MatterContext = createContext<MatterContextType | undefined>(undefined);

export const MatterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [engine, setEngine] = useState<Matter.Engine | null>(null);
  const [render, setRender] = useState<Matter.Render | null>(null);

  useEffect(() => {
    const engineInstance = Engine.create();
    const renderInstance = Render.create({
      element: document.body,
      engine: engineInstance,
      options: {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        wireframes: false,
      },
    });

    // run the renderer
    Render.run(renderInstance);

    // create runner
    const runner = Runner.create();
    Runner.run(runner, engineInstance);

    // Add collision event to handle the box within boundaries
    Events.on(engineInstance, "collisionStart", (event) => {
      const pairs = event.pairs;
      console.log(...pairs);
    });

    setEngine(engineInstance);
    setRender(renderInstance);

    // cleanup function
    return () => {
      Render.stop(renderInstance);
      Runner.stop(runner);
      Engine.clear(engineInstance);
      renderInstance.canvas.remove();
      renderInstance.textures = {};
    };
  }, []);

  return (
    <MatterContext.Provider value={{ engine, render, world: engine?.world }}>
      {children}
    </MatterContext.Provider>
  );
};

export const useMatter = (): MatterContextType => {
  const context = useContext(MatterContext);
  if (!context) {
    throw new Error('useMatter must be used within a MatterProvider');
  }
  return context;
};

// Export canvas dimensions for use in other components
export const canvasDimensions = {
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
};
