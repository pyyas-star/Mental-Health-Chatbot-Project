import { useState, useEffect, useRef } from 'react';
import '../assets/css/breathing.css';

const BreathingExercise = () => {
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState('inhale'); // inhale, hold, exhale
    const [timeLeft, setTimeLeft] = useState(4);
    const [pattern, setPattern] = useState('478'); // 478, box, deep
    const [sessionCount, setSessionCount] = useState(0);
    const intervalRef = useRef(null);

    const patterns = {
        '478': { inhale: 4, hold: 7, exhale: 8, name: '4-7-8 Breathing' },
        'box': { inhale: 4, hold: 4, exhale: 4, hold2: 4, name: 'Box Breathing' },
        'deep': { inhale: 5, hold: 0, exhale: 5, name: 'Deep Breathing' },
    };

    const currentPattern = patterns[pattern];

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            intervalRef.current = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (isActive && timeLeft === 0) {
            // Move to next phase
            if (phase === 'inhale') {
                setPhase('hold');
                setTimeLeft(currentPattern.hold);
            } else if (phase === 'hold') {
                setPhase('exhale');
                setTimeLeft(currentPattern.exhale);
            } else {
                // Complete cycle
                setPhase('inhale');
                setTimeLeft(currentPattern.inhale);
                setSessionCount(sessionCount + 1);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearTimeout(intervalRef.current);
            }
        };
    }, [isActive, timeLeft, phase, currentPattern, sessionCount]);

    const handleStart = () => {
        setIsActive(true);
        setPhase('inhale');
        setTimeLeft(currentPattern.inhale);
        setSessionCount(0);
    };

    const handleStop = () => {
        setIsActive(false);
        setPhase('inhale');
        setTimeLeft(currentPattern.inhale);
        if (intervalRef.current) {
            clearTimeout(intervalRef.current);
        }
    };

    const getCircleSize = () => {
        if (phase === 'inhale') return '100%';
        if (phase === 'hold') return '100%';
        if (phase === 'exhale') return '60%';
        return '80%';
    };

    const getPhaseText = () => {
        if (phase === 'inhale') return 'Breathe In';
        if (phase === 'hold') return 'Hold';
        if (phase === 'exhale') return 'Breathe Out';
        return 'Ready';
    };

    return (
        <div className="breathing-container">
            <div className="breathing-header">
                <h2>🌬️ Breathing Exercise</h2>
                <p>Take a moment to breathe and relax</p>
            </div>

            <div className="pattern-selector">
                <label>Select Pattern:</label>
                <div className="pattern-buttons">
                    {Object.entries(patterns).map(([key, value]) => (
                        <button
                            key={key}
                            className={`pattern-btn ${pattern === key ? 'active' : ''}`}
                            onClick={() => {
                                setPattern(key);
                                handleStop();
                            }}
                            disabled={isActive}
                        >
                            {value.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="breathing-exercise">
                <div className="breathing-circle-wrapper">
                    <div
                        className={`breathing-circle ${phase}`}
                        style={{
                            width: getCircleSize(),
                            height: getCircleSize(),
                            transition: 'all 1s ease-in-out',
                        }}
                    >
                        <div className="circle-content">
                            <div className="phase-text">{getPhaseText()}</div>
                            <div className="time-display">{timeLeft}</div>
                        </div>
                    </div>
                </div>

                <div className="breathing-controls">
                    {!isActive ? (
                        <button className="start-btn" onClick={handleStart}>
                            Start Breathing Exercise
                        </button>
                    ) : (
                        <button className="stop-btn" onClick={handleStop}>
                            Stop
                        </button>
                    )}
                </div>

                {sessionCount > 0 && (
                    <div className="session-info">
                        <p>Completed {sessionCount} breathing cycle{sessionCount !== 1 ? 's' : ''}</p>
                    </div>
                )}

                <div className="breathing-instructions">
                    <h3>Instructions:</h3>
                    <ul>
                        <li>Find a comfortable position</li>
                        <li>Follow the circle animation</li>
                        <li>Breathe in as the circle expands</li>
                        <li>Hold your breath when indicated</li>
                        <li>Breathe out as the circle contracts</li>
                        <li>Repeat for several cycles</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default BreathingExercise;

