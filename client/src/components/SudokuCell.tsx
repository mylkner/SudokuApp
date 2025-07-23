import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAppContext } from "../context/AppContext";

interface SudokuCellProps {
    index: number;
    value: string;
    updateBoard: (index: number, value: string) => void;
}

const SudokuCell = ({ index, value, updateBoard }: SudokuCellProps) => {
    const { playing, mistakes, setMistakes, reset, setMessage } =
        useAppContext();

    const validate = useMutation({
        mutationFn: async (attemptedInput: number) => {
            const { data: valid } = await axios.post(
                "/api/sudoku/check-input",
                { index, value: attemptedInput },
                { withCredentials: true }
            );

            if (valid) {
                updateBoard(index, attemptedInput.toString());
            } else {
                const newMistakes = mistakes + 1;
                setMistakes(newMistakes);
                if (newMistakes === 3) {
                    setMessage("You lost. Try again?");
                    reset();
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
