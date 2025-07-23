import type { UseMutateFunction } from "@tanstack/react-query";
import { useAppContext } from "../context/AppContext";
import DifficultySelect from "./DifficultySelect";
import axios from "axios";

const Controls = ({ mutate }: { mutate: UseMutateFunction }) => {
    const { playing, paused, reset, setPaused, setMessage } = useAppContext();

    const buttonClass =
        "px-5 py-3 rounded w-full bg-blue-600 cursor-pointer hover:bg-blue-700 transition-colors text-white";

    const handleReset = async () => {
        reset();
        await axios.delete("/api/sudoku/remove-saved-board");
    };

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
                    <button className={buttonClass} onClick={handleReset}>
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
