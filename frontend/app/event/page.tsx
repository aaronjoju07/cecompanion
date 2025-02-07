import { FocusCards } from "@/components/ui/focus-cards";

export default function Events() {
    const registeredEvents = [
        {
            id: 1,
            name: "Hackathon 2023",
            date: "2023-10-15",
            image: "https://dnbca6q7do6n.cloudfront.net/media/UpcomingEvents/WhatsApp_Image_2024-09-19_at_7.38.59_PM.jpeg",
        },
        { id: 2, name: "AI Workshop", date: "2023-11-02", image: "https://dnbca6q7do6n.cloudfront.net/media/UpcomingEvents/WhatsApp_Image_2024-09-19_at_7.38.59_PM.jpeg" },
        {
            id: 3,
            name: "Tech Conference",
            date: "2023-12-05",
            image: "https://dnbca6q7do6n.cloudfront.net/media/UpcomingEvents/WhatsApp_Image_2024-09-19_at_7.38.59_PM.jpeg",
        },
        {
            id: 4,
            name: "Coding Competition",
            date: "2024-01-20",
            image: "https://dnbca6q7do6n.cloudfront.net/media/UpcomingEvents/WhatsApp_Image_2024-09-19_at_7.38.59_PM.jpeg",
        },
        {
            id: 5,
            name: "Design Symposium",
            date: "2024-02-15",
            image: "https://dnbca6q7do6n.cloudfront.net/media/UpcomingEvents/WhatsApp_Image_2024-09-19_at_7.38.59_PM.jpeg",
        },
        {
            id: 6,
            name: "Design Symposium",
            date: "2024-02-15",
            image: "https://dnbca6q7do6n.cloudfront.net/media/UpcomingEvents/WhatsApp_Image_2024-09-19_at_7.38.59_PM.jpeg",
        },
        {
            id: 7,
            name: "Design Symposium",
            date: "2024-02-15",
            image: "https://dnbca6q7do6n.cloudfront.net/media/UpcomingEvents/WhatsApp_Image_2024-09-19_at_7.38.59_PM.jpeg",
        },
        {
            id: 8,
            name: "Design Symposium",
            date: "2024-02-15",
            image: "https://dnbca6q7do6n.cloudfront.net/media/UpcomingEvents/WhatsApp_Image_2024-09-19_at_7.38.59_PM.jpeg",
        },
        {
            id: 9,
            name: "Design Symposium",
            date: "2024-02-15",
            image: "https://dnbca6q7do6n.cloudfront.net/media/UpcomingEvents/WhatsApp_Image_2024-09-19_at_7.38.59_PM.jpeg",
        },
        {
            id: 10,
            name: "Design Symposium",
            date: "2024-02-15",
            image: "https://dnbca6q7do6n.cloudfront.net/media/UpcomingEvents/WhatsApp_Image_2024-09-19_at_7.38.59_PM.jpeg",
        },
        {
            id: 11,
            name: "Design Symposium",
            date: "2024-02-15",
            image: "https://dnbca6q7do6n.cloudfront.net/media/UpcomingEvents/WhatsApp_Image_2024-09-19_at_7.38.59_PM.jpeg",
        },

        {
            id: 12,
            name: "Design Symposium",
            date: "2024-02-15",
            image: "https://dnbca6q7do6n.cloudfront.net/media/UpcomingEvents/WhatsApp_Image_2024-09-19_at_7.38.59_PM.jpeg",
        },
    ];
    return (
        <main className="w-full">
        <div className="bg-white shadow-sm rounded-lg p-6">

        <div className="hidden md:block">
            <div className="ml-10 flex items-baseline justify-between space-x-4">
        <h3 className="text-4xl text-center font-semibold mb-4">Registered Events</h3>
              <a href="/event/register" className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white" aria-current="page">Add Events</a>
            </div>
          </div>
          <FocusCards cards={registeredEvents} />
        </div>
      </main>
    );
}
