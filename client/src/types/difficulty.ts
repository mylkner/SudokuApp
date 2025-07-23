export const difficulties = {
    Easy: "Easy",
    Medium: "Medium",
    Hard: "Hard",
    Expert: "Expert",
} as const;

export type Difficulties = keyof typeof difficulties;
