import React, { useMemo } from 'react';

const StatCard = ({ label, value, level }) => {
    const barWidth = useMemo(() => {
        if (level === 'high') return 'w-4/5';
        if (level === 'medium') return 'w-1/2';
        return 'w-1/5';
    }, [level]);

    return (
        <div className="p-4 bg-white rounded-xl shadow-md border border-gray-100 text-center flex-1">
            <h4 className="text-gray-500 font-archivo font-medium text-sm mb-2">{label}</h4>
            <div className="h-2 bg-gray-200 rounded-full mb-2">
                <div
                    className={`h-full bg-purple-custom rounded-full transition-all duration-500 ${barWidth}`}
                    style={{ background: '#8c52ff' }}
                ></div>
            </div>
            <p className="text-lg font-semibold font-archivo text-purple-700">{value}</p>
        </div>
    );
};

export default StatCard;
