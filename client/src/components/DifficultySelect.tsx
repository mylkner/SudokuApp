import type { Dispatch, SetStateAction } from "react";
import { type Difficulties, difficulties } from "../types/difficulty";

interface DifficultySelectProps {
    currentDifficulty: Difficulties;
    setDifficulty: Dispatch<SetStateAction<Difficulties>>;
}

const DifficultySelect = ({
    currentDifficulty,
    setDifficulty,
}: DifficultySelectProps) => {
    const onClick = (difficulty: Difficulties) => setDifficulty(difficulty);

    const difficultyButton = (difficulty: Difficulties) => (
        <button
            className="px-5 py-3 rounded bg-blue-600 cursor-pointer hover:bg-blue-700 transition-colors text-white disabled:bg-blue-400 disabled:cursor-default"
            onClick={() => onClick(difficulty)}
            disabled={currentDifficulty === difficulty}
        >
            {difficulty}
        </button>
    );

    return (
        <div className="flex flex-col gap-2">
            {difficultyButton(difficulties.Easy)}
            {difficultyButton(difficulties.Medium)}
            {difficultyButton(difficulties.Hard)}
            {difficultyButton(difficulties.Expert)}
        </div>
    );
};

export default DifficultySelect;
