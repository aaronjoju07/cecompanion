'use client'

import { useState } from "react";


export default function RegisterEvent() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
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

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log('Max Students:', maxStudents);
        console.log('Department:', department);
        console.log('College Name:', collegeName);
        console.log('Max Events:', maxEvents);
        console.log('Rules:', rules);
        console.log('Overview:', overview);
        console.log('Agenda:', agenda);
        console.log('Venue:', venue);
        console.log('Target Audience:', targetAudience);
        console.log('Courses:', courses);
        console.log('Contact 1:', contact1);
        console.log('Contact 2:', contact2);
        console.log('Website:', website);
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('File:', file);
        alert('Form submitted successfully!');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold text-gray-900">Event Registration</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Please fill out the form below to register your event.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-900">Name</label>
                        <div className="mt-2">
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email</label>
                        <div className="mt-2">
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-4">
                        <label htmlFor="file" className="block text-sm font-medium text-gray-900">File</label>
                        <div className="mt-2">
                            <input
                                type="file"
                                id="file"
                                // onChange={(e) => setFile(e.target.files[0])}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-4">
                        <label htmlFor="maxStudents" className="block text-sm font-medium text-gray-900">Max Students</label>
                        <div className="mt-2">
                            <input
                                type="number"
                                id="maxStudents"
                                value={maxStudents}
                                onChange={(e) => setMaxStudents(e.target.value)}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-4">
                        <label htmlFor="department" className="block text-sm font-medium text-gray-900">Department</label>
                        <div className="mt-2">
                            <input
                                type="text"
                                id="department"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-4">
                        <label htmlFor="collegeName" className="block text-sm font-medium text-gray-900">College Name</label>
                        <div className="mt-2">
                            <input
                                type="text"
                                id="collegeName"
                                value={collegeName}
                                onChange={(e) => setCollegeName(e.target.value)}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-4">
                        <label htmlFor="maxEvents" className="block text-sm font-medium text-gray-900">Max Events</label>
                        <div className="mt-2">
                            <input
                                type="number"
                                id="maxEvents"
                                value={maxEvents}
                                onChange={(e) => setMaxEvents(e.target.value)}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
                            />
                        </div>
                    </div>

                    <div className="col-span-full">
                        <label htmlFor="rules" className="block text-sm font-medium text-gray-900">Rules</label>
                        <div className="mt-2">
                            <textarea
                                id="rules"
                                value={rules}
                                onChange={(e) => setRules(e.target.value)}
                                rows={3}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
                            />
                        </div>
                    </div>

                    <div className="col-span-full">
                        <label htmlFor="overview" className="block text-sm font-medium text-gray-900">Overview</label>
                        <div className="mt-2">
                            <textarea
                                id="overview"
                                value={overview}
                                onChange={(e) => setOverview(e.target.value)}
                                rows={3}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
                            />
                        </div>
                    </div>

                    <div className="col-span-full">
                        <label htmlFor="agenda" className="block text-sm font-medium text-gray-900">Agenda</label>
                        <div className="mt-2">
                            <textarea
                                id="agenda"
                                value={agenda}
                                onChange={(e) => setAgenda(e.target.value)}
                                rows={3}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-4">
                        <label htmlFor="venue" className="block text-sm font-medium text-gray-900">Venue</label>
                        <div className="mt-2">
                            <input
                                type="text"
                                id="venue"
                                value={venue}
                                onChange={(e) => setVenue(e.target.value)}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-4">
                        <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-900">Target Audience</label>
                        <div className="mt-2">
                            <input
                                type="text"
                                id="targetAudience"
                                value={targetAudience}
                                onChange={(e) => setTargetAudience(e.target.value)}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-4">
                        <label htmlFor="courses" className="block text-sm font-medium text-gray-900">Courses</label>
                        <div className="mt-2">
                            <input
                                type="text"
                                id="courses"
                                value={courses}
                                onChange={(e) => setCourses(e.target.value)}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-4">
                        <label htmlFor="contact1" className="block text-sm font-medium text-gray-900">Contact 1</label>
                        <div className="mt-2">
                            <input
                                type="text"
                                id="contact1"
                                value={contact1}
                                onChange={(e) => setContact1(e.target.value)}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-4">
                        <label htmlFor="contact2" className="block text-sm font-medium text-gray-900">Contact 2</label>
                        <div className="mt-2">
                            <input
                                type="text"
                                id="contact2"
                                value={contact2}
                                onChange={(e) => setContact2(e.target.value)}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-4">
                        <label htmlFor="website" className="block text-sm font-medium text-gray-900">Website</label>
                        <div className="mt-2">
                            <input
                                type="url"
                                id="website"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button type="button" className="text-sm font-semibold text-gray-900">
                    Cancel
                </button>
                <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600"
                >
                    Submit
                </button>
            </div>
        </form>
    );
}