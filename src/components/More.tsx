import { useState, useEffect, useRef } from "react";
import type { FC } from "react";

type MoreProps = {
  curr_cursor: string;
};
type Image = {
  url: string;
  asset_id: string;
};

const More: FC<MoreProps> = ({ curr_cursor }) => {
  const [images, setImages] = useState<Image[] | []>([]);
  const [cursor, setCursor] = useState<string | null>(curr_cursor);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasNext, setHasNext] = useState<boolean>(true);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const getMore = async () => {
    if (loading || !cursor || !hasNext) return;
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:4321/api/cloudinary-images?next_cursor=${cursor}`,
      );
      const res_obj = await res.json();
      const imgs: Image[] = res_obj.resources;
      const new_cursor: string | null = res_obj.next_cursor;

      setImages([...images, ...imgs]);
      setCursor(new_cursor);
      if (!new_cursor) setHasNext(false);
      setLoading(false);
    } catch (err) {
      console.error("error while fetching images", (err as Error).message);
    }
  };

  useEffect(() => {
    if (cursor === curr_cursor) {
      getMore();
    }
  }, []);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && hasNext) {
          getMore();
        }
      },
      { root: null, rootMargin: "-100px", threshold: 0 },
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [loading, hasNext]);

  return (
    <>
      {images.map((img) => (
        <BlurImage
          key={img.asset_id}
          src={img.url}
          alt={`img ${img.asset_id}`}
        />
      ))}
      <div ref={loadMoreRef}></div>
    </>
  );
};

const BlurImage: FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;

    if (img.complete) {
      setLoaded(true);
    }

    img.onload = () => setLoaded(true);
  }, [src]);

  return (
    <img
      src={src}
      alt={alt}
      className={`h-[80vh] object-cover transition-all duration-700 ease-in-out ${
        loaded ? "opacity-100 blur-0" : "opacity-0 blur-md"
      }`}
    />
  );
};

export default More;
