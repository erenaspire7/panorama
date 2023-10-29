import {
  ArrowRightIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/solid";

export default function Card({ title, onClick }) {
  return (
    <div
      className="relative cursor-pointer text-left"
      onClick={() => (onClick != undefined ? onClick() : null)}
    >
      <div className="bg-white border-2 border-black p-4 relative z-50 hover:text-white hover:bg-teal-500">
        <EllipsisHorizontalIcon className="h-6 w-6" />
        <p className="text-lg">{title}</p>
      </div>
      <div
        className={` bg-black w-full h-full absolute top-1 left-1 z-0`}
      ></div>
    </div>
  );
}
