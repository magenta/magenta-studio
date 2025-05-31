// types/game.ts
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

// styles/game.css