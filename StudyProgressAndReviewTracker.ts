// types/study-progress.ts
interface StudyDay {
    topic: string;
    complete: boolean;
    notes: string[];
    dateCompleted?: Date;
}

interface WeekProgress {
    [key: string]: StudyDay;
}

interface StudyProgress {
    currentWeek: number;
    currentDay: number;
    weeks: {
        [key: string]: WeekProgress;
    };
}

// utils/progress-tracker.ts
class ProgressTracker {
    private progress: StudyProgress;
    private readonly storageKey = 'aiStudyProgress';

    constructor() {
        this.progress = this.loadProgress();
    }

    private loadProgress(): StudyProgress {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : this.initializeProgress();
    }

    private initializeProgress(): StudyProgress {
        return {
            currentWeek: 1,
            currentDay: 1,
            weeks: {
                week1: {
                    day1: {
                        topic: "Azure AI Fundamentals",
                        complete: false,
                        notes: []
                    },
                    day2: {
                        topic: "Generative AI Concepts",
                        complete: false,
                        notes: []
                    }
                    // ... additional days
                }
            }
        };
    }

    public updateProgress(week: number, day: number, updates: Partial<StudyDay>): void {
        const weekKey = `week${week}`;
        const dayKey = `day${day}`;

        if (!this.progress.weeks[weekKey]) {
            this.progress.weeks[weekKey] = {};
        }

        this.progress.weeks[weekKey][dayKey] = {
            ...this.progress.weeks[weekKey][dayKey],
            ...updates
        };

        this.saveProgress();
    }

    private saveProgress(): void {
        localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
    }

    public getDayProgress(week: number, day: number): StudyDay | null {
        return this.progress.weeks[`week${week}`]?.[`day${day}`] || null;
    }
}

// components/DailyReview.ts
interface DailyReview {
    theoryLearned: boolean;
    practicalExercises: boolean;
    documentation: boolean;
    questions: string[];
    nextDayPrep: boolean;
}

class DailyReviewTracker {
    private review: DailyReview;

    constructor() {
        this.review = {
            theoryLearned: false,
            practicalExercises: false,
            documentation: false,
            questions: [],
            nextDayPrep: false
        };
    }

    public updateReview(updates: Partial<DailyReview>): void {
        this.review = {
            ...this.review,
            ...updates
        };
    }

    public isComplete(): boolean {
        return Object.values(this.review).every(value =>
            Array.isArray(value) ? value.length > 0 : value === true
        );
    }
}

// utils/project-structure.ts
interface ProjectStructure {
    documentation: string[];
    source: {
        scripts: string[];
        assets: string[];
    };
}

const projectStructure: ProjectStructure = {
    documentation: ['Requirements', 'Design', 'Testing'],
    source: {
        scripts: ['AI', 'MixedReality', 'Integration'],
        assets: ['Models', 'Materials', 'Prefabs']
    }
};

// Example usage:
const tracker = new ProgressTracker();
const dailyReview = new DailyReviewTracker();

// Update progress for Week 1, Day 1
tracker.updateProgress(1, 1, {
    topic: "Azure AI Fundamentals",
    complete: true,
    notes: ["Completed Azure AI services overview"],
    dateCompleted: new Date()
});

// Track daily review
dailyReview.updateReview({
    theoryLearned: true,
    practicalExercises: true,
    questions: ["How does Azure Cognitive Services integrate with custom ML models?"]
});// types/game.ts
interface Player {
    name: string;
    level: number;
    xp: number;
    achievements: Achievement[];
    currentPath: LearningPath;
    inventory: LearningResource[];
    skills: Skill[];
}

interface LearningPath {
    id: string;
    name: string;
    description: string;
    milestones: Milestone[];
    requirements: Requirement[];
}

interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    dateEarned: Date;
}

// components/GameInterface.tsx
import React from 'react';

const GameInterface: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>({
        currentDay: 1,
        currentWeek: 1,
        resources: 100,
        progress: 0,
        events: []
    });

    return (
        <div className="game-container">
        <header className="game-header">
        <StatusBar gameState={gameState} />
    <NavigationMap currentLocation={gameState.progress} />
    </header>
    <main className="game-main">
    <EventLog events={gameState.events} />
    <ActionPanel onAction={handleAction} />
    </main>
    </div>
);
};

// components/LearningChallenge.tsx
const LearningChallenge: React.FC<ChallengeProps> = ({ challenge, onComplete }) => {
    return (
        <div className="challenge-container">
            <h3>{challenge.title}</h3>
            <div className="challenge-description">
        {challenge.description}
        </div>
        <div className="challenge-options">
        {challenge.options.map(option => (
                <button
                    key={option.id}
            onClick={() => handleOptionSelect(option)}
    className="challenge-option"
        >
        {option.text}
        </button>
))}
    </div>
    </div>
);
};

