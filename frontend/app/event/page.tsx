'use client'

import { useState, useEffect } from "react";

export default function Events() {
    const registeredEvents = [
        {
            id: 1,
            name: "Hackathon 2023",
            date: "2023-10-15",
            location: "San Francisco, CA",
            organizer: "TechHub",
            organization: "Tech Innovations Inc.",
            registrationClosed: true, // Registration status
        },
        { 
            id: 2, 
            name: "AI Workshop", 
            date: "2023-11-02", 
            location: "New York, NY", 
            organizer: "AI Experts",
            organization: "AI Future Ltd.",
            registrationClosed: false,
        },
        {
            id: 3,
            name: "Tech Conference",
            date: "2023-12-05",
            location: "Austin, TX",
            organizer: "Tech Leaders",
            organization: "TechCon Global",
            registrationClosed: false,
        },
        {
            id: 4,
            name: "Coding Competition",
            date: "2024-01-20",
            location: "Chicago, IL",
            organizer: "Code Masters",
            organization: "Tech Innovators",
            registrationClosed: false,
        },
        {
            id: 5,
            name: "Design Symposium",
            date: "2024-02-15",
            location: "Los Angeles, CA",
            organizer: "Design Hub",
            organization: "Design Labs",
            registrationClosed: true,
        },
    ];

    const loading = false;  // Set this flag to true while data is being fetched.

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
            if (new Date(event.date) > new Date(today)) {
                eventCounts.upcoming++;
            } else {
                eventCounts.past++;
            }
        });

        setRegistrationCount(registrationCounts);
        setEventCategoryCount(eventCounts);
    }, []);

    // Function to categorize the event based on date
    const categorizeEvent = (eventDate: string, registrationClosed: boolean) => {
        // Check if the event date is today
        if (eventDate === today) {
            return {
                status: (
                    <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded-full">
                        Today
                    </span>
                ),
                registrationStatus: registrationClosed ? " Closed" : " Open",
                statusClass: "bg-blue-600 text-white",
            };
        }
        
        // Check if the event date is tomorrow
        if (eventDate === tomorrowDate) {
            return {
                status: (
                    <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-white bg-yellow-500 rounded-full">
                        Tomorrow
                    </span>
                ),
                registrationStatus: registrationClosed ? " Closed" : " Open",
                statusClass: "bg-yellow-500 text-white",
            };
        }

        // Check if the event date is in the future (Upcoming)
        if (new Date(eventDate) > new Date(tomorrowDate)) {
            return {
                status: (
                    <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded-full">
                        Upcoming
                    </span>
                ),
                registrationStatus: registrationClosed ? " Closed" : " Open",
                statusClass: "bg-green-500 text-white",
            };
        }

        // For past events, always mark the registration as closed
        if (new Date(eventDate) < new Date(twoDaysAgoDate)) {
            return {
                status: (
                    <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-white bg-gray-400 rounded-full">
                        Past
                    </span>
                ),
                registrationStatus: " Closed",  // Ensure registration is always marked as closed
                statusClass: "bg-gray-400 text-white",
            };
        }

        return {
            status: (
                <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-white bg-gray-400 rounded-full">
                    Past
                </span>
            ),
            registrationStatus: " Closed",  // Ensure registration is always marked as closed
            statusClass: "bg-gray-400 text-white",
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
        <main className="max-w-full w-full max-h-full h-full p-6">
            <div className="bg-white shadow-sm rounded-lg p-6">
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
                                </tr>
                            ))
                        ) : (
                            // Display registered events
                            registeredEvents.map((event) => {
                                const { status, registrationStatus } = categorizeEvent(event.date, event.registrationClosed);
                                return (
                                    <tr key={event.id} className="border-b">
                                        <td className="px-6 py-4">{formatEventDate(event.date)}</td>
                                        <td className="px-6 py-4">{event.name}</td>
                                        <td className="px-6 py-4">{event.location}</td>
                                        <td className="px-6 py-4">
                                            {status}
                                        </td>
                                        <td className="px-6 py-4">{event.organizer}</td>
                                        <td className="px-6 py-4">{event.organization}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-md text-center text-gray-500">{registrationStatus}</span><br />
                                            <button className="text-gray-800 bg-gray-300 px-4 py-2 rounded-md mt-2">
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
