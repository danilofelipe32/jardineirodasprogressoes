import React from 'react';

interface InfoButtonProps {
  onClick: () => void;
}

const InfoButton: React.FC<InfoButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 right-4 z-30 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-green-800 font-bold text-2xl shadow-md hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
      aria-label="Mostrar informações do jogo"
    >
      i
    </button>
  );
};

export default InfoButton;
