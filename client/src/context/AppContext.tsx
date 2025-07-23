import {
    createContext,
    useContext,
    useState,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
} from "react";
import { difficulties, type Difficulties } from "../types/difficulty";

interface AppContextState {
    difficulty: Difficulties;
    setDifficulty: Dispatch<SetStateAction<Difficulties>>;
    board: string;
    setBoard: Dispatch<SetStateAction<string>>;
    playing: boolean;
    setPlaying: Dispatch<SetStateAction<boolean>>;
    paused: boolean;
    setPaused: Dispatch<SetStateAction<boolean>>;
    time: number;
    setTime: Dispatch<SetStateAction<number>>;
}

const AppContext = createContext<AppContextState | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
    const [difficulty, setDifficulty] = useState<Difficulties>(
        difficulties.Medium
    );
    const [board, setBoard] = useState<string>("");
    const [playing, setPlaying] = useState<boolean>(false);
    const [paused, setPaused] = useState<boolean>(false);
    const [time, setTime] = useState<number>(0);

    return (
        <AppContext.Provider
            value={{
                difficulty,
                setDifficulty,
                board,
                setBoard,
                playing,
                setPlaying,
                paused,
                setPaused,
                time,
                setTime,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = (): AppContextState => {
    const context = useContext(AppContext);
    if (!context)
        throw new Error("App context must be used within AppContextProvider");
    return context;
};
