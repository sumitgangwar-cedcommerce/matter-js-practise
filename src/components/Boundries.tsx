import React, { useEffect } from "react";
import Matter from "matter-js";
import { useMatter } from "../contexts/MatterContext";

const { Bodies, Composite } = Matter;

const Boundaries: React.FC = () => {
  const { world } = useMatter();

  useEffect(() => {
    if (!world) return;

    const thickness = 50;
    const width = window.innerWidth -50 ;
    const height = window.innerHeight - 50;

    const boundaries = [
      Bodies.rectangle(width / 2, (-thickness / 2) + 50, width, thickness, {
        isStatic: true,
        render: { fillStyle: "green" },
      }),
      Bodies.rectangle(width / 2, height + (thickness / 2) - 50, width, thickness, {
        isStatic: true,
        render: { fillStyle: "green" },
      }),
      Bodies.rectangle((-thickness / 2)+ 50, height / 2, thickness, height, {
        isStatic: true,
        render: { fillStyle: "blue" },
      }),
      Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, {
        isStatic: true,
        render: { fillStyle: "purpel" },
      }),
    ];

    Composite.add(world, boundaries);

    return () => {
      Composite.remove(world, boundaries);
    };
  }, [world]);

  return null; // This component does not render anything itself
};

export default Boundaries;
