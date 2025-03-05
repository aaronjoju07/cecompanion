'use client'
import { useState } from "react";

type ScheduleEvent = {
  day: string; // Added day to the event type
  time: string;
  title: string;
  speaker?: string;
  role?: string;
};

type ScheduleData = ScheduleEvent[];

const scheduleData: ScheduleData = [
  { day: "Day 1", time: "9:00 - 10:00", title: "Opening Ceremony", speaker: "Dr. John Doe", role: "Dean of College" },
  { day: "Day 1", time: "10:00 - 11:00", title: "AI in Education", speaker: "Jane Smith", role: "AI Researcher" },
  { day: "Day 1", time: "11:00 - 12:00", title: "Cybersecurity Trends", speaker: "Alice Johnson", role: "Security Analyst" },
  { day: "Day 1", time: "12:00 - 13:00", title: "Lunch & Networking" },
  { day: "Day 2", time: "9:00 - 10:00", title: "Panel Discussion: Future of Tech", speaker: "Panelists", role: "Industry Experts" },
  { day: "Day 2", time: "10:00 - 11:00", title: "Blockchain for Beginners", speaker: "Robert Brown", role: "Blockchain Developer" },
  { day: "Day 2", time: "11:00 - 12:00", title: "Cloud Computing", speaker: "Emma Wilson", role: "Cloud Architect" },
  { day: "Day 2", time: "12:00 - 13:00", title: "Lunch & Networking" },
];

export default function Schedule() {
  const [selectedDay, setSelectedDay] = useState("Day 1");

  return (
    <div className="bg-gray-100 text-gray-800 w-full min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Event Schedule</h1>
      <div className="flex justify-center gap-4 mb-6">
        {/* Buttons for each day */}
        {["Day 1", "Day 2"].map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-6 py-2 rounded-lg text-lg font-medium transition duration-300 ${
              selectedDay === day
                ? "bg-gray-300 text-gray-900 shadow-md"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            {day}
          </button>
        ))}
      </div>
      <div className="max-w-4xl mx-auto">
        {/* Filter events by selected day */}
        {scheduleData.filter((event) => event.day === selectedDay).map((event, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md mb-4">
            <p className="text-gray-500 font-semibold">{event.time}</p>
            <h2 className="text-xl font-bold text-gray-900">{event.title}</h2>
            {event.speaker && (
              <p className="text-gray-600">{event.speaker} - {event.role}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
