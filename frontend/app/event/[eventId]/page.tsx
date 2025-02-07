export default function EventPage() {
    const event = {
        name: "TechFest 2024",
        college: "XYZ University",
        department: "Computer Science & Engineering",
        targetAudience: "Undergraduate & Postgraduate Students",
        eventDates: "March 15 - March 17, 2024",
        image: "https://example.com/event-image.jpg",
        events: [
            { name: "Hackathon", prizePool: "$5000" },
            { name: "AI Challenge", prizePool: "$3000" },
            { name: "Robotics Battle", prizePool: "$4000" },
            { name: "Code Sprint", prizePool: "$2000" },
        ],
    };

    return (
        <div className="flex justify-center w-11/12 flex-col items-center p-6 bg-gray-100 max-h-full">
            <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
                <img src={event.image} alt={event.name} className="w-full h-60 object-cover rounded-lg mb-4" />
                <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
                <p className="text-gray-600 text-lg font-medium">{event.college} - {event.department}</p>
                <p className="text-gray-700 mt-2"><strong>Target Audience:</strong> {event.targetAudience}</p>
                <p className="text-gray-700"><strong>Event Dates:</strong> {event.eventDates}</p>
                
                <h2 className="text-2xl font-semibold mt-6">Events & Prize Pool</h2>
                <ul className="mt-4 space-y-2">
                    {event.events.map((ev, index) => (
                        <li key={index} className="p-3 border rounded-md shadow-sm bg-gray-50">
                            <span className="font-medium">{ev.name}</span> - <span className="text-green-600">{ev.prizePool}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
