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
    const [board, setBoard] = useState<string | undefined>();

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

    const boardMatrix: string[][] = board
        ? Array.from({ length: 9 }, (_, i) =>
              board.slice(i * 9, (i + 1) * 9).split("")
          )
        : [];

    return (
        <div className="w-full h-screen flex items-center justify-center">
            <div className="grid grid-cols-9 grid-rows-9 w-fit">
                {boardMatrix.map((row: string[], rowI) =>
                    row.map((_, colI) => (
                        <SudokuCell
                            key={rowI * 9 + colI}
                            index={rowI * 9 + colI}
                            value={
                                boardMatrix[rowI][colI] == "."
                                    ? ""
                                    : boardMatrix[rowI][colI]
                            }
                        />
                    ))
                )}
            </div>
            <div>
                <DifficultySelect setDifficulty={setDifficulty} />
                <button onClick={() => mutate()}>GetBoard</button>
            </div>
        </div>
    );
};

export default App;
