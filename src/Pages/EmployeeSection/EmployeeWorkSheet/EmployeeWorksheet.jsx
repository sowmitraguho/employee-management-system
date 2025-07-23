import React, { useContext, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AuthContext } from "../../../Contexts/AuthContext/AuthContext";
import useAxiosGetData from "../../../Hooks/useAxiosGetData";
import useAxios from "../../../Hooks/useAxios";
import { FaRegEdit } from "react-icons/fa";
import Swal from "sweetalert2";

const EmployeeWorksheet = () => {
  const [works, setWorks] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [completionDate, setCompletionDate] = useState(new Date());

  const { loggedInUser } = useContext(AuthContext);
  const { getWorksByEmail } = useAxiosGetData();
  const { postData, putData, deleteData } = useAxios(import.meta.env.VITE_API_URL);

  // ✅ Fetch works
  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const result = await getWorksByEmail(loggedInUser.email);
        if (result) setWorks(result);
      } catch (err) {
        console.error(err.message);
      }
    };
    if (loggedInUser?.email) fetchWorks();
  }, []);

  // ✅ Add new work
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
      await postData("/works", newWork);
      const res = await getWorksByEmail(loggedInUser.email);
      setWorks(res);
      e.target.reset();
    } catch (err) {
      console.error("❌ Failed to add work:", err.message);
    }
  };

  // ✅ Edit work
  const handleEditClick = (work) => {
    setEditData({ ...work });
    setEditModalOpen(true);
  };

  const handleUpdateWork = async () => {
    if (!editData) return;
    const { _id, ...updatedData } = editData;

    try {
      await putData(`/works/${_id}`, updatedData);
      const res = await getWorksByEmail(loggedInUser.email);
      setWorks(res);
      setEditModalOpen(false);
    } catch (err) {
      console.error("❌ Failed to update work:", err.message);
    }
  };

  // ✅ Delete work
  const handleDeleteWork = async (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb", // blue
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteData(`/works/${_id}`);
        const res = await getWorksByEmail(loggedInUser.email);
        setWorks(res);

        Swal.fire({
          title: "Deleted!",
          text: "Your task has been removed.",
          icon: "success",
        });
      }
    });
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-muted/40 dark:bg-gray-950 min-h-screen transition-colors">
      {/* ✅ Add Work Form */}
      <div className="shadow-md rounded-xl border border-blue-300 dark:border-gray-700 p-4 sm:p-6 bg-white dark:bg-gray-900">
        <h2 className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
          ➕ Add New Task
        </h2>

        <form
          onSubmit={handleAddWork}
          className="flex flex-wrap gap-4 items-end"
        >
          {/* Work Name */}
          <div>
            <label className="text-sm font-medium block mb-1">Work Name</label>
            <select
  name="workName"
  className="border rounded-md w-full p-2 dark:bg-gray-800 dark:text-gray-100"
>
  {works?.map((w) => (
    <option key={w._id} value={w.workName}>
      {w.workName}
    </option>
  ))}

  {/* ✅ Predefined IT-related tasks */}
  <option value="New Feature Development">New Feature Development</option>
  <option value="UI Redesign">UI Redesign</option>
  <option value="API Integration">API Integration</option>
  <option value="Bug Fixing & Debugging">Bug Fixing & Debugging</option>
  <option value="Database Optimization">Database Optimization</option>
  <option value="Security Patch Implementation">Security Patch Implementation</option>
  <option value="Performance Tuning">Performance Tuning</option>
  <option value="Cloud Deployment">Cloud Deployment</option>
  <option value="Automated Testing Setup">Automated Testing Setup</option>
  <option value="DevOps Pipeline Configuration">DevOps Pipeline Configuration</option>
  <option value="Third-Party Service Integration">Third-Party Service Integration</option>
  <option value="Documentation Update">Documentation Update</option>
  <option value="Version Upgrade & Migration">Version Upgrade & Migration</option>
