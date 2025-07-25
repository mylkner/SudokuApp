import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { useState } from "react";

interface SudokuCellProps {
    index: number;
    value: string;
}

const SudokuCell = ({ index, value }: SudokuCellProps) => {
    const {
        playing,
        mistakes,
        setMistakes,
        reset,
        setMessage,
        board,
        setBoard,
        difficulty,
        time,
    } = useAppContext();
    const [bgColor, setBgColor] = useState("bg-white");

    const validate = useMutation({
        mutationFn: async (attemptedInput: number) => {
            const { data: valid } = await axios.post(
                "/api/sudoku/check-input",
                { index, value: attemptedInput },
                { withCredentials: true }
            );

            if (valid) {
                updateBoard(index, attemptedInput.toString());
                setBgColor("bg-green-500");
                setTimeout(() => setBgColor("bg-white"), 3000);
            } else {
                setBgColor("bg-red-500");
                setTimeout(() => setBgColor("bg-white"), 3000);
                const newMistakes = mistakes + 1;
                setMistakes(newMistakes);
                if (newMistakes === 3) {
                    setMessage("You lost. Try again?");
                    reset();
                    await axios.delete("/api/sudoku/remove-saved-board");
                }
            }
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const attemptedInput = e.target.value;
        if (!/^[1-9]$/.test(attemptedInput)) return;
        validate.mutate(parseInt(attemptedInput));
    };

    const getBorder = (): string => {
        const row: number = Math.floor(index / 9);
        const col: number = index % 9;
        let border: string = "border-blue-500";

        border += row % 3 === 0 ? " border-t-4" : " border-t";
        border += col % 3 === 2 ? " border-r-4" : " border-r";
        if (col === 0) border += " border-l-4";
        if (row === 8) border += " border-b-4";

        return border;
    };

    const updateBoard = (index: number, value: string): void => {
        const newBoard = board.slice(0, index) + value + board.slice(index + 1);
        setBoard(newBoard);
        checkCompletion(newBoard);
    };

    const checkCompletion = async (board: string): Promise<void> => {
        for (let i = 0; i < 81; i++) {
            if (board[i] === ".") return;
        }
        setMessage(
            `You won on ${
                difficulty.slice(0, 1).toLowerCase() + difficulty.slice(1)
            } mode in ${formatFinishTime(time)}.`
        );
        reset();
        await axios.delete("/api/sudoku/remove-saved-board");
    };

    const formatFinishTime = (finishTime: number): string => {
        const seconds = finishTime % 60;
        const minutes = Math.floor(finishTime / 60) % 60;
        const hours = Math.floor(finishTime / 3600);

        const formatName = (type: string, num: number) => {
            return `${num} ${num === 1 ? type.slice(0, -1) : type}`;
        };

        return `${formatName("hours", hours)}, ${formatName(
            "minutes",
            minutes
        )} and ${formatName("seconds", seconds)}`;
    };

    return (
        <input
            value={value}
            onChange={handleChange}
            type="text"
            inputMode="numeric"
            pattern="[0-9]"
            className={`h-10 w-10 text-black text-center focus:outline-none ${getBorder()} ${bgColor}`}
            disabled={value != "" || !playing}
        />
    );
};

export default SudokuCell;
