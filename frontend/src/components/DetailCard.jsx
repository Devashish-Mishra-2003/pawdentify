import React from 'react';

const DetailCard = ({ label, value, unit }) => (
    <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-center flex-1">
        <h4 className="text-gray-700 font-bold font-archivo text-base mb-1">{label}</h4>
        <p className="text-lg font-alfa text-purple-custom leading-none">{value}</p>
        <p className="text-sm font-archivo text-gray-500">{unit}</p>
    </div>
);

export default DetailCard;
