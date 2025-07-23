import { useEffect } from "react";
import { useAppContext } from "../context/AppContext";

const Timer = () => {
    const { time, setTime, playing, paused } = useAppContext();

    useEffect(() => {
        if (!playing) {
            setTime(0);
            return;
        }
        if (paused) return;

        const interval = setInterval(() => setTime((prev) => prev + 1), 1000);
        return () => clearInterval(interval);
    }, [playing, paused, setTime]);

    const formatTime = (): string => {
        const seconds = time % 60;
        const minutes = Math.floor(time / 60) % 60;
        const hours = Math.floor(time / 3600);

        const addPadding = (num: number): string =>
            num < 10 ? `0${num}` : `${num}`;

        return `${addPadding(hours)}:${addPadding(minutes)}:${addPadding(
            seconds
        )}`;
    };

    return <div>{formatTime()}</div>;
};

export default Timer;
