import zduck from "@/assets/Zombie-Duck-no-bg.svg";
import duck from "@/assets/yellow-duck-right.png";

// type GameWelcomeTextProps = {};

const GameWelcomeText: React.FC = () => {
  return (
    <div>
      <div className="flex items-center  gap-2">
        <img src={duck} alt="duck" className="" />
        <img src={zduck} alt="duck" className="w-20 " />
      </div>

      <h1 className="text-2xl font-black font-sans text-yellow-500 italic md:text-4xl">
        The Last of Guss
      </h1>
    </div>
  );
};

export default GameWelcomeText;
