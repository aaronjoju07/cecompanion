'use client';

import { useState } from "react";

export default function Dashboard() {
    const [role, setRole] = useState("student"); // Mock role, replace with actual user role

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 w-full p-1 text-gray-900">
            {/* Welcome Header */}
            <div className="relative w-full h-[50vh] flex items-center justify-center text-gray-900 text-center mb-3"
                                style={{ background: "radial-gradient(circle at center, #E5E7EB, #D1D5DB)" }}>
                                <h1 className="text-6xl font-bold tracking-wide">WELCOME {role === "student" ? "STUDENT" : "ORGANIZER"}</h1>
            </div>
            
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Student Dashboard */}
                {role === "student" && (
                    <>
                        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col border-t-4 border-gray-400">
                            <h2 className="text-lg font-semibold text-gray-900">✅ Your Upcoming Events</h2>
                            <p className="text-sm text-gray-600 mt-1">Stay updated with your registered events.</p>
                            <ul className="mt-4 space-y-2 text-gray-700">
                                <li className="bg-gray-200 p-3 rounded-md">📅 Tech Fest 2025 - 5th March</li>
                                <li className="bg-gray-200 p-3 rounded-md">🎭 Cultural Night - 10th March</li>
                            </ul>
                        </div>
                        
                        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col border-t-4 border-gray-400">
                            <h2 className="text-lg font-semibold text-gray-900">🔥 Recommended Events</h2>
                            <p className="text-sm text-gray-600 mt-1">Suggested based on your interests.</p>
                            <ul className="mt-4 space-y-2 text-gray-700">
                                <li className="bg-gray-200 p-3 rounded-md">🚀 AI Workshop</li>
                                <li className="bg-gray-200 p-3 rounded-md">🎵 Music Night</li>
                            </ul>
                        </div>
                    </>
                )}
                
                {/* Organizer Dashboard */}
                {role === "organizer" && (
                    <>
                        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col border-t-4 border-gray-400">
                            <h2 className="text-lg font-semibold text-gray-900">✏️ Manage Your Events</h2>
                            <ul className="mt-4 space-y-2 text-gray-700">
                                <li className="bg-gray-200 p-3 rounded-md">
                                    🏆 AI Hackathon - 2nd March
                                    <button className="ml-2 bg-gray-700 text-white p-1 rounded">Edit</button>
                                    <button className="ml-2 bg-red-700 text-white p-1 rounded">Delete</button>
                                </li>
                                <li className="bg-gray-200 p-3 rounded-md">
                                    🎤 Open Mic Night - 12th March
                                    <button className="ml-2 bg-gray-700 text-white p-1 rounded">Edit</button>
                                    <button className="ml-2 bg-red-700 text-white p-1 rounded">Delete</button>
                                </li>
                            </ul>
                        </div>
                        
                        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col border-t-4 border-gray-400">
                            <h2 className="text-lg font-semibold text-gray-900">➕ Create New Event</h2>
                            <button className="mt-4 bg-gray-700 text-white p-2 rounded">+ Create Event</button>
                        </div>
                        
                        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col border-t-4 border-gray-400">
                            <h2 className="text-lg font-semibold text-gray-900">📊 Event Analytics</h2>
                            <ul className="mt-4 space-y-2 text-gray-700">
                                <li className="bg-gray-200 p-3 rounded-md">Tech Fest - 200 Attended</li>
                                <li className="bg-gray-200 p-3 rounded-md">Open Mic Night - 150 Attended</li>
                            </ul>
                        </div>
                    </>
                )}
            </div>
            
            {/* More Button Section */}
            <div className="mt-8">
                <button className="bg-gray-700 text-white p-3 rounded-md hover:bg-gray-600">
                    More Events...
                </button>
            </div>
        </div>
    );
}
