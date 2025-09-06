import React, { useState, useEffect, useMemo, useCallback } from 'react';
import FlowerPot from './components/FlowerPot';
import InfoButton from './components/InfoButton';
import InfoModal from './components/InfoModal';
import type { GameState, Problem, UserAnswers, UserProgression, PotStatus, PotStatusValue, FlowerType, Difficulty } from './types';

// --- MAIN APPLICATION COMPONENT ---
export default function App() {
    // --- GAME STATE ---
    const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
    const [level, setLevel] = useState<number>(1);
    const [problem, setProblem] = useState<Problem>({
        fullSequence: [],
        displaySequence: [],
        missingIndexes: [],
        type: '',
        reason: 0,
    });
    const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
    const [userProgression, setUserProgression] = useState<UserProgression>({ type: '', reason: '' });
    const [gameState, setGameState] = useState<GameState>('playing');
    const [potStatus, setPotStatus] = useState<PotStatus>({});
    const [progressionStatus, setProgressionStatus] = useState<{
        type: PotStatusValue | null;
        reason: PotStatusValue | null;
    }>({ type: null, reason: null });
    const [history, setHistory] = useState<Array<{ userAnswers: UserAnswers; userProgression: UserProgression }>>([]);
    const [flowerType, setFlowerType] = useState<FlowerType>('sunflower');
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    const resetGameState = useCallback((clearHistory = true) => {
        setUserAnswers({});
        setUserProgression({ type: '', reason: '' });
        setGameState('playing');
        setPotStatus({});
        setProgressionStatus({ type: null, reason: null });
        if(clearHistory) setHistory([]);
    }, []);

    // --- PROBLEM GENERATION LOGIC ---
    const generateProblem = useCallback((currentLevel: number, diff: Difficulty) => {
        const type = Math.random() < 0.5 ? 'PA' : 'PG';
        let length = 5;
        let start: number;
        let reason: number;
        let numMissing = 1;

        // --- Difficulty Settings ---
        switch (diff) {
            case 'Iniciante':
                numMissing = 1;
                length = 5;
                if (type === 'PA') {
                    reason = Math.floor(Math.random() * 4) + 2; // Only positive reasons
                    start = Math.floor(Math.random() * 10) + 1;
                } else { // PG
                    reason = Math.floor(Math.random() * 2) + 2; // Only 2 or 3
                    start = Math.floor(Math.random() * 5) + 1;
                }
                break;
            case 'Intermediário':
                numMissing = 2;
                length = 5;
                 if (type === 'PA') {
                    const baseReason = Math.floor(Math.random() * 4) + 2;
                    reason = Math.random() < 0.5 ? baseReason : -baseReason; // Positive or negative
                    start = reason < 0 ? Math.floor(Math.random() * 15) + 20 : Math.floor(Math.random() * 10) + 1;
                } else { // PG
                    const possibleReasons = [2, 3, 0.5];
                    reason = possibleReasons[Math.floor(Math.random() * possibleReasons.length)];
                    start = reason === 0.5 ? (Math.floor(Math.random() * 5) + 4) * 8 : Math.floor(Math.random() * 5) + 1;
                }
                break;
            case 'Avançado':
                numMissing = Math.random() < 0.5 ? 2 : 3;
                length = 6;
                if (type === 'PA') {
                    const baseReason = Math.floor(Math.random() * 8) + 3;
                    reason = Math.random() < 0.5 ? baseReason : -baseReason;
                    start = reason < 0 ? Math.floor(Math.random() * 20) + 40 : Math.floor(Math.random() * 15) + 1;
                } else { // PG
                    const possibleReasons = [-2, -3, 1.5, 0.5];
                    reason = possibleReasons[Math.floor(Math.random() * possibleReasons.length)];
                    start = (reason === 0.5 || reason === 1.5) ? (Math.floor(Math.random() * 4) + 2) * 4 : Math.floor(Math.random() * 5) + 2;
                }
                break;
        }


        const fullSequence: number[] = [start];
        for (let i = 1; i < length; i++) {
            let nextTerm: number;
            if (type === 'PA') {
                nextTerm = fullSequence[i - 1] + reason;
            } else {
                nextTerm = fullSequence[i - 1] * reason;
            }
            // Use toPrecision to handle floating point inaccuracies
            fullSequence.push(parseFloat(nextTerm.toPrecision(15)));
        }

        const missingIndexes: number[] = [];
        const possibleIndexes = Array.from({length: length -1}, (_, i) => i + 1); // Avoid hiding the first term
        while (missingIndexes.length < numMissing && possibleIndexes.length > 0) {
            const indexInPossible = Math.floor(Math.random() * possibleIndexes.length);
            const randomIndex = possibleIndexes.splice(indexInPossible, 1)[0];
            missingIndexes.push(randomIndex);
        }
        missingIndexes.sort((a,b) => a - b);


        const displaySequence = fullSequence.map((term, index) => (missingIndexes.includes(index) ? null : term));
        
        const flowers: FlowerType[] = ['sunflower', 'rose', 'tulip'];
        const newFlower = flowers[Math.floor(Math.random() * flowers.length)];
        setFlowerType(newFlower);

        setProblem({ type, reason, fullSequence, displaySequence, missingIndexes });
        resetGameState();
    }, [resetGameState]);

    // --- EFFECTS ---
    useEffect(() => {
        if (difficulty) {
            generateProblem(level, difficulty);
        }
    }, [level, difficulty, generateProblem]);

    const pushToHistory = () => {
        setHistory(prev => [...prev, { userAnswers, userProgression }]);
    };

    // --- INPUT HANDLERS ---
    const handleInputChange = (index: number, value: string) => {
        pushToHistory();
        setUserAnswers(prev => ({ ...prev, [index]: value }));
    };

    const handleReasonChange = (value: string) => {
        pushToHistory();
        setUserProgression(prev => ({ ...prev, reason: value }));
    };

    const handleTypeChange = (value: 'PA' | 'PG') => {
        pushToHistory();
        setUserProgression(prev => ({ ...prev, type: value }));
    };
    
    // --- DIFFICULTY SELECTION ---
    const handleDifficultySelect = (diff: Difficulty) => {
        setDifficulty(diff);
        setLevel(1);
        resetGameState(true);
    };

    const returnToMenu = () => {
        setDifficulty(null);
        setLevel(1);
    }

    // --- VERIFICATION LOGIC ---
    const checkAnswer = () => {
        let allCorrect = true;
        const newPotStatus: PotStatus = {};

        problem.missingIndexes.forEach(index => {
            const userAnswer = parseFloat(userAnswers[index]);
            const correctAnswer = problem.fullSequence[index];
            if (!isNaN(userAnswer) && userAnswer === correctAnswer) {
                newPotStatus[index] = 'correct';
            } else {
                newPotStatus[index] = 'incorrect';
                allCorrect = false;
            }
        });

        const isTypeCorrect = userProgression.type === problem.type;
        const isReasonCorrect = parseFloat(userProgression.reason) === problem.reason;

        setProgressionStatus({
            type: isTypeCorrect ? 'correct' : 'incorrect',
            reason: isReasonCorrect ? 'correct' : 'incorrect',
        });

        if (!isTypeCorrect || !isReasonCorrect) {
            allCorrect = false;
        }
        
        setPotStatus(newPotStatus);
        setGameState(allCorrect ? 'correct' : 'incorrect');
    };

    // --- GAME CONTROL FUNCTIONS ---
    const handleUndo = useCallback(() => {
        if (history.length === 0) return;

        const lastState = history[history.length - 1];
        setUserAnswers(lastState.userAnswers);
        setUserProgression(lastState.userProgression);
        setHistory(prev => prev.slice(0, -1));

        if (gameState !== 'playing') {
            setGameState('playing');
            setPotStatus({});
            setProgressionStatus({ type: null, reason: null });
        }
    }, [history, gameState]);

    const startNextLevel = () => {
        setLevel(prev => prev + 1);
    };

    // --- DERIVED STATE & CLASSES FOR UI ---
    const feedback = useMemo(() => {
        if (gameState === 'correct') {
            return { message: 'Excelente! Padrão correto!', color: 'text-green-600' };
        }
        if (gameState === 'incorrect') {
            return { message: 'Hmm, algo não está certo. Tente novamente!', color: 'text-red-500' };
        }
        return { message: '', color: '' };
    }, [gameState]);

    const typeContainerClass = useMemo(() => {
        if (progressionStatus.type === 'correct') return 'bg-green-100 rounded-lg animate-grow';
        if (progressionStatus.type === 'incorrect') return 'bg-red-100 rounded-lg animate-shake';
        return '';
    }, [progressionStatus.type]);

    const reasonInputClass = useMemo(() => {
        if (progressionStatus.reason === 'correct') return 'border-green-500 bg-green-100 ring-2 ring-green-300';
        if (progressionStatus.reason === 'incorrect') return 'border-red-500 bg-red-100 ring-2 ring-red-300 animate-shake';
        return 'border-gray-300';
    }, [progressionStatus.reason]);

    // --- RENDER LOGIC ---

    // Difficulty Selection Screen
    if (!difficulty) {
        return (
            <div className="relative min-h-screen flex items-center justify-center p-4" style={{fontFamily: "'Nunito', sans-serif"}}>
                <InfoButton onClick={() => setIsInfoModalOpen(true)} />
                <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
                <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border-4 border-green-700 p-8 text-center">
                     <h1 className="text-3xl md:text-5xl font-extrabold text-green-800 mb-4">O Jardineiro das Progressões</h1>
                     <p className="text-gray-600 mt-2 text-xl mb-8">Escolha sua dificuldade para começar!</p>
                     <div className="space-y-4">
                         <button 
                            onClick={() => handleDifficultySelect('Iniciante')}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg text-xl transition-transform transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300">
                                <h3 className="font-bold text-2xl">Iniciante</h3>
                                <p className="font-normal text-sm">Progressões simples com números positivos.</p>
                         </button>
                         <button 
                             onClick={() => handleDifficultySelect('Intermediário')}
                             className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg text-xl transition-transform transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300">
                                 <h3 className="font-bold text-2xl">Intermediário</h3>
                                 <p className="font-normal text-sm">Introduz números negativos e frações.</p>
                         </button>
                         <button 
                             onClick={() => handleDifficultySelect('Avançado')}
                             className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg text-xl transition-transform transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-purple-300">
                                 <h3 className="font-bold text-2xl">Avançado</h3>
                                 <p className="font-normal text-sm">Sequências longas e razões complexas.</p>
                         </button>
                     </div>
                </div>
            </div>
        );
    }

    // Main Game Screen
    return (
        <div className="relative min-h-screen flex items-center justify-center p-4" style={{fontFamily: "'Nunito', sans-serif"}}>
            <InfoButton onClick={() => setIsInfoModalOpen(true)} />
            <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border-4 border-green-700 p-6 md:p-8 text-center">
                <header className="mb-8">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-green-800">O Jardineiro das Progressões</h1>
                    <p className="text-gray-600 mt-2 text-lg">Plante as flores corretas para completar os padrões!</p>
                </header>

                <main className="p-6 bg-lime-100 rounded-lg">
                    <h2 className="text-xl md:text-2xl font-bold text-green-900 mb-6">Nível {level} ({difficulty})</h2>

                    <div className="flex justify-center items-end gap-2 md:gap-4 flex-wrap mb-8 min-h-[120px]">
                        {problem.displaySequence.map((term, index) => (
                            <FlowerPot 
                                key={index}
                                term={gameState === 'correct' ? problem.fullSequence[index] : (problem.missingIndexes.includes(index) ? userAnswers[index] : term)}
                                status={potStatus[index]}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                disabled={term !== null || gameState === 'correct'}
                                gameState={gameState}
                                flowerType={flowerType}
                            />
                        ))}
                    </div>

                    <div className="space-y-4 md:space-y-0 md:flex md:justify-center md:items-center md:gap-8 bg-white/60 p-4 rounded-lg">
                        <div className={`flex items-center justify-center gap-4 text-lg p-2 transition-colors duration-300 ${typeContainerClass}`}>
                            <span className="font-bold text-gray-700">Tipo:</span>
                            <label className="flex items-center cursor-pointer">
                                <input type="radio" name="progression-type" value="PA" onChange={(e) => handleTypeChange(e.target.value as 'PA' | 'PG')} checked={userProgression.type === 'PA'} className="mr-2 h-5 w-5 text-green-600 focus:ring-green-500"/> PA
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input type="radio" name="progression-type" value="PG" onChange={(e) => handleTypeChange(e.target.value as 'PA' | 'PG')} checked={userProgression.type === 'PG'} className="mr-2 h-5 w-5 text-green-600 focus:ring-green-500"/> PG
                            </label>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-lg">
                            <label htmlFor="reason-input" className="font-bold text-gray-700">Razão:</label>
                            <input 
                                type="number" 
                                id="reason-input"
                                value={userProgression.reason}
                                onChange={(e) => handleReasonChange(e.target.value)}
                                className={`w-24 p-2 border-2 rounded-md text-center text-xl font-bold focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-300 ${reasonInputClass}`}
                            />
                        </div>
                    </div>

                    <div className="mt-8">
                        {gameState !== 'correct' ? (
                            <div className="flex justify-center items-center gap-4 flex-wrap">
                                 <button
                                    onClick={returnToMenu}
                                    className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-300"
                                >
                                    Mudar Dificuldade
                                </button>
                                <button
                                    onClick={handleUndo}
                                    disabled={history.length === 0}
                                    className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-yellow-300"
                                >
                                    Desfazer
                                </button>
                                <button onClick={checkAnswer} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300">
                                    Verificar
                                </button>
                            </div>
                        ) : (
                             <div className="flex justify-center items-center gap-4 flex-wrap">
                                <button
                                    onClick={returnToMenu}
                                    className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-300"
                                >
                                    Mudar Dificuldade
                                </button>
                                <button onClick={startNextLevel} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-10 rounded-lg text-xl transition-transform transform hover:scale-105 shadow-lg animate-pulse focus:outline-none focus:ring-4 focus:ring-blue-300">
                                    Próximo Nível
                                </button>
                            </div>
                        )}
                    </div>
                </main>

                <footer className="mt-4">
                    <p className={`text-xl font-semibold h-8 transition-opacity duration-300 ${feedback.color} ${feedback.message ? 'opacity-100' : 'opacity-0'}`}>
                        {feedback.message}
                    </p>
                </footer>
            </div>
        </div>
    );
}