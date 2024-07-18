import { useEffect, useState } from "react";
import Matter from "matter-js";

const { Engine, Render, Runner, Composite, Bodies, Events } = Matter;

interface UseWorldReturn {
  engine: Matter.Engine | null;
  render: Matter.Render | null;
  world: Matter.World | undefined;
}

const useWorld = (): UseWorldReturn => {
  const [engine, setEngine] = useState<Matter.Engine | null>(null);
  const [render, setRender] = useState<Matter.Render | null>(null);

  useEffect(() => {
    const engineInstance = Engine.create();
    const renderInstance = Render.create({
      element: document.body,
      engine: engineInstance,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
      },
    });

    // Create boundaries with sufficient thickness
    const thickness = 50;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const boundaries = [
      Bodies.rectangle(width / 2, -thickness / 2, width, thickness, { isStatic: true }),
      Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, { isStatic: true }),
      Bodies.rectangle(-thickness / 2, height / 2, thickness, height, { isStatic: true }),
      Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, { isStatic: true }),
    ];

    Composite.add(engineInstance.world, boundaries);

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
      Composite.clear(engineInstance.world, false);
      Engine.clear(engineInstance);
      renderInstance.canvas.remove();
      renderInstance.textures = {};
    };
  }, []);

  return { engine, render, world: engine?.world };
};

export default useWorld;
