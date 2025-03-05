'use client';

import Image from "next/image";

export default function EventDetails() {
    const event = {
        name: "TechFest 2024",
        college: "XYZ University",
        department: "Computer Science & Engineering",
        targetAudience: "Undergraduate & Postgraduate Students",
        eventDates: "March 15 - March 17, 2024",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEKviDJnTzMM5it7arNMaW7IToC9LeyNxExg&s",
        events: [
            { name: "Hackathon", prizePool: "$5000" },
            { name: "AI Challenge", prizePool: "$3000" },
            { name: "Robotics Battle", prizePool: "$4000" },
            { name: "Code Sprint", prizePool: "$2000" },
        ],
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-50 w-full">
            {/* Header Section */}
            <div className="relative w-full h-[30vh] flex items-center justify-center text-white text-center"
                style={{ background: "radial-gradient(circle at center, #B5B5B5, #2D2D2D)" }}>
                <h1 className="text-6xl font-bold tracking-wide">TECHFEST 2024</h1>
                <button className="absolute top-6 right-6 bg-white text-gray-800 px-4 py-2 rounded-md shadow-md hover:bg-gray-200">Register Now</button>
            </div>

            {/* Event Details Section */}
            <div className="w-4/5 max-w-5xl bg-white shadow-lg rounded-lg p-6 mt-[-5rem] relative z-10">
                <div className="flex flex-col items-center">
                    <Image src={event.image} alt="Event Profile" width={140} height={140} className="rounded-lg shadow-md border-4 border-white" />
                    <h2 className="text-4xl font-bold text-gray-800 mt-4">{event.college}</h2>
                    <p className="text-lg text-gray-600 font-medium">{event.department}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="flex flex-col">
                        <label className="font-semibold text-gray-700">Target Audience</label>
                        <p className="border border-gray-300 bg-gray-50 p-3 rounded-md text-lg">{event.targetAudience}</p>
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold text-gray-700">Event Dates</label>
                        <p className="border border-gray-300 bg-gray-100 p-3 rounded-md text-lg">{event.eventDates}</p>
                    </div>
                </div>

                <h3 className="text-2xl font-bold mt-6 text-gray-800">Events</h3>
                <ul className="list-disc list-inside mt-2 space-y-2 text-lg text-gray-700">
                    {event.events.map((e, index) => (
                        <li key={index}>
                            <strong>{e.name}:</strong> {e.prizePool}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
