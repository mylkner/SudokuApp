import type { Dispatch, SetStateAction } from "react";
import { type Difficulties, difficulties } from "../types/difficulty";

interface DifficultySelectProps {
    currentDifficulty: Difficulties;
    setDifficulty: Dispatch<SetStateAction<Difficulties>>;
    playing: boolean;
}

const DifficultySelect = ({
    currentDifficulty,
    setDifficulty,
    playing,
}: DifficultySelectProps) => {
    const onClick = (difficulty: Difficulties) => setDifficulty(difficulty);

    const difficultyButton = (difficulty: Difficulties) => (
        <button
            className="px-5 py-3 rounded bg-blue-600 cursor-pointer hover:bg-blue-700 transition-colors text-white disabled:bg-blue-400 disabled:cursor-default"
            onClick={() => onClick(difficulty)}
            disabled={currentDifficulty === difficulty || playing}
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
