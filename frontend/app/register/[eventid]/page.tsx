'use client';

import { useState, useEffect } from "react";

export default function EventRegistration() {
    const [name, setName] = useState('');
    const [college, setCollege] = useState('');
    const [department, setDepartment] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [selectedEvent, setSelectedEvent] = useState('');
    const [teamName, setTeamName] = useState('');
    const [eventsRegistered, setEventsRegistered] = useState<Event[]>([]);
    const [maxEvents, setMaxEvents] = useState(3); // Max events user can register for

    interface Event {
        name: string;
        college: string;
        department: string;
        email: string;
        mobile: string;
        eventName: string;
        eventOrganizers: string;
        eventLocation: string;
        eventDate: string;
        status: string;
        registrationDate: string;
        teamName?: string;
    }

    const eventOptions = [
        { id: 1, name: 'Individual Event 1' },
        { id: 2, name: 'Individual Event 2' },
        { id: 3, name: 'Group Event 1' },
        { id: 4, name: 'Group Event 2' }
    ];

    const eventDetails: { [key: string]: { organizers: string; location: string; date: string } } = {
        "Individual Event 1": { organizers: "Team A", location: "Hall 1", date: "2025-02-20" },
        "Individual Event 2": { organizers: "Team B", location: "Hall 2", date: "2025-02-22" },
        "Group Event 1": { organizers: "Team C", location: "Hall 3", date: "2025-02-25" },
        "Group Event 2": { organizers: "Team D", location: "Hall 4", date: "2025-02-28" }
    };

    // Suggest team name if there are other registrations from the same college
    const getSuggestedTeamName = () => {
        const sameCollegeRegistrations = eventsRegistered.filter(
            (event) => event.college === college && event.eventName.includes('Group')
        );
        return sameCollegeRegistrations.length > 0 ? `Team ${sameCollegeRegistrations.length + 1}` : '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (eventsRegistered.length >= maxEvents) {
            alert(`You can only register for a maximum of ${maxEvents} events.`);
            return;
        }

        const eventInfo = eventDetails[selectedEvent] || {};
        const newEvent = {
            name,
            college,
            department,
            email,
            mobile,
            eventName: selectedEvent,
            eventOrganizers: eventInfo.organizers,
            eventLocation: eventInfo.location,
            eventDate: eventInfo.date,
            status: "Pending",
            registrationDate: new Date().toLocaleDateString(),
            teamName: selectedEvent.includes('Group') ? teamName : undefined
        };

        setEventsRegistered([...eventsRegistered, newEvent]);
        resetForm();
    };

    const resetForm = () => {
        setName('');
        setCollege('');
        setDepartment('');
        setEmail('');
        setMobile('');
        setSelectedEvent('');
        setTeamName('');
    };

    useEffect(() => {
        if (selectedEvent.includes('Group')) {
            setTeamName(getSuggestedTeamName());
        } else {
            setTeamName('');
        }
    }, [college, selectedEvent]);

    return (
        <div className="w-full h-full">
            <section className="w-full h-[40vh] lg:h-[55vh] bg-cover bg-center" style={{ background: '#F5F5F5' }}></section>
            <div className="absolute top-1/2 left-[5%] md:left-[10%] -translate-y-1/2 text-black">
                <h1 className="text-3xl md:text-5xl font-bold">Register for an Event</h1>
                <p className="text-sm md:text-lg">Fill the details below to register for an event</p>
            </div>

            <div className="w-full h-fit py-10 px-4">
                <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 shadow-lg rounded">
                    <div className="mb-4">
                        <label className="block text-gray-700">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">College</label>
                        <input
                            type="text"
                            value={college}
                            onChange={(e) => setCollege(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Department</label>
                        <input
                            type="text"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Mobile</label>
                        <input
                            type="text"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Select Event</label>
                        <select
                            value={selectedEvent}
                            onChange={(e) => setSelectedEvent(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        >
                            <option value="">Select an Event</option>
                            {eventOptions.map((event) => (
                                <option key={event.id} value={event.name}>
                                    {event.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedEvent.includes('Group') && (
                        <div className="mb-4">
                            <label className="block text-gray-700">Team Name</label>
                            <input
                                type="text"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                    )}

                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                        Register
                    </button>
                </form>
            </div>

            <div className="w-full py-10 px-4 m-35">
    <h2 className="text-2xl font-bold mb-4">Registered Events</h2>
    <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
            <thead>
                <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left">Event Name</th>

                    <th className="py-2 px-4 text-left">Location</th>
                    <th className="py-2 px-4 text-left">Event Date</th>
                    <th className="py-2 px-4 text-left">Registration Status</th>
                    <th className="py-2 px-4 text-left">Registration Date</th>
                    <th className="py-2 px-4 text-left">Team Name</th>
                </tr>
            </thead>
            <tbody>
                {eventsRegistered.map((event, index) => (
                    <tr key={index} className="border-b">
                        <td className="py-2 px-4">{event.eventName}</td>

                        <td className="py-2 px-4">{event.eventLocation}</td>
                        <td className="py-2 px-4">{event.eventDate}</td>
                        <td className="py-2 px-4">{event.status}</td>
                        <td className="py-2 px-4">{event.registrationDate}</td>
                        <td className="py-2 px-4">{event.teamName || '-'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
</div>

        </div>
    );
}
