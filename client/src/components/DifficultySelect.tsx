import { useAppContext } from "../context/AppContext";
import { type Difficulties, difficulties } from "../types/difficulty";

const DifficultySelect = () => {
    const {
        difficulty: currentDifficulty,
        setDifficulty,
        playing,
    } = useAppContext();

    const difficultyButton = (difficulty: Difficulties) => (
        <button
            className="px-5 py-3 rounded bg-blue-600 cursor-pointer hover:bg-blue-700 transition-colors text-white disabled:bg-blue-400 disabled:cursor-default"
            onClick={() => setDifficulty(difficulty)}
            disabled={difficulty === currentDifficulty || playing}
        >
            {difficulty}
        </button>
    );

    return (
        <>
            {difficultyButton(difficulties.Easy)}
            {difficultyButton(difficulties.Medium)}
            {difficultyButton(difficulties.Hard)}
            {difficultyButton(difficulties.Expert)}
        </>
    );
};

export default DifficultySelect;
