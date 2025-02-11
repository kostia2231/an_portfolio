import { useState, useEffect, useRef } from "react";
import type { FC } from "react";
type More = {
  curr_cursor: string;
};
export type Image = {
  url: string;
  asset_id: string;
};

const More: FC<More> = ({ curr_cursor }) => {
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

      console.log("s");
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
      { root: null, rootMargin: "0px", threshold: 1.0 },
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [loading, hasNext]);

  return (
    <>
      {images.map((img) => (
        <img
          loading="lazy"
          key={img.asset_id}
          src={img.url}
          alt={`img ${img.asset_id}`}
          className="h-[500px] object-cover"
        />
      ))}
      {loading && <div>Loading</div>}
      <div ref={loadMoreRef}></div>
    </>
  );
};

export default More;
