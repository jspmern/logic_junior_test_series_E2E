import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Clock, LogOut, RefreshCw } from 'lucide-react';

/**
 * SessionTimeoutModal
 *
 * Props:
 *   onExtend  () => void  – called when user clicks "Stay Logged In"
 *   onLogout  () => void  – called when countdown hits 0 or user clicks "Logout Now"
 *   countdown number      – seconds remaining (passed from parent)
 */
const SessionTimeoutModal = ({ onExtend, onLogout, countdown }) => {
    // Colour the ring red when ≤ 10 seconds remain
    const urgent = countdown <= 10;

    // SVG progress ring (r=28, circumference ≈ 176)
    const RADIUS = 28;
    const CIRC = 2 * Math.PI * RADIUS;
    const progress = CIRC - (countdown / 60) * CIRC; // stroke-dashoffset

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)' }}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
                style={{ animation: 'slideUp 0.25s ease-out' }}
            >
                {/* Coloured top bar */}
                <div
                    className={`px-6 pt-6 pb-4 text-center transition-colors duration-500 ${urgent ? 'bg-red-50' : 'bg-amber-50'
                        }`}
                >
                    {/* SVG countdown ring */}
                    <div className="flex justify-center mb-3">
                        <svg width="80" height="80" viewBox="0 0 80 80">
                            {/* background track */}
                            <circle
                                cx="40" cy="40" r={RADIUS}
                                fill="none"
                                stroke={urgent ? '#fee2e2' : '#fef3c7'}
                                strokeWidth="6"
                            />
                            {/* progress arc */}
                            <circle
                                cx="40" cy="40" r={RADIUS}
                                fill="none"
                                stroke={urgent ? '#ef4444' : '#f59e0b'}
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeDasharray={CIRC}
                                strokeDashoffset={progress}
                                transform="rotate(-90 40 40)"
                                style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }}
                            />
                            {/* countdown number */}
                            <text
                                x="40" y="46"
                                textAnchor="middle"
                                fontSize="20"
                                fontWeight="700"
                                fill={urgent ? '#ef4444' : '#f59e0b'}
                            >
                                {countdown}
                            </text>
                        </svg>
                    </div>

                    <div className="flex items-center justify-center gap-2 mb-2">
                        <AlertTriangle
                            className={`w-5 h-5 ${urgent ? 'text-red-500' : 'text-amber-500'}`}
                        />
                        <h2 className={`text-lg font-bold ${urgent ? 'text-red-700' : 'text-amber-700'}`}>
                            Session Expiring Soon
                        </h2>
                    </div>

                    <p className="text-sm text-gray-600">
                        You've been inactive for a while. For your security, you'll be
                        automatically logged out in{' '}
                        <span className={`font-semibold ${urgent ? 'text-red-600' : 'text-amber-600'}`}>
                            {countdown} second{countdown !== 1 ? 's' : ''}
                        </span>
                        .
                    </p>
                </div>

                {/* Actions */}
                <div className="px-6 py-5 space-y-3">
                    <button
                        onClick={onExtend}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 active:scale-95 transition-all"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Stay Logged In
                    </button>

                    <button
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 font-medium py-2.5 rounded-xl hover:bg-gray-50 active:scale-95 transition-all text-sm"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout Now
                    </button>

                    <p className="text-center text-xs text-gray-400 mt-1">
                        <Clock className="inline w-3 h-3 mr-1 -mt-0.5" />
                        Session auto-resets on any activity
                    </p>
                </div>
            </div>

            <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default SessionTimeoutModal;
