import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AuthContext } from '../../../Contexts/AuthContext/AuthContext';
import useAxiosGetData from '../../../Hooks/useAxiosGetData';
import useAxios from '../../../Hooks/useAxios';

const EmployeeWorksheet = () => {

    //usestates
    const [works, setWorks] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    //required data and fuction
    const { loggedInUser } = useContext(AuthContext);
    const { getWorksByEmail } = useAxiosGetData();
    const { postData } = useAxios(import.meta.env.VITE_API_URL)


    //fetch data of user
    useEffect(() => {
        const fetchWorks = async () => {
            try {
                const result = await getWorksByEmail(loggedInUser.email);
                if (result) {
                    console.log(result);
                    setWorks(result);
                }
            } catch (err) {
                console.error(err.message);
            }
        };

        if (loggedInUser?.email) {
            fetchWorks();
        }
    }, [loggedInUser.email])


    const handleAddWork = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const newWork = {
            workName: formData.get("workName"),
            assignedDate: formData.get("assignedDate"),
            completionDate: formData.get("completionDate"),
            finishHour: parseInt(formData.get("finishHour")) || 0,
            status: formData.get("status"),
            remarks: formData.get("remarks"),
            email: loggedInUser?.email || "unknown@user.com",
        };

        try {
            // ✅ 1. Save to DB
            await postData("/works", newWork);

            // ✅ 2. Fetch updated works
            const res = await getWorksByEmail(loggedInUser.email);
            console.log(res);
            
            setWorks(res);

            // ✅ 4. Reset form
            e.target.reset();
        } catch (err) {
            console.error("❌ Failed to add work:", err.message);
        }
    };




    return (
        <div>
            <div className="p-6 space-y-6">
                {/* Form in a single row */}
                <h2 className="text-xl text-blue-500 font-bold">Add New Task</h2>
                <form
                    onSubmit={handleAddWork}
                    className="flex flex-wrap items-center gap-4"
                >
                    {/* ✅ Work Name */}
                    <select name="workName" className="border p-2 rounded w-[200px]">
                        {works?.map((w) => (
                            <option key={w._id} value={w.workName}>
                                {w.workName}
                            </option>
                        ))}
                        <option value="New Feature Development">New Feature Development</option>
                        <option value="UI Redesign">UI Redesign</option>
                        <option value="API Integration">API Integration</option>
                    </select>

                    {/* ✅ Assigned Date */}
                    <input
                        type="date"
                        name="assignedDate"
                        className="border rounded-md p-2"
                    />

                    {/* ✅ Completion Date */}
                    <input
                        type="date"
                        name="completionDate"
                        className="border rounded-md p-2"
                    />

                    {/* ✅ Hours Worked */}
                    <input
                        type="number"
                        name="finishHour"
                        placeholder="Finish Hours"
                        className="border rounded-md p-2 w-[120px]"
                    />

                    {/* ✅ Status */}
                    <select name="status" className="border rounded-md p-2 w-[140px]">
                        <option value="accepted">Accepted</option>
                        <option value="pending">Pending</option>
                        <option value="reassigned">Reassigned</option>
                    </select>

                    {/* ✅ Remarks */}
                    <input
                        type="text"
                        name="remarks"
                        placeholder="Remarks"
                        className="border rounded-md p-2 w-[200px]"
                    />

                    {/* ✅ Submit */}
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Submit
                    </button>
                </form>


                {/* Table */}
                <h2 className="text-xl text-blue-500 font-bold">Your Task</h2>
                <table className="w-full border text-left">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2">Work Name</th>

                            <th className="p-2">Assigned Date</th>
                            <th className="p-2">Completion Date</th>
                            <th className="p-2">Hours</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {works.map((work) => (
                            <tr key={work._id} className="border-t">
                                {/* ✅ Work Name */}
                                <td className="p-2">{work.workName}</td>


                                {/* ✅ Assigned Date */}
                                <td className="p-2">
                                    {new Date(work.assignedDate).toLocaleDateString()}
                                </td>

                                {/* ✅ Completion Date */}
                                <td className="p-2">
                                    {new Date(work.completionDate).toLocaleDateString()}
                                </td>

                                {/* ✅ Hours Worked */}
                                <td className="p-2">{work.finishHour} hrs</td>

                                {/* ✅ Status */}
                                <td
                                    className={`p-2 font-medium ${work.status === "accepted"
                                        ? "text-green-600"
                                        : work.status === "pending"
                                            ? "text-yellow-600"
                                            : "text-red-600"
                                        }`}
                                >
                                    {work.status}
                                </td>



                                {/* ✅ Actions */}
                                <td className="p-2 space-x-2">
                                    <button
                                        // onClick={() => handleEditClick(work)}
                                        className="text-blue-500 hover:underline"
                                    >
                                        🖊 Edit
                                    </button>
                                    <button
                                        // onClick={() => handleDeleteWork(work._id)}
                                        className="text-red-500 hover:underline"
                                    >
                                        ❌ Delete
                                    </button>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>

                {/* Edit Modal */}
                <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Work</DialogTitle>
                        </DialogHeader>

                        {editData && (
                            <div className="space-y-4">
                                <Select value={editData.task} onValueChange={(val) => setEditData({ ...editData, task: val })}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Task" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Sales">Sales</SelectItem>
                                        <SelectItem value="Support">Support</SelectItem>
                                        <SelectItem value="Content">Content</SelectItem>
                                        <SelectItem value="Paper-work">Paper-work</SelectItem>
                                        <SelectItem value="Research">Research</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Input
                                    type="number"
                                    value={editData.hours}
                                    onChange={(e) => setEditData({ ...editData, hours: parseInt(e.target.value) })}
                                />

                                <DatePicker
                                    selected={new Date(editData.date)}
                                    onChange={(d) => setEditData({ ...editData, date: d })}
                                    className="border rounded-md p-2"
                                />

                                <div className="flex justify-end gap-2">
                                    <Button variant="secondary" onClick={() => setEditModalOpen(false)}>Cancel</Button>
                                    <Button >Update</Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default EmployeeWorksheet;