// utils/gameEvents.ts
const gameEvents = {
    AZURE_CHALLENGES: [
        {
            id: 'azure_basics',
            title: 'Azure AI Services Challenge',
            description: 'You encounter a complex AI service integration. Choose your approach:',
            options: [
                {
                    id: 'study',
                    text: 'Study the documentation thoroughly',
                    outcome: { xp: 50, resources: -10, knowledge: 20 }
                },
                {
                    id: 'practice',
                    text: 'Jump into practical implementation',
                    outcome: { xp: 30, resources: -20, skills: 25 }
                }
            ]
        }
    ],
    RANDOM_EVENTS: [
        {
            id: 'system_crash',
            title: 'System Crash!',
            description: 'Your development environment crashes. What do you do?',
            options: [
                {
                    id: 'backup',
                    text: 'Restore from backup',
                    outcome: { resources: -20, time: -1 }
                },
                {
                    id: 'rebuild',
                    text: 'Rebuild from scratch',
                    outcome: { xp: 30, resources: -40, skills: 15 }
                }
            ]
        }
    ]
};

// styles/game.css// types/study-progress.ts
interface StudyDay {
    topic: string;
    complete: boolean;
    notes: string[];
    dateCompleted?: Date;
}

interface WeekProgress {
    [key: string]: StudyDay;
}

interface StudyProgress {
    currentWeek: number;
    currentDay: number;
    weeks: {
        [key: string]: WeekProgress;
    };
}

// utils/progress-tracker.ts
class ProgressTracker {
    private progress: StudyProgress;
    private readonly storageKey = 'aiStudyProgress';

    constructor() {
        this.progress = this.loadProgress();
    }

    private loadProgress(): StudyProgress {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : this.initializeProgress();
    }

    private initializeProgress(): StudyProgress {
        return {
            currentWeek: 1,
            currentDay: 1,
            weeks: {
                week1: {
                    day1: {
                        topic: "Azure AI Fundamentals",
                        complete: false,
                        notes: []
                    },
                    day2: {
                        topic: "Generative AI Concepts",
                        complete: false,
                        notes: []
                    }
                    // ... additional days
                }
            }
        };
    }

    public updateProgress(week: number, day: number, updates: Partial<StudyDay>): void {
        const weekKey = `week${week}`;
        const dayKey = `day${day}`;

        if (!this.progress.weeks[weekKey]) {
            this.progress.weeks[weekKey] = {};
        }

        this.progress.weeks[weekKey][dayKey] = {
            ...this.progress.weeks[weekKey][dayKey],
            ...updates
        };

        this.saveProgress();
    }

    private saveProgress(): void {
        localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
    }

    public getDayProgress(week: number, day: number): StudyDay | null {
        return this.progress.weeks[`week${week}`]?.[`day${day}`] || null;
    }
}

// components/DailyReview.ts
interface DailyReview {
    theoryLearned: boolean;
    practicalExercises: boolean;
    documentation: boolean;
    questions: string[];
    nextDayPrep: boolean;
}

class DailyReviewTracker {
    private review: DailyReview;

    constructor() {
        this.review = {
            theoryLearned: false,
            practicalExercises: false,
            documentation: false,
            questions: [],
            nextDayPrep: false
        };
    }

    public updateReview(updates: Partial<DailyReview>): void {
        this.review = {
            ...this.review,
            ...updates
        };
    }

    public isComplete(): boolean {
        return Object.values(this.review).every(value => 
            Array.isArray(value) ? value.length > 0 : value === true
        );
    }
}

// utils/project-structure.ts
interface ProjectStructure {
    documentation: string[];
    source: {
        scripts: string[];
        assets: string[];
    };
}

const projectStructure: ProjectStructure = {
    documentation: ['Requirements', 'Design', 'Testing'],
    source: {
        scripts: ['AI', 'MixedReality', 'Integration'],
        assets: ['Models', 'Materials', 'Prefabs']
    }
};

// Example usage:
const tracker = new ProgressTracker();
const dailyReview = new DailyReviewTracker();

// Update progress for Week 1, Day 1
tracker.updateProgress(1, 1, {
    topic: "Azure AI Fundamentals",
    complete: true,
    notes: ["Completed Azure AI services overview"],
    dateCompleted: new Date()
});

// Track daily review
dailyReview.updateReview({
    theoryLearned: true,
    practicalExercises: true,
    questions: ["How does Azure Cognitive Services integrate with custom ML models?"]
});