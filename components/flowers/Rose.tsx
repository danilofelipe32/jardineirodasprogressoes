import React from 'react';

const Rose: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(3px 5px 2px rgb(0 0 0 / 0.3))' }}>
        <defs>
            <radialGradient id="roseGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{ stopColor: '#ff8a80', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#c82a2a', stopOpacity: 1 }} />
            </radialGradient>
        </defs>
        <g>
            <path d="M50 90 C 20 70, 20 30, 50 20 C 80 30, 80 70, 50 90 Z" fill="url(#roseGradient)" />
            <path d="M50 75 C 35 65, 35 45, 50 35 C 65 45, 65 65, 50 75 Z" fill="#ff5252" />
            <path d="M50 65 C 45 60, 45 50, 50 45 C 55 50, 55 60, 50 65 Z" fill="#ff1744" />
        </g>
    </svg>
);

export default Rose;
