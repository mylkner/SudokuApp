import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";

interface SudokuCellProps {
    index: number;
    value: string;
}

const SudokuCell = ({ index, value }: SudokuCellProps) => {
    const [input, setInput] = useState<string>(value);

    const validate = useMutation({
        mutationFn: async (attemptedInput: number) => {
            const { data: valid } = await axios.post(
                "/api/sudoku/check-input",
                { index, value: attemptedInput },
                { withCredentials: true }
            );

            if (valid) setInput(attemptedInput.toString());
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const attemptedInput = e.target.value;
        if (!/^[1-9]$/.test(attemptedInput)) return;
        validate.mutate(parseInt(attemptedInput));
    };

    return (
        <input
            value={input}
            onChange={handleChange}
            type="text"
            inputMode="numeric"
            pattern="[0-9]"
            className="bg-black m-1 h-8 w-8 text-white text-center"
            disabled={input != ""}
        />
    );
};

export default SudokuCell;
