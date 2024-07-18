import React, { useEffect } from "react";
import Matter from "matter-js";
import { useMatter } from "../contexts/MatterContext";

const { Bodies, Composite, Events } = Matter;

interface BoxProps {
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  color?: string;
  options?: Matter.IChamferableBodyDefinition;
  onCollision?: (pair: Matter.Pair) => void;
}

const Box: React.FC<BoxProps> = ({ x, y, width, height, radius, color, options, onCollision }) => {
  const { engine, world } = useMatter();

  useEffect(() => {
    if (!world || !engine) return;

    let body:Matter.Body;
    if (radius) {
      body = Bodies.circle(x, y, radius, { ...options, render: { fillStyle: color } });
    } else {
      body = Bodies.rectangle(x, y, width || 50, height || 50, { ...options, render: { fillStyle: color } });
    }
    Composite.add(world, body);

    if (onCollision) {
      const collisionHandler = (event: Matter.IEventCollision<Matter.Engine>) => {
        event.pairs.forEach((pair) => {
          if (pair.bodyA === body || pair.bodyB === body) {
            onCollision(pair);
          }
        });
      };
      Events.on(engine, "collisionStart", collisionHandler);

      // Cleanup
      return () => {
        Events.off(engine, "collisionStart", collisionHandler);
      };
    }

    return () => {
      Composite.remove(world, body);
    };
  }, [world, engine, x, y, width, height, radius, color, options, onCollision]);

  return null; // This component does not render anything itself
};

export default Box;
