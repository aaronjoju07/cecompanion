'use client';

import { useState } from "react";
export default function RegisterEvent() {
    const [name, setName] = useState('');
    const [organizers, setOrganizers] = useState('');
    const [institution, setInstitution] = useState('');
    const [file, setFile] = useState(null);
    const [maxStudents, setMaxStudents] = useState('');
    const [department, setDepartment] = useState('');
    const [collegeName, setCollegeName] = useState('');
    const [maxEvents, setMaxEvents] = useState('');
    const [rules, setRules] = useState('');
    const [overview, setOverview] = useState('');
    const [agenda, setAgenda] = useState('');
    const [venue, setVenue] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    const [courses, setCourses] = useState('');
    const [contact1, setContact1] = useState('');
    const [contact2, setContact2] = useState('');
    const [website, setWebsite] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log('Form submitted!');
        alert('Form submitted successfully!');
    };

    const nextPage = () => setCurrentPage(currentPage + 1);
    const prevPage = () => setCurrentPage(currentPage - 1);

    return (
        <div>
            {/* Banner Section */}
            <div className="relative">
                <section className="w-full h-[40vh] lg:h-[55vh] bg-cover bg-center "
                    style={{ background: '#F5F5F5' }}></section>
                <div className="absolute top-1/2 left-[5%] md:left-[10%] -translate-y-1/2 text-black">
                    <h1 className="text-3xl md:text-5xl font-bold">Get Your Event Listed!</h1>
                    <p className="text-sm md:text-lg">Complete the form below to register your event</p>
                </div>
            </div>

            {/* Form Container */}
            <div className="w-full h-[1200px] md:h-[60vh] lg:h-[130vh] relative">
                <div className="absolute -top-[3%] md:-top-[10%] left-1/2 -translate-x-1/2 grid grid-cols-1 md:grid-cols-3 h-fit w-4/5 md:w-[90%] lg:w-4/5 rounded shadow-lg overflow-hidden bg-white">

                    {/* Form Section */}
                    <div className="p-4 h-full bg-white col-span-2 shadow-md rounded-md">
                        <form onSubmit={handleSubmit}>
                            {/* Page Navigation */}
                            <div className="flex flex-col md:flex-row justify-around items-start md:items-center pt-8 p-4">
                                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Event Details</h2>
                            </div>

                            {/* Event Details Form */}
                            {currentPage === 1 && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 px-4 md:py-12 md:px-8 text-sm">
                                        <div className="flex flex-col gap-1">
                                            <label className="font-semibold text-gray-700">Event Name <span className="text-red-500">*</span></label>
                                            <input
                                                className="border-[1px] border-gray-300 bg-gray-50 p-2 rounded-md"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="font-semibold text-gray-700">Organizers <span className="text-red-500">*</span></label>
                                            <input
                                                className="border-[1px] border-gray-300 bg-gray-50 p-2 rounded-md"
                                                type="email"
                                                value={organizers}
                                                onChange={(e) => setOrganizers(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="font-semibold text-gray-700">Organization Institution <span className="text-red-500">*</span></label>
                                            <input
                                                className="border-[1px] border-gray-300 bg-gray-50 p-2 rounded-md"
                                                type="email"
                                                value={institution}
                                                onChange={(e) => setInstitution(e.target.value)}
                                                required
                                            />
                                        </div>

                                    </div>
                                </>
                            )}

                            {/* Page 2 - Event Capacity */}
                            {currentPage === 2 && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 px-4 md:py-12 md:px-8 text-sm">
                                        <div className="flex flex-col gap-1">
                                            <label className="font-semibold text-gray-700">Maximum Students <span className="text-red-500">*</span></label>
                                            <input
                                                className="border-[1px] border-gray-300 bg-gray-50 p-2 rounded-md"
                                                type="number"
                                                value={maxStudents}
                                                onChange={(e) => setMaxStudents(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="font-semibold text-gray-700">Maximum Events <span className="text-red-500">*</span></label>
                                            <input
                                                className="border-[1px] border-gray-300 bg-gray-50 p-2 rounded-md"
                                                type="number"
                                                value={maxEvents}
                                                onChange={(e) => setMaxEvents(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Page 3 - Department Information */}
                            {currentPage === 3 && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 px-4 md:py-12 md:px-8 text-sm">
                                        <div className="flex flex-col gap-1">
                                            <label className="font-semibold text-gray-700">Department <span className="text-red-500">*</span></label>
                                            <input
                                                className="border-[1px] border-gray-300 bg-gray-50 p-2 rounded-md"
                                                value={department}
                                                onChange={(e) => setDepartment(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="font-semibold text-gray-700">College Name <span className="text-red-500">*</span></label>
                                            <input
                                                className="border-[1px] border-gray-300 bg-gray-50 p-2 rounded-md"
                                                value={collegeName}
                                                onChange={(e) => setCollegeName(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Page 4 - Additional Details */}
                            {currentPage === 4 && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 px-4 md:py-12 md:px-8 text-sm">
                                        <div className="flex flex-col gap-1 md:col-span-2">
                                            <label className="font-semibold text-gray-700">Rules <span className="text-red-500">*</span></label>
                                            <textarea
                                                className="border-[1px] border-gray-300 bg-gray-50 p-2 rounded-md"
                                                value={rules}
                                                onChange={(e) => setRules(e.target.value)}
                                                rows={3}
                                                required
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1 md:col-span-2">
                                            <label className="font-semibold text-gray-700">Overview <span className="text-red-500">*</span></label>
                                            <textarea
                                                className="border-[1px] border-gray-300 bg-gray-50 p-2 rounded-md"
                                                value={overview}
                                                onChange={(e) => setOverview(e.target.value)}
                                                rows={3}
                                                required
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1 md:col-span-2">
                                            <label className="font-semibold text-gray-700">Agenda <span className="text-red-500">*</span></label>
                                            <textarea
                                                className="border-[1px] border-gray-300 bg-gray-50 p-2 rounded-md"
                                                value={agenda}
                                                onChange={(e) => setAgenda(e.target.value)}
                                                rows={3}
                                                required
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="font-semibold text-gray-700">Venue <span className="text-red-500">*</span></label>
                                            <input
                                                className="border-[1px] border-gray-300 bg-gray-50 p-2 rounded-md"
                                                value={venue}
                                                onChange={(e) => setVenue(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="font-semibold text-gray-700">Target Audience <span className="text-red-500">*</span></label>
                                            <input
                                                className="border-[1px] border-gray-300 bg-gray-50 p-2 rounded-md"
                                                value={targetAudience}
                                                onChange={(e) => setTargetAudience(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="font-semibold text-gray-700">Courses <span className="text-red-500">*</span></label>
                                            <input
                                                className="border-[1px] border-gray-300 bg-gray-50 p-2 rounded-md"
                                                value={courses}
                                                onChange={(e) => setCourses(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="font-semibold text-gray-700">Contact 1 <span className="text-red-500">*</span></label>
                                            <input
                                                className="border-[1px] border-gray-300 bg-gray-50 p-2 rounded-md"
                                                value={contact1}
                                                onChange={(e) => setContact1(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="font-semibold text-gray-700">Contact 2 <span className="text-red-500">*</span></label>
                                            <input
                                                className="border-[1px] border-gray-300 bg-gray-50 p-2 rounded-md"
                                                value={contact2}
                                                onChange={(e) => setContact2(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <label className="font-semibold text-gray-700">Website <span className="text-red-500">*</span></label>
                                            <input
                                                className="border-[1px] border-gray-300 bg-gray-50 p-2 rounded-md"
                                                type="url"
                                                value={website}
                                                onChange={(e) => setWebsite(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex items-center justify-between py-4 px-8">
                                {currentPage > 1 && (
                                    <button
                                        type="button"
                                        className="py-2 px-4 bg-gray-300 rounded-md text-gray-800"
                                        onClick={prevPage}
                                    >
                                        Previous
                                    </button>
                                )}
                                {currentPage < 4 && (
                                    <button
                                        type="button"
                                        className="py-2 px-4 bg-gray-300 rounded-md text-gray-800"
                                        onClick={nextPage}
                                    >
                                        Next
                                    </button>
                                )}
                            </div>


                            {/* Submit Button */}
                            {currentPage === 4 && (
                                <div className="flex items-center justify-center py-4 px-8">
                                    <button
                                        type="submit"
                                        className="py-2 px-4 bg-gray-300 rounded-md text-gray-800"
                                    >
                                        Submit
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Upload Document Section */}
                    <div className="py-6 px-4 h-[500px] md:h-full bg-gray-200 grid grid-cols-1 grid-rows-5">
                        <h2 className="text-xl lg:text-2xl text-center md:text-start font-semibold text-gray-800">Auto Fill</h2>
                        <div className="row-span-4 flex flex-col items-center justify-center">
                            <div className="flex justify-center md:justify-start items-center gap-4">
                                <div className="w-full p-3">
                                    <div className="relative border-dotted h-48 rounded-lg border-dashed border-2 border-gray-400 bg-gray-100 flex justify-center items-center">
                                        <div className="absolute">
                                            <div className="flex flex-col items-center">
                                                <i className="fa fa-folder-open fa-4x text-gray-500"></i>
                                                <span className="block text-gray-400 font-normal">Attach your files here</span>
                                            </div>
                                        </div>
                                        <input
                                            type="file"
                                            className="h-full w-full opacity-0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
