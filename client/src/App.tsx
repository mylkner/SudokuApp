import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import type { ErrorDetails } from "./axios/axiosErrorType";
import { difficulties, type Difficulties } from "./types/difficulty";
import SudokuCell from "./components/SudokuCell";
import DifficultySelect from "./components/DifficultySelect";

const App = () => {
    const [difficulty, setDifficulty] = useState<Difficulties>(
        difficulties.Medium
    );
    const [board, setBoard] = useState<string>("");

    const { mutate, isError, isPending, error } = useMutation<
        string,
        AxiosError<ErrorDetails>
    >({
        mutationFn: async () => {
            const { data: boardRes } = await axios.post(
                "/api/sudoku/generate-board",
                {
                    difficulty,
                }
            );
            return boardRes;
        },
        onSuccess: (data) => setBoard(data),
    });

    const updateBoard = (index: number, value: string): void => {
        const newBoard = board.slice(0, index) + value + board.slice(index + 1);
        setBoard(newBoard);
    };

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <div className="grid grid-cols-9 grid-rows-9 w-fit">
                {Array.from({ length: 81 }, (_, i) => (
                    <SudokuCell
                        key={i}
                        index={i}
                        value={board[i] === "." ? "" : board[i] || ""}
                        updateBoard={updateBoard}
                    />
                ))}
            </div>
            <div>
                <DifficultySelect setDifficulty={setDifficulty} />
                <button onClick={() => mutate()}>GetBoard</button>
            </div>
        </div>
    );
};

export default App;
