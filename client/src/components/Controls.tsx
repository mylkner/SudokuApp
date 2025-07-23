import type { UseMutateFunction } from "@tanstack/react-query";
import { useAppContext } from "../context/AppContext";
import DifficultySelect from "./DifficultySelect";

const Controls = ({ mutate }: { mutate: UseMutateFunction }) => {
    const { playing, paused, reset, setPaused, setMessage } = useAppContext();

    const buttonClass =
        "px-5 py-3 rounded w-full bg-blue-600 cursor-pointer hover:bg-blue-700 transition-colors text-white";

    return (
        <>
            {playing ? (
                <>
                    <button
                        className={buttonClass}
                        onClick={() => setPaused(!paused)}
                    >
                        {paused ? "Play" : "Pause"}
                    </button>
                    <button className={buttonClass} onClick={reset}>
                        Reset
                    </button>
                </>
            ) : (
                <>
                    <DifficultySelect />
                    <button
                        className={buttonClass}
                        onClick={() => {
                            setMessage("");
                            mutate();
                        }}
                        disabled={playing}
                    >
                        Start
                    </button>
                </>
            )}
        </>
    );
};

export default Controls;
