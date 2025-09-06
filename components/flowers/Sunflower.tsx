import React from 'react';

const Sunflower: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} width="70" height="70" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(3px 5px 2px rgb(0 0 0 / 0.3))' }}>
        <g>
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(angle => (
                <ellipse
                    key={angle}
                    cx="50"
                    cy="50"
                    rx="15"
                    ry="40"
                    fill="#ffca28"
                    transform={`rotate(${angle} 50 50)`}
                />
            ))}
            <circle cx="50" cy="50" r="20" fill="#6d4c41" />
            <circle cx="50" cy="50" r="15" fill="#8d6e63" />
        </g>
    </svg>
);

export default Sunflower;
