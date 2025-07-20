import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AuthContext } from '../../../Contexts/AuthContext/AuthContext';
import useAxiosGetData from '../../../Hooks/useAxiosGetData';
import useAxios from '../../../Hooks/useAxios';
import { FaRegEdit } from "react-icons/fa";
import Swal from 'sweetalert2';



const EmployeeWorksheet = () => {

    //usestates
    const [works, setWorks] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [completionDate, setCompletionDate] = useState(new Date());

    //required data and fuction
    const { loggedInUser } = useContext(AuthContext);
    const { getWorksByEmail } = useAxiosGetData();
    const { postData, putData, deleteData } = useAxios(import.meta.env.VITE_API_URL)


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
    }, [])

    //add new work to database
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

    // edit work in database
    const handleEditClick = (work) => {
        console.log(work);
        setEditData({ ...work });  // clone the selected work
        setEditModalOpen(true);
    };

    //update work through modal
    const handleUpdateWork = async () => {
        if (!editData) return;
        console.log("update modal edit data", editData);
        const { _id, ...updatedData } = editData;
        console.log(updatedData);
        try {

            const result = await putData(`/works/${_id}`, updatedData);

            // ✅ Update local state without refetch
            const res = await getWorksByEmail(loggedInUser.email);
            console.log('after data edit', result, res);

            setWorks(res);

            setEditModalOpen(false); // ✅ Close modal
        } catch (err) {
            console.error("❌ Failed to update work:", err.message);
        }
    };

    const handleDeleteWork = async (_id) => {
        console.log(_id);
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteData(`/works/${_id}`);
                const res = await getWorksByEmail(loggedInUser.email);
                console.log('after data delete', res);

                setWorks(res);
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });
            }
        });

    }




    return (
        <div>
            
            <div className="p-6 space-y-6">
                {/* Form in a single row */}
                <div className="shadow-md p-4 rounded-sm border border-blue-300 dark:border-gray-600">
                    <h2 className="text-xl text-blue-500 font-bold">Add New Task</h2>
                    <form
                        onSubmit={handleAddWork}
                        className="flex flex-wrap items-end gap-4"
                    >
                        {/* ✅ Work Name */}
                        <div className="flex flex-col">
                            <label
                                htmlFor="workName"
                                className="text-sm font-medium mb-1"
                            >
                                Work Name
                            </label>
                            <select
                                id="workName"
                                name="workName"
                                className="border p-2 rounded w-[200px] dark:bg-gray-800 dark:text-white"
                            >
                                {works?.map((w) => (
                                    <option key={w._id} value={w.workName}>
                                        {w.workName}
                                    </option>
                                ))}
                                <option value="New Feature Development">New Feature Development</option>
                                <option value="UI Redesign">UI Redesign</option>
                                <option value="API Integration">API Integration</option>
                            </select>
                        </div>

                        {/* ✅ Assigned Date */}
                        <div className="flex flex-col">
                            <label
                                htmlFor="assignedDate"
                                className="text-sm font-medium mb-1"
                            >
                                Assigned Date
                            </label>
                            
                            <DatePicker id="assignedDate" name="assignedDate"
                                className="border rounded-md p-2" selected={startDate} onChange={(date) => setStartDate(date)} />
                            
                        </div>

                        {/* ✅ Completion Date */}
                        <div className="flex flex-col">
                            <label
                                htmlFor="completionDate"
                                className="text-sm font-medium mb-1"
                            >
                                Completion Date
                            </label>
                            
                            <DatePicker id="completionDate" name="completionDate"
                                className="border rounded-md p-2" selected={completionDate} onChange={(date) => setCompletionDate(date)} />
                        </div>

                        {/* ✅ Hours Worked */}
                        <div className="flex flex-col">
                            <label
                                htmlFor="finishHour"
                                className="text-sm font-medium mb-1"
                            >
                                Hours Worked
                            </label>
                            <input
                                id="finishHour"
                                type="number"
                                name="finishHour"
                                placeholder="Finish Hours"
                                className="border rounded-md p-2 w-[120px]"
                            />
                        </div>

                        {/* ✅ Status */}
                        <div className="flex flex-col">
                            <label
                                htmlFor="status"
                                className="text-sm font-medium mb-1"
                            >
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                className="border rounded-md p-2 w-[140px] dark:bg-gray-800 dark:text-white"
                            >
                                <option value="accepted">Accepted</option>
                                <option value="pending">Pending</option>
                                <option value="reassigned">Reassigned</option>
                            </select>
                        </div>

                        {/* ✅ Remarks */}
                        <div className="flex flex-col">
                            <label
                                htmlFor="remarks"
                                className="text-sm font-medium mb-1"
                            >
                                Remarks
                            </label>
                            <input
                                id="remarks"
                                type="text"
                                name="remarks"
                                placeholder="Remarks"
                                className="border rounded-md p-2 w-[200px]"
                            />
                        </div>

                        {/* ✅ Submit */}
                        <div className="flex flex-col justify-end">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded mt-auto"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>



                {/* Table */}
                <div className="shadow-md p-4 rounded-sm border border-blue-300 dark:border-gray-600">
                    <h2 className="text-xl text-blue-500 font-bold mb-2">Your Task</h2>
                    <table className="w-full border border-gray-200 rounded text-center dark:border-gray-600">
                        <thead>
                            <tr className="">
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
                                    <td className="flex p-2 space-x-2">
                                        <button
                                            onClick={() => handleEditClick(work)}
                                            className="flex items-center justify-start gap-2 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                        >
                                            <FaRegEdit /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteWork(work._id)}
                                            className="text-red-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                        >
                                            ❌ Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>

                {/* Edit Modal */}
                <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Work</DialogTitle>
                        </DialogHeader>

                        {editData && (
                            <div className="space-y-4">
                                {/* ✅ Work Name */}
                                <label className="block font-medium text-sm mb-1" htmlFor="workName">
                                    Work Name
                                </label>
                                <Input
                                    id="workName"
                                    value={editData.workName}
                                    onChange={(e) => setEditData({ ...editData, workName: e.target.value })}
                                    placeholder="Work Name"
                                />

                                {/* ✅ Assigned Date */}
                                <label className="block font-medium text-sm mb-1" htmlFor="assignedDate">
                                    Assigned Date
                                </label>
                                <Input
                                    id="assignedDate"
                                    type="date"
                                    value={editData.assignedDate}
                                    onChange={(e) => setEditData({ ...editData, assignedDate: e.target.value })}
                                />

                                {/* ✅ Completion Date */}
                                <label className="block font-medium text-sm mb-1" htmlFor="completionDate">
                                    Completion Date
                                </label>
                                <Input
                                    id="completionDate"
                                    type="date"
                                    value={editData.completionDate}
                                    onChange={(e) => setEditData({ ...editData, completionDate: e.target.value })}
                                />

                                {/* ✅ Hours Worked */}
                                <label className="block font-medium text-sm mb-1" htmlFor="finishHour">
                                    Hours Worked
                                </label>
                                <Input
                                    id="finishHour"
                                    type="number"
                                    value={editData.finishHour}
                                    onChange={(e) =>
                                        setEditData({ ...editData, finishHour: parseInt(e.target.value) || 0 })
                                    }
                                />

                                {/* ✅ Status */}
                                <label className="block font-medium text-sm mb-1" htmlFor="status">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    className="border rounded p-2 w-full"
                                    value={editData.status}
                                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                                >
                                    <option value="accepted">Accepted</option>
                                    <option value="pending">Pending</option>
                                    <option value="reassigned">Reassigned</option>
                                </select>

                                {/* ✅ Remarks */}
                                <label className="block font-medium text-sm mb-1" htmlFor="remarks">
                                    Remarks
                                </label>
                                <Input
                                    id="remarks"
                                    value={editData.remarks || ""}
                                    onChange={(e) => setEditData({ ...editData, remarks: e.target.value })}
                                    placeholder="Remarks"
                                />

                                {/* ✅ Buttons */}
                                <div className="flex justify-end gap-2">
                                    <Button variant="secondary" onClick={() => setEditModalOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleUpdateWork}>Update</Button>
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

