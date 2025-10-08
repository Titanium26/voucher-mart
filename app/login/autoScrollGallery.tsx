"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect } from "react";

export default function AutoScrollGallery() {
  // Use your existing images in /public/gallery
  const images = [
    "/gallery/img_0.png",
    "/gallery/img_1.png",
    "/gallery/img_2.png",
    "/gallery/img_3.png",
    "/gallery/img_4.png",
    
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  // Auto-play with timer
  useEffect(() => {
  if (!emblaApi) return;

  const autoplay = setInterval(() => {
    emblaApi.scrollNext();
  }, 4000); // 4 seconds per slide

  return () => clearInterval(autoplay); // cleanup
 }, [emblaApi]);


  return (
    <div className="relative w-full h-full">
      {/* Viewport */}
      <div className="overflow-hidden w-full h-full" ref={emblaRef}>
        {/* Track */}
        <div className="flex h-full">
          {images.map((src, i) => (
            <div key={i} className="flex-[0_0_100%] h-full">
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Prev / Next controls */}
      <button
        onClick={scrollPrev}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center"
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        onClick={scrollNext}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center"
        aria-label="Next slide"
      >
        ›
      </button>
    </div>
  );
}
