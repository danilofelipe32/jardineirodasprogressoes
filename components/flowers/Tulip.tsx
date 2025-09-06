import React from 'react';

const Tulip: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(3px 5px 2px rgb(0 0 0 / 0.3))' }}>
        <defs>
            <linearGradient id="tulipGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#f48fb1', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#ad1457', stopOpacity: 1 }} />
            </linearGradient>
        </defs>
        <g>
            <path d="M 30 90 Q 20 50 30 30 C 40 40 60 40 70 30 Q 80 50 70 90 Z" fill="url(#tulipGradient)" />
            <path d="M 50 35 C 40 50 60 50 50 35 V 90" fill="url(#tulipGradient)" />
        </g>
    </svg>
);
export default Tulip;
