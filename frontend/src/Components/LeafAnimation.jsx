import { motion } from "motion/react";

const LeafAnimation = ({
  src,
  top,
  left,
  triggerFall,
  size,
  mouseShiftX = 0,
  mouseShiftY = 0,
}) => {
  return (
    <motion.img
      src={src}
      initial={{ y: -200, opacity: 0 }}
      animate={
        triggerFall
          ? {
              y: 500 + mouseShiftY,
              opacity: 1,
              rotate: [0, 15, -10, 5],
              x: mouseShiftX,
            }
          : {
              x: mouseShiftX,
              y: mouseShiftY,
            }
      }
      transition={{
        duration: 1.2,
        ease: "easeInOut",
      }}
      className="absolute z-50"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        width: size,
        height: size,
        pointerEvents: "none",
      }}
    />
  );
};

export default LeafAnimation;
