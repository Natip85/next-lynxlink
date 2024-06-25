import Image from "next/image";
import { useEffect, useState } from "react";
import { Progress } from "../ui/progress";

type Props = { finished: boolean };
const loadingTexts = [
  "Crafting your product with care...",
  "Polishing your new creation...",
  "Bringing your product to life...",
  "Customizing your masterpiece...",
  "Preparing your product for the world...",
  "Shaping your vision into reality...",
];
export default function LoadingCreateProduct({ finished }: Props) {
  const [progress, setProgress] = useState(10);
  const [loadingText, setLoadingText] = useState(loadingTexts[0]);
  console.log("fdfgfgfg");

  useEffect(() => {
    const interval = setInterval(() => {
      let randomIndex = Math.floor(Math.random() * loadingTexts.length);
      setLoadingText(loadingTexts[randomIndex]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (finished) return 100;
        if (prev === 100) {
          return 0;
        }
        if (Math.random() < 0.1) {
          return prev + 2;
        }
        return prev + 0.5;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [finished]);
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-[70vw] md:w-[60vw] flex flex-col items-center">
      <Image
        src={"/createProductLoading.gif"}
        width={400}
        height={400}
        alt="loading"
      />
      <Progress value={progress} className="w-full mt-4" />
      <h1 className="mt-2 text-xl">{loadingText}</h1>
    </div>
  );
}
