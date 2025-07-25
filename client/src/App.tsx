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
    } = useAppContext();

    const { mutate, isPending } = useMutation<string, AxiosError<ErrorDetails>>(
        {
            mutationFn: async () => {
                const { data: boardRes } = await axios.post(
                    "/api/sudoku/generate-board",
                    { difficulty }
                );
                return boardRes;
            },
            onSuccess: (data) => {
                setPlaying(true);
                setBoard(data);
            },
            onError: (err) => setMessage(err.response?.data?.detail),
        }
    );

    const boardCover = (isPending || paused) && (
        <div className="absolute inset-0 bg-white flex justify-center items-center">
            {isPending && <Spinner />}
            {paused && (
                <div
                    className="rounded-full h-1/3 w-1/3 bg-blue-500 flex items-center justify-center cursor-pointer"
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
        <div className="w-full h-screen p-5 flex flex-col items-center justify-center gap-3">
            <div className="flex flex-col gap-1 max-w-[360px] text-white">
                <div className="flex justify-between">
                    <Timer />
                    <span>{difficulty + "  " + mistakes + " / 3"}</span>
                </div>

                <div className="relative grid grid-cols-9 grid-rows-9 w-fit">
                    {boardCover}
                    {boardLayout}
                </div>

                {message && (
                    <p className="font-semibold text-wrap">{message}</p>
                )}
            </div>

            <div className="flex flex-col gap-2 min-w-[360px]">
                <Controls mutate={mutate} />
            </div>
        </div>
    );
};

export default App;
