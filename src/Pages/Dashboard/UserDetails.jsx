import React, { useContext, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Upload, Edit } from "lucide-react";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import { useOutletContext } from "react-router";
import axios from "axios";

const UserDetails = () => {
    const { loggedInUser } = useContext(AuthContext);
    const { currentUser } = useOutletContext();
    console.log('from user details', loggedInUser, currentUser);
    const baseURL = import.meta.env.VITE_API_URL;
    const [user, setUser] = useState({
        imageUrl: currentUser?.imageUrl,
        name: currentUser?.name,
        email: currentUser?.email,
        phone: currentUser?.phone,
        address: currentUser?.address,
        joiningDate: currentUser?.joiningDate,
        role: currentUser?.role,
        designation: currentUser?.designation,
        department: currentUser?.department,
        performanceRating: currentUser?.performanceRating,
        salary: currentUser?.salary,
    });

    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState(user);
    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (imagefile) => {
       // if (!file) return formData.image;

        const form = new FormData();
        form.append("image", imagefile);

        const res = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imgbbApiKey}`, {
            method: "POST",
            body: form,
        });
        const data = await res.json();
        console.log(data.data.display_url);
        setFile(data.data.display_url);
        return data.data.display_url;
    };

    const handleSave = async () => {
        const uploadedImage = file;
        const updatedUser = { ...formData, imageUrl: uploadedImage };
        const token = await loggedInUser.getIdToken(true);
        try {
            await axios.patch(
                `${baseURL}/vfusers/${currentUser._id}`,
                updatedUser,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setUser(updatedUser);
            setOpen(false);
        } catch (err) {
            console.error("Error updating user:", err.message, err.stack);
            
        }
    };



    return (
        <div className="max-w-7xl mx-auto my-12">
            <Card className="dark:bg-gray-900">
                <CardHeader className="flex justify-between items-center">
                    <CardTitle className="text-2xl dark:text-gray-100">Your Details Information</CardTitle>
                    <Button variant="outline" onClick={() => setOpen(true)}>
                        <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                </CardHeader>
                <CardContent className="flex gap-6 p-6">
                    <img
                        src={user.imageUrl}
                        alt={user.name}
                        className="w-32 h-32 rounded-full object-cover border-2 border-indigo-500"
                    />
                    <div className="space-y-2 text-gray-800 dark:text-gray-200">
                        <p><span className="font-semibold">Name:</span> {user.name}</p>
                        <p><span className="font-semibold">Email:</span> {user.email}</p>
                        <p><span className="font-semibold">Phone:</span> {user.phone}</p>
                        <p><span className="font-semibold">Address:</span> {user.address}</p>
                        <p><span className="font-semibold">Joining Date:</span> {user.joiningDate}</p>
                        <p><span className="font-semibold">Role:</span> {user.role}</p>
                        <p><span className="font-semibold">Designation:</span> {user.designation}</p>
                        <p><span className="font-semibold">Department:</span> {user.department}</p>
                        <p><span className="font-semibold">Salary:</span> {user.salary}</p>
                        <p><span className="font-semibold">Performance Rating:</span> {user.performanceRating}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="dark:bg-gray-900 dark:text-gray-200">
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label>Name</Label>
                            <Input name="name" defaultValue={formData.name} readOnly />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input name="email" defaultValue={formData.email} readOnly />
                        </div>
                        <div>
                            <Label>Phone</Label>
                            <Input name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Address</Label>
                            <Input name="address" value={formData.address} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Designation</Label>
                            <Input name="designation" value={formData.designation} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Department</Label>
                            <Input name="department" value={formData.department} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Salary</Label>
                            <Input name="salary" value={formData.salary} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Upload Image</Label>
                            <Input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0])} />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}>
                            <Upload className="w-4 h-4 mr-2" /> Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UserDetails;
