import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import type { ErrorDetails } from "./axios/axiosErrorType";
import SudokuCell from "./components/SudokuCell";
import Spinner from "./components/Spinner";
import Timer from "./components/Timer";
import { useAppContext } from "./context/AppContext";
import Controls from "./components/Controls";

const App = () => {
    const {
        difficulty,
        board,
        setBoard,
        paused,
        setPaused,
        setPlaying,
        mistakes,
        message,
        setMessage,
        reset,
    } = useAppContext();

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
        onSuccess: (data) => {
            setPlaying(true);
            setBoard(data);
        },
    });

    const updateBoard = (index: number, value: string): void => {
        const newBoard = board.slice(0, index) + value + board.slice(index + 1);
        setBoard(newBoard);
        checkCompletion(newBoard);
    };

    const checkCompletion = async (board: string): Promise<void> => {
        for (let i = 0; i < 81; i++) {
            if (board[i] === ".") return;
        }
        setMessage(`You won on ${diff} in `);
        reset();
        await axios.delete("/api/sudoku/remove-saved-board");
    };

    const boardCover = (isPending || paused) && (
        <div className="absolute inset-0 bg-black flex justify-center items-center">
            {isPending && <Spinner />}
            {paused && (
                <div
                    className="rounded-full h-1/3 w-1/3 bg-blue-500 flex items-center justify-center"
                    onClick={() => setPaused(false)}
                >
                    <div
                        className="w-0 h-0 ml-2
         border-t-[20px] border-t-transparent
         border-b-[20px] border-b-transparent
         border-l-[40px] border-l-white"
                    />
                </div>
            )}
        </div>
    );

    const boardLayout = Array.from({ length: 81 }, (_, i) => (
        <SudokuCell
            key={i}
            index={i}
            value={board[i] === "." ? "" : board[i] || ""}
            updateBoard={updateBoard}
        />
    ));

    return (
        <div className="w-full h-screen flex items-center justify-center gap-3">
            <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                    <Timer />
                    <span>{difficulty + "  " + mistakes + " / 3"}</span>
                </div>
                <div className="relative grid grid-cols-9 grid-rows-9 w-fit">
                    {boardCover}
                    {boardLayout}
                </div>
                {isError && (
                    <p className="text-red-500 font-semibold">
                        {error.response?.data.detail}
                    </p>
                )}
                {message && <p className="font-semibold">{message}</p>}
            </div>

            {<Controls mutate={mutate} />}
        </div>
    );
};

export default App;
