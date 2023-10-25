export default function Button({ icon, text, textSize, onClick }) {
  return (
    <>
      <div className="relative">
        <button
          className={`w-full bg-white flex border-2 border-black py-2 px-4 ${
            textSize ?? "text-sm"
          } space-x-2 z-10 relative items-center`}
          onClick={() => onClick()}
        >
          {text != null ? <span>{text}</span> : ""}
          {icon != null ? <span>{icon}</span> : ""}
        </button>
        <div className="bg-black w-full h-full absolute top-1 left-1 z-0"></div>
      </div>
    </>
  );
}
