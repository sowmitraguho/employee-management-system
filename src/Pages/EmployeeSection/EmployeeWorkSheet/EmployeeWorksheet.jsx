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

const EmployeeWorksheet = () => {

    //new usestate
    const [workName, setWorkName] = useState("");
    const [designation, setDesignation] = useState("");
    const [taskType, setTaskType] = useState("");
    const [assignedDate, setAssignedDate] = useState(new Date());
    const [completionDate, setCompletionDate] = useState(new Date());
    const [finishHour, setFinishHour] = useState('');
    const [status, setStatus] = useState("");
    const [remarks, setRemarks] = useState("");




    const { loggedInUser } = useContext(AuthContext);
    const { getWorksByEmail } = useAxiosGetData();

    // Local states
    const [task, setTask] = useState("Sales");
    const [hours, setHours] = useState(0);
    const [date, setDate] = useState(new Date());
    const [works, setWorks] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

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





    return (
        <div>
            <div className="p-6 space-y-6">
                {/* Form in a single row */}
                {/* <div className="flex items-center gap-4">
                    <Select value={task} onValueChange={setTask}>
                        <SelectTrigger className="w-[150px]">
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
                        placeholder="Hours Worked"
                        value={hours}
                        onChange={(e) => setHours(parseInt(e.target.value))}
                        className="w-[150px]"
                    />

                    <DatePicker
                        selected={date}
                        onChange={(d) => setDate(d)}
                        className="border rounded-md p-2"
                    />

                    <Button >Add / Submit</Button>
                </div> */}
                <div className="flex flex-wrap items-center gap-4">

                    {/* ✅ Work Name (Dropdown populated from DB + manual entry) */}
                    <Select value={workName} onValueChange={setWorkName}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select Work Name" />
                        </SelectTrigger>
                        <SelectContent>
                            {/* ✅ Existing work names from DB */}
                            {works?.map((w) => (
                                <SelectItem key={w._id} value={w.workName}>
                                    {w.workName}
                                </SelectItem>
                            ))}
                            {/* ✅ Static fallback options */}
                            <SelectItem value="New Feature Development">New Feature Development</SelectItem>
                            <SelectItem value="UI Redesign">UI Redesign</SelectItem>
                            <SelectItem value="API Integration">API Integration</SelectItem>
                            <SelectItem value="Sales">Sales</SelectItem>
                            <SelectItem value="Support">Support</SelectItem>
                            <SelectItem value="Content">Content</SelectItem>
                            <SelectItem value="Paper-work">Paper-work</SelectItem>
                            <SelectItem value="Research">Research</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* ✅ Task Type */}
                    {/* ✅ Assigned Date */}
                    <DatePicker
                        //selected={assignedDate}
                        onChange={(d) => setAssignedDate(d)}
                        className="border rounded-md p-2"
                        placeholderText="Assigned Date"
                    />

                    {/* ✅ Completion Date */}
                    <DatePicker
                        //selected={completionDate}
                        onChange={(d) => setCompletionDate(d)}
                        className="border rounded-md p-2"
                        placeholderText="Completion Date"
                    />

                    {/* ✅ Hours Worked */}
                    <Input
                        type="number"
                        placeholder="Finish Hours"
                        value={finishHour}
                        onChange={(e) => setFinishHour(parseInt(e.target.value))}
                        className="w-[120px]"
                    />

                    

                    {/* ✅ Status */}
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="reassigned">Reassigned</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* ✅ Remarks */}
                    <Input
                        type="text"
                        placeholder="Remarks"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="w-[200px]"
                    />

                    {/* ✅ Submit */}
                    <Button > Submit</Button>
                </div>


                {/* Table */}
                <table className="w-full border text-left">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2">Work Name</th>

                            <th className="p-2">Assigned Date</th>
                            <th className="p-2">Completion Date</th>
                            <th className="p-2">Hours</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Task Type</th>
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


                                {/* ✅ Task Type */}
                                <td className="p-2">{work.taskType}</td>

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