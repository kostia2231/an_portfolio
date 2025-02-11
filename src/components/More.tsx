import { useState, useEffect } from "react";
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

  const getMore = async () => {
    if (loading || !cursor || !hasNext) return;

    setLoading(true);

    console.log(cursor);
    const res = await fetch(
      `http://localhost:4321/api/cloudinary-images?next_cursor=${cursor}`,
    );
    const res_obj = await res.json();
    const imgs: Image[] = res_obj.resources;
    const new_cursor: string | null = res_obj.next_cursor;

    setImages([...images, ...imgs]);
    setCursor(new_cursor);
    setLoading(false);
    if (!new_cursor) setHasNext(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isBottom =
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 300;
      if (isBottom) getMore();
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [cursor]);

  return (
    <>
      {images.map((img) => (
        <img
          key={img.asset_id}
          src={img.url}
          alt="img"
          className="h-[500px] object-cover"
        />
      ))}
      {loading && <div>Loading</div>}
      <div></div>
    </>
  );
};

export default More;
