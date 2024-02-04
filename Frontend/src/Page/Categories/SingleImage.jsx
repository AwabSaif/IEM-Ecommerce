import { Link } from "react-router-dom";

export const SingleImage = ({ to, imgSrc, Alt }) => {
  return (
    <Link
      to={to}
      className="mx-4 flex w-[150px] items-center justify-center  2xl:w-[180px]"
    >
      <img src={imgSrc} alt={Alt} className="w-full h-10" />
    </Link>
  );
};