</select>

          </div>

          {/* Assigned Date */}
          <div>
            <label className="text-sm font-medium block mb-1">Assigned Date</label>
            <DatePicker
              name="assignedDate"
              className="border rounded-md p-2 w-full dark:bg-gray-800 dark:text-gray-100"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
            />
          </div>

          {/* Completion Date */}
          <div>
            <label className="text-sm font-medium block mb-1">Completion Date</label>
            <DatePicker
              name="completionDate"
              className="border rounded-md p-2 w-full dark:bg-gray-800 dark:text-gray-100"
              selected={completionDate}
              onChange={(date) => setCompletionDate(date)}
            />
          </div>

          {/* Hours Worked */}
          <div>
            <label className="text-sm font-medium block mb-1">Hours Worked</label>
            <input
              name="finishHour"
              type="number"
              placeholder="Finish Hours"
              className="border rounded-md p-2 w-full dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium block mb-1">Status</label>
            <select
              name="status"
              className="border rounded-md p-2 w-full dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="accepted">Accepted</option>
              <option value="pending">Pending</option>
              <option value="reassigned">Reassigned</option>
            </select>
          </div>

          {/* Remarks */}
          <div>
            <label className="text-sm font-medium block mb-1">Remarks</label>
            <input
              name="remarks"
              type="text"
              placeholder="Remarks"
              className="border rounded-md p-2 w-full dark:bg-gray-800 dark:text-gray-100"
            />
          </div>

          {/* Submit */}
          <div className="flex sm:col-span-2 lg:col-span-1 items-end">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full hover:scale-110 font-semibold mb-1">
              Add Task
            </Button>
          </div>
        </form>
      </div>

      {/* ✅ Tasks Table */}
      <div className="shadow-md rounded-xl border border-blue-300 dark:border-gray-700 p-4 sm:p-6 bg-white dark:bg-gray-900">
        <h2 className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
          📋 Your Tasks
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-blue-100 dark:bg-gray-800">
              <tr>
                <th className="p-3">Work Name</th>
                <th className="p-3">Assigned Date</th>
                <th className="p-3">Completion Date</th>
                <th className="p-3">Hours</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {works.map((work) => (
                <tr
                  key={work._id}
                  className="border-t dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="p-3">{work.workName}</td>
                  <td className="p-3">{new Date(work.assignedDate).toLocaleDateString()}</td>
                  <td className="p-3">{new Date(work.completionDate).toLocaleDateString()}</td>
                  <td className="p-3">{work.finishHour} hrs</td>
                  <td
                    className={`p-3 font-medium ${
                      work.status === "accepted"
                        ? "text-green-600"
                        : work.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-500"
                    }`}
                  >
                    {work.status}
                  </td>
                  <td className="p-3 flex flex-wrap gap-2 justify-center">
                    <Button
                      variant="secondary"
                      onClick={() => handleEditClick(work)}
                      className="flex items-center gap-1 font-semibold bg-blue-300 hover:bg-blue-800 hover:text-gray-100 text-gray-900 hover:scale-110"
                    >
                      <FaRegEdit /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteWork(work._id)}
                      className='font-semibold hover:bg-red-500 hover:scale-110'
                    >
                      ❌ Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-blue-600 dark:text-blue-400">
              ✏️ Edit Work
            </DialogTitle>
          </DialogHeader>

          {editData && (
            <div className="space-y-4">
              <Input
                value={editData.workName}
                onChange={(e) => setEditData({ ...editData, workName: e.target.value })}
                placeholder="Work Name"
              />
              <Input
                type="date"
                value={editData.assignedDate}
                onChange={(e) => setEditData({ ...editData, assignedDate: e.target.value })}
              />
              <Input
                type="date"
                value={editData.completionDate}
                onChange={(e) =>
                  setEditData({ ...editData, completionDate: e.target.value })
                }
              />
              <Input
                type="number"
                value={editData.finishHour}
                onChange={(e) =>
                  setEditData({ ...editData, finishHour: parseInt(e.target.value) || 0 })
                }
              />
              <select
                className="border rounded-md p-2 w-full dark:bg-gray-800 dark:text-gray-100"
                value={editData.status}
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
              >
                <option value="accepted">Accepted</option>
                <option value="pending">Pending</option>
                <option value="reassigned">Reassigned</option>
              </select>
              <Input
                value={editData.remarks || ""}
                onChange={(e) => setEditData({ ...editData, remarks: e.target.value })}
                placeholder="Remarks"
              />

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
  );
};

export default EmployeeWorksheet;
