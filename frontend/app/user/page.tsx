import { FocusCards } from "@/components/ui/focus-cards";


const UserProfile = () => {
  // Dummy user data
  const user = {
    name: "Jane Doe",
    registerNumber: "2023CS001",
    email: "jane.doe@example.com",
    college: "Tech University",
    profilePic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdMvFM1wG22ZDfXTNICScHu4jfA5_qhKZYcQBXfh-sZ9vdqw_JCwL_MF__dK2a1ZrDPFI&usqp=CAU",
  };

  // Dummy registered events with images
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
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* User Info Sidebar */}
        <aside className="w-full lg:w-1/4">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="text-center">
              <img
                src={user.profilePic}
                alt={user.name}
                className="w-32 h-32 rounded-full mx-auto"
              />
              <h2 className="mt-4 text-2xl font-bold">{user.name}</h2>
            </div>
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Register Number</p>
                <p className="font-medium">{user.registerNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">College</p>
                <p className="font-medium">{user.college}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Registered Events */}
        <main className="w-full lg:w-3/4">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Registered Events</h3>
            <FocusCards cards={registeredEvents} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfile;
