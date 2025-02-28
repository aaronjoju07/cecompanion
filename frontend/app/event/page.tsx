'use client'

import { useState, useEffect } from "react";

export default function Events() {
    const registeredEvents = [
        {
            id: 1,
            name: "Hackathon 2023",
            date: "2025-10-15",
            location: "San Francisco, CA",
            organizer: "TechHub",
            organization: "Tech Innovations Inc.",
            registrationClosed: true,
            isUserRegistered: false,  // Simulated user registration status
        },
        {
            id: 2,
            name: "AI Workshop",
            date: "2025-11-02",
            location: "New York, NY",
            organizer: "AI Experts",
            organization: "AI Future Ltd.",
            registrationClosed: false,
            isUserRegistered: true, // Simulated user registration status
        },
        {
            id: 3,
            name: "Tech Conference",
            date: "2025-12-05",
            location: "Austin, TX",
            organizer: "Tech Leaders",
            organization: "TechCon Global",
            registrationClosed: false,
            isUserRegistered: false,  // Simulated user registration status
        },
        {
            id: 4,
            name: "Coding Competition",
            date: "2026-01-20",
            location: "Chicago, IL",
            organizer: "Code Masters",
            organization: "Tech Innovators",
            registrationClosed: false,
            isUserRegistered: true,  // Simulated user registration status
        },
        {
            id: 5,
            name: "Design Symposium",
            date: "2026-02-15",
            location: "Los Angeles, CA",
            organizer: "Design Hub",
            organization: "Design Labs",
            registrationClosed: true,
            isUserRegistered: false,  // Simulated user registration status
        },
    ];

    const loading = false; // Set this flag to true while data is being fetched.

    // Get today's date and tomorrow's date for comparison
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const twoDaysAgoDate = twoDaysAgo.toISOString().split('T')[0];

    // Count for different categories
    const [registrationCount, setRegistrationCount] = useState({ open: 0, closed: 0 });
    const [eventCategoryCount, setEventCategoryCount] = useState({ upcoming: 0, past: 0 });

    useEffect(() => {
        // Count registration status occurrences
        const registrationCounts = { open: 0, closed: 0 };
        const eventCounts = { upcoming: 0, past: 0 };

        registeredEvents.forEach((event) => {
            // Count registration status
            if (event.registrationClosed) {
                registrationCounts.closed++;
            } else {
                registrationCounts.open++;
            }

            // Count event category
            if (new Date(event.date).toISOString().split('T')[0] > today) {
                eventCounts.upcoming++;
            } else {
                eventCounts.past++;
            }
        });

        setRegistrationCount(registrationCounts);
        setEventCategoryCount(eventCounts);
    }, []);

    // Function to categorize the event based on date and registration status
    const categorizeEvent = (eventDate: string, registrationClosed: boolean, isUserRegistered: boolean) => {
        // Check if the event date is today
        if (eventDate === today) {
            return {
                status: (
                    <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-white bg-gray-600 rounded-full">
                        Today
                    </span>
                ),
                registrationStatus: registrationClosed ? " Closed" : " Open",
                statusClass: "bg-gray-600 text-white",
            };
        }

        // Check if the event date is tomorrow
        if (eventDate === tomorrowDate) {
            return {
                status: (
                    <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-white bg-gray-500 rounded-full">
                        Tomorrow
                    </span>
                ),
                registrationStatus: registrationClosed ? " Closed" : " Open",
                statusClass: "bg-gray-500 text-white",
            };
        }

        // Check if the event date is in the future (Upcoming)
        if (new Date(eventDate).toISOString().split('T')[0] > tomorrowDate) {
            return {
                status: (
                    <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-white bg-gray-400 rounded-full">
                        Upcoming
                    </span>
                ),
                registrationStatus: registrationClosed ? " Closed" : " Open",
                statusClass: "bg-gray-400 text-white",
            };
        }

        // For past events, always mark the registration as closed
        if (new Date(eventDate).toISOString().split('T')[0] < twoDaysAgoDate) {
            return {
                status: (
                    <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-white bg-gray-300 rounded-full">
                        Past
                    </span>
                ),
                registrationStatus: " Closed",  // Ensure registration is always marked as closed
                statusClass: "bg-gray-300 text-white",
            };
        }

        return {
            status: (
                <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-white bg-gray-300 rounded-full">
                    Past
                </span>
            ),
            registrationStatus: " Closed",  // Ensure registration is always marked as closed
            statusClass: "bg-gray-300 text-white",
        };
    };

    // Function to format the date as requested
    const formatEventDate = (date: string) => {
        const eventDate = new Date(date);
        const day = eventDate.getDate();
        const month = eventDate.toLocaleString('default', { month: 'long' });
        const year = eventDate.getFullYear();

        return (
            <div className="text-center">
                <span className="text-4xl font-bold text-gray-800">{day}</span><br />
                <span className="text-2xl text-gray-600">{month}</span><br />
                <span className="text-xl text-gray-500">{year}</span>
            </div>
        );
    };

    return (
        <main className="max-w-full w-full max-h-full h-[100vh] p-6 flex flex-col">
            <div className="bg-white shadow-sm rounded-lg p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-4xl font-semibold">Events</h3>
                    <a href="/register" className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white">Add Events</a>
                </div>

                {/* Status and Event Category Counts */}
                <div className="mb-4 flex space-x-4">
                    <div className="inline-flex items-center px-3 py-1 text-sm font-semibold text-white bg-gray-500 rounded-full">
                        <span>Registration Open: {registrationCount.open}</span>
                    </div>
                    <div className="inline-flex items-center px-3 py-1 text-sm font-semibold text-white bg-gray-400 rounded-full">
                        <span>Registration Closed: {registrationCount.closed}</span>
                    </div>
                    <div className="inline-flex items-center px-3 py-1 text-sm font-semibold text-white bg-gray-300 rounded-full">
                        <span>Upcoming Events: {eventCategoryCount.upcoming}</span>
                    </div>
                    <div className="inline-flex items-center px-3 py-1 text-sm font-semibold text-white bg-gray-400 rounded-full">
                        <span>Past Events: {eventCategoryCount.past}</span>
                    </div>
                </div>

                <div className="overflow-y-auto max-h-[60vh]"> {/* Scrollable event list */}
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700">Date</th>
                                <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700">Event Name</th>
                                <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700">Location</th>
                                <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700">Organizer</th>
                                <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700">Organization</th>
                                <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700">Registration</th>
                                <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700">About</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                // Skeleton loading elements
                                [...new Array(5)].map((_, i) => (
                                    <tr key={"skeleton" + i} className="bg-gray-200 animate-pulse">
                                        <td className="px-6 py-4 h-10 bg-gray-300"></td>
                                        <td className="px-6 py-4 bg-gray-300"></td>
                                        <td className="px-6 py-4 bg-gray-300"></td>
                                        <td className="px-6 py-4 bg-gray-300"></td>
                                        <td className="px-6 py-4 bg-gray-300"></td>
                                        <td className="px-6 py-4 bg-gray-300"></td>
                                        <td className="px-6 py-4 bg-gray-300"></td>
                                        <td className="px-6 py-4 bg-gray-300"></td>
                                    </tr>
                                ))
                            ) : (
                                registeredEvents.map((event) => (
                                    <tr key={event.id}>
                                        <td className="px-6 py-4">{formatEventDate(event.date)}</td>
                                        <td className="px-6 py-4">{event.name}</td>
                                        <td className="px-6 py-4">{event.location}</td>
                                        <td className="px-6 py-4">{categorizeEvent(event.date, event.registrationClosed, event.isUserRegistered).status}</td>
                                        <td className="px-6 py-4">{event.organizer}</td>
                                        <td className="px-6 py-4">{event.organization}</td>
                                        <td className="px-6 py-4">
                                            {event.isUserRegistered ? (
                                                <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded-full">
                                                    Registered
                                                </span>
                                            ) : (
                                                categorizeEvent(event.date, event.registrationClosed, event.isUserRegistered).registrationStatus
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <a 
                                                href={`/event/${event.id}`}
                                                className="text-blue-600 hover:text-blue-800 underline"
                                            >
                                                View Details
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
