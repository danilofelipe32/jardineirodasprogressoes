import React from 'react';
import type { PotStatusValue, FlowerType, GameState } from '../types';
import Sunflower from './flowers/Sunflower';
import Rose from './flowers/Rose';
import Tulip from './flowers/Tulip';

interface FlowerPotProps {
  term: number | string | null;
  status?: PotStatusValue;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  gameState: GameState;
  flowerType: FlowerType;
}

const FlowerComponents: Record<FlowerType, React.FC<{ className?: string }>> = {
    sunflower: Sunflower,
    rose: Rose,
    tulip: Tulip,
};

const FlowerPot: React.FC<FlowerPotProps> = ({ term, status, onChange, disabled, gameState, flowerType }) => {
    const potColor = {
        default: 'bg-amber-500',
        correct: 'bg-green-500 animate-grow',
        incorrect: 'bg-red-500 animate-shake',
    };
    
    const statusClass = status ? potColor[status] : potColor.default;
    const Flower = FlowerComponents[flowerType];

    const flowerCircleClasses = `w-16 h-16 md:w-20 md:h-20 p-0 flex items-center justify-center border-4 rounded-full z-10 transition-colors duration-300`;
    const disabledClasses = 'border-yellow-600 bg-yellow-400 text-stone-800 cursor-not-allowed';
    const enabledClasses = 'border-amber-700 bg-amber-100 text-stone-800 focus-within:ring-4 focus-within:ring-yellow-300';
    const correctClasses = 'border-green-600 bg-green-200 text-green-900';

    const getCircleClass = () => {
        if (gameState === 'correct') return correctClasses;
        if (disabled) return disabledClasses;
        return enabledClasses;
    }

    return (
        <div className="relative">
             {gameState === 'correct' && (
                <div className="absolute bottom-14 md:bottom-16 left-1/2 -translate-x-1/2 z-20">
                    <Flower className="animate-grow-flower" />
                </div>
            )}
            <div className={`relative w-20 h-20 md:w-24 md:h-24 flex justify-center items-center rounded-2xl shadow-md transition-colors duration-500 ${statusClass}`}>
                {/* "Flower" circle container */}
                <div className={`${flowerCircleClasses} ${getCircleClass()}`}>
                    {disabled ? (
                        <span className="select-none text-2xl md:text-3xl font-bold">{term}</span>
                    ) : (
                        <input 
                            type="number" 
                            value={term ?? ''}
                            placeholder="?"
                            onChange={onChange}
                            disabled={disabled}
                            className="w-full h-full p-0 bg-transparent text-center text-2xl md:text-3xl font-bold text-stone-800 outline-none placeholder:text-stone-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default FlowerPot;