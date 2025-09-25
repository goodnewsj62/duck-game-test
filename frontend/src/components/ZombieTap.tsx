import image from "@/assets/Zombie-Duck-no-bg.svg";

type ZombieTapProps = {
  onClick: () => void;
};

const ZombieTap: React.FC<ZombieTapProps> = ({ onClick }) => {
  return (
    <div
      className="font-mono flex items-center justify-center  relative text-xs leading-none select-none mb-8  cursor-pointer"
      onClick={onClick}
    >
      <img src={image} alt="duck" className="w-60" />
      <button
        type="button"
        className="text-2xl text-white font-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-[rgba(0,0,0,0.4)] rounded-2xl"
      >
        Tap
      </button>
    </div>
  );
};

export default ZombieTap;
