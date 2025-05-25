import { useEffect, useRef, useState } from "react";

export default function LazyYouTube({ id, title }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" } // start fetching a bit early
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative h-full w-full">
      {show ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          loading="lazy"
          src={`https://www.youtube.com/embed/${id}?rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <img
          src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}
