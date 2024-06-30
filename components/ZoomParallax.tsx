"use client";
import Picture1 from "/public/1.png";
import Picture2 from "/public/2.jpeg";
import Picture3 from "/public/3.png";
import Picture4 from "/public/4.jpg";
import Picture5 from "/public/5.jpg";
import Picture6 from "/public/6.jpg";
import Picture7 from "/public/7.jpeg";
import Image from "next/image";
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

interface ZoomParallaxProps {
  imgs: string[];
}
export default function ZoomParallax({ imgs }: ZoomParallaxProps) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

  const pictures = [
    {
      src: Picture1,
      scale: scale4,
    },
    {
      src: Picture2,
      scale: scale5,
    },
    {
      src: Picture3,
      scale: scale6,
    },
    {
      src: Picture4,
      scale: scale5,
    },
    {
      src: Picture5,
      scale: scale6,
    },
    {
      src: Picture6,
      scale: scale8,
    },
    {
      src: Picture7,
      scale: scale9,
    },
  ];
  return (
    <div ref={container} className="relative h-[300vh]">
      <div className="sticky overflow-hidden top-0 h-[100vh]">
        {imgs.map((src, index) => {
          const scale = [
            scale4,
            scale5,
            scale6,
            scale5,
            scale6,
            scale8,
            scale9,
          ][index % 7];
          return (
            <motion.div key={index} style={{ scale }} className="el">
              <div className="imageContainer">
                <Image
                  src={src}
                  fill
                  alt="image"
                  // placeholder="blur"
                  // blurDataURL=""
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
