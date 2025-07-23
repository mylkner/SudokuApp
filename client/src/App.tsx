import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import type { ErrorDetails } from "./axios/axiosErrorType";
import SudokuCell from "./components/SudokuCell";
import DifficultySelect from "./components/DifficultySelect";
import Spinner from "./components/Spinner";
import Timer from "./components/Timer";
import { useAppContext } from "./context/AppContext";

const App = () => {
    const {
        difficulty,
        board,
        setBoard,
        paused,
        setPaused,
        playing,
        setPlaying,
    } = useAppContext();

    const buttonClass =
        "px-5 py-3 rounded bg-blue-600 cursor-pointer hover:bg-blue-700 transition-colors text-white";

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
        />
    ));

    return (
        <div className="w-full h-screen flex items-center justify-center gap-3">
            <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                    <Timer />
                    {difficulty}
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
            </div>

            <div className="flex flex-col gap-3">
                <DifficultySelect />
                {playing ? (
                    <>
                        <button
                            className={buttonClass}
                            onClick={() => setPaused(!paused)}
                        >
                            {paused ? "Play" : "Pause"}
                        </button>
                        <button
                            className={buttonClass}
                            onClick={() => {
                                setPaused(false);
                                setPlaying(false);
                                setBoard("");
                            }}
                        >
                            Reset
                        </button>
                    </>
                ) : (
                    <button
                        className={buttonClass}
                        onClick={() => mutate()}
                        disabled={playing}
                    >
                        Start
                    </button>
                )}
            </div>
        </div>
    );
};

export default App;
