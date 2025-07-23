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
    const [playing, setPlaying] = useState<boolean>(false);

    const { mutate, isPending } = useMutation<string, AxiosError<ErrorDetails>>(
        {
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
        }
    );

    const updateBoard = (index: number, value: string): void => {
        const newBoard = board.slice(0, index) + value + board.slice(index + 1);
        setBoard(newBoard);
        checkCompletion(newBoard);
    };

    const checkCompletion = async (board: string): Promise<void> => {
        for (let i = 0; i < 81; i++) {
            if (board[i] === ".") return;
        }
        setPlaying(false);
        await axios.delete("/api/sudoku/remove-saved-board");
    };

    return (
        <div className="w-full h-screen flex items-center justify-center gap-3">
            <div className="grid grid-cols-9 grid-rows-9 w-fit">
                {!isPending
                    ? Array.from({ length: 81 }, (_, i) => (
                          <SudokuCell
                              key={i}
                              index={i}
                              value={board[i] === "." ? "" : board[i] || ""}
                              updateBoard={updateBoard}
                          />
                      ))
                    : ""}
            </div>
            <div>
                <DifficultySelect
                    currentDifficulty={difficulty}
                    setDifficulty={setDifficulty}
                    playing={playing}
                />
                <button
                    onClick={() => {
                        setPlaying(true);
                        mutate();
                    }}
                    disabled={playing}
                >
                    GetBoard
                </button>
            </div>
        </div>
    );
};

export default App;
