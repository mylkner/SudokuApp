import type { Dispatch, SetStateAction } from "react";
import { type Difficulties, difficulties } from "../types/difficulty";

interface DifficultySelectProps {
    setDifficulty: Dispatch<SetStateAction<Difficulties>>;
}

const DifficultySelect = ({ setDifficulty }: DifficultySelectProps) => {
    return <div>DifficultySelect</div>;
};

export default DifficultySelect;
