// MouseControl.tsx
import React, { useEffect } from "react";
import Matter from "matter-js";
import { useMatter } from "../contexts/MatterContext";

const { Composite, Events, Mouse, MouseConstraint, Bodies } = Matter;

const MouseControl: React.FC = () => {
  const { engine, render, world } = useMatter();

  useEffect(() => {
    if (!world || !engine || !render) return;

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.5,
        render: {
          visible: false,
        },
      },
    });

    Composite.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // Handling mouse drag to create new boxes
    Events.on(mouseConstraint, "mousemove", (event) => {
      const mousePosition = event.mouse.position;
      const newBox = Bodies.rectangle(mousePosition.x, mousePosition.y, 50, 50);
      Composite.add(world, newBox);
    });



    // Cleanup
    return () => {
      Composite.remove(world, mouseConstraint);
    };
  }, [world, engine, render]);

  return null;
};

export default MouseControl;
