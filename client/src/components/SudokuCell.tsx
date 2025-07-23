import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAppContext } from "../context/AppContext";

interface SudokuCellProps {
    index: number;
    value: string;
}

const SudokuCell = ({ index, value }: SudokuCellProps) => {
    const { board, setBoard, playing, setPlaying } = useAppContext();

    const validate = useMutation({
        mutationFn: async (attemptedInput: number) => {
            const { data: valid } = await axios.post(
                "/api/sudoku/check-input",
                { index, value: attemptedInput },
                { withCredentials: true }
            );

            if (valid) updateBoard(index, attemptedInput.toString());
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
        setPlaying(false);
        await axios.delete("/api/sudoku/remove-saved-board");
    };

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

    return (
        <input
            value={value}
            onChange={handleChange}
            type="text"
            inputMode="numeric"
            pattern="[0-9]"
            className={
                "bg-black h-10 w-10 text-white text-center focus:outline-none " +
                getBorder()
            }
            disabled={value != "" || !playing}
        />
    );
};

export default SudokuCell;
