import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/Components/ui/dialog";
import { Upload, Edit, Camera, Mail, Phone, MapPin, Briefcase, Calendar, DollarSign, Star, Building } from "lucide-react";
import { AuthContext } from "../../Contexts/AuthContext/AuthContext";
import { useOutletContext } from "react-router";
import axios from "axios";
import useProtectedAxios from "../../Hooks/useProtectedAxios";

const UserDetails = () => {
    const { loggedInUser } = useContext(AuthContext);
    const { currentUser } = useOutletContext();
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
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageUpload = async (imagefile) => {
        if (!imagefile) return;

        try {
            // Preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(imagefile);

            // Upload
            const form = new FormData();
            form.append("image", imagefile);

            const res = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imgbbApiKey}`, {
                method: "POST",
                body: form,
            });
            const data = await res.json();
            if (data.success) {
                setFile(data.data.display_url);
                setFormData({ ...formData, imageUrl: data.data.display_url });
                setSuccess("Image uploaded successfully");
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (err) {
            setError("Failed to upload image");
            console.error("Image upload error:", err);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const uploadedImage = file || formData.imageUrl;
            const updatedUser = { ...formData, imageUrl: uploadedImage };
            
            const token = await loggedInUser.getIdToken(true);
            
            await useProtectedAxios.patch(
                `${baseURL}/users/${currentUser._id}`,
                updatedUser,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            setUser(updatedUser);
            setSuccess("Profile updated successfully!");
            setTimeout(() => {
                setOpen(false);
                setSuccess(false);
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Error updating profile");
            console.error("Error updating user:", err);
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" },
        },
    };

    const cardHoverVariants = {
        hover: {
            y: -8,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        },
    };

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-4 md:p-8 py-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div variants={itemVariants} className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-50 mb-2">
                        Your Profile Details
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        View and manage your personal and professional information
                    </p>
                </motion.div>

                {/* Main Card */}
                <motion.div variants={itemVariants}>
                    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                        {/* Card Header with Background */}
                        <div className="relative h-32 md:h-40 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-800">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400/5 rounded-full -mr-20 -mt-20"></div>
                        </div>

                        <CardContent className="px-6 md:px-8 pb-8 pt-6">
                            {/* Profile Header */}
                            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center -mt-20 relative z-10 mb-8">
                                {/* Profile Image */}
                                <div className="flex-shrink-0">
                                    <div className="relative w-40 h-40 rounded-2xl border-4 border-white dark:border-gray-900 bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
                                        <img
                                            src={user.imageUrl}
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                {/* Profile Info */}
                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                                        <div>
                                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-50 mb-2">
                                                {user.name}
                                            </h2>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-sm font-medium">
                                                    <Briefcase className="w-4 h-4 mr-2" />
                                                    {user.role}
                                                </span>
                                                <span className="inline-flex items-center px-3 py-1 rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-sm font-medium">
                                                    {user.designation}
                                                </span>
                                            </div>
                                        </div>
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Button
                                                onClick={() => {
                                                    setFormData(user);
                                                    setFile(null);
                                                    setPreview(null);
                                                    setOpen(true);
                                                }}
                                                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
                                            >
                                                <Edit className="w-4 h-4 mr-2" />
                                                Edit Profile
                                            </Button>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Contact Information */}
                                <motion.div
                                    variants={cardHoverVariants}
                                    whileHover="hover"
                                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6"
                                >
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
                                        Contact Information
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 break-all">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {user.phone || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {user.address || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Professional Information */}
                                <motion.div
                                    variants={cardHoverVariants}
                                    whileHover="hover"
                                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6"
                                >
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
                                        Professional Details
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <Building className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Department</p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {user.department || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Designation</p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {user.designation || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Performance Rating</p>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {user.performanceRating || "N/A"}
                                                    </p>
                                                    {user.performanceRating && (
                                                        <div className="flex gap-0.5">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-3 h-3 ${
                                                                        i < Math.round(user.performanceRating)
                                                                            ? "fill-yellow-400 text-yellow-400"
                                                                            : "text-gray-300 dark:text-gray-600"
                                                                    }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Employment Information */}
                                <motion.div
                                    variants={cardHoverVariants}
                                    whileHover="hover"
                                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6"
                                >
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
                                        Employment Details
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <Calendar className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Joining Date</p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {user.joiningDate || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Salary</p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {user.salary ? `$${user.salary.toLocaleString()}` : "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Briefcase className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Role</p>
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {user.role || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Edit Modal */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="max-h-[90vh] overflow-y-auto dark:bg-gray-900 dark:text-gray-200 dark:border-gray-800 max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Edit Your Profile</DialogTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                Update your personal and professional information
                            </p>
                        </DialogHeader>

                        {/* Status Messages */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-lg text-sm"
                            >
                                {success}
                            </motion.div>
                        )}

                        {/* Image Upload Section */}
                        <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
                            <Label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                                <Camera className="w-4 h-4 inline mr-2" />
                                Profile Picture
                            </Label>
                            <div className="flex gap-6 items-center">
                                <div className="relative w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-hidden">
                                    <img
                                        src={preview || formData.imageUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e.target.files?.[0])}
                                        className="cursor-pointer dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                        PNG, JPG, GIF up to 5MB
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-4">
                            {/* Read-only Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-semibold">Name</Label>
                                    <Input
                                        name="name"
                                        value={formData.name}
                                        readOnly
                                        className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Cannot be changed</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-semibold">Email</Label>
                                    <Input
                                        name="email"
                                        value={formData.email}
                                        readOnly
                                        className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 cursor-not-allowed"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Cannot be changed</p>
                                </div>
                            </div>

                            {/* Editable Fields */}
                            <div>
                                <Label className="text-sm font-semibold">Phone</Label>
                                <Input
                                    name="phone"
                                    value={formData.phone || ""}
                                    onChange={handleChange}
                                    placeholder="Enter your phone number"
                                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                                />
                            </div>

                            <div>
                                <Label className="text-sm font-semibold">Address</Label>
                                <Input
                                    name="address"
                                    value={formData.address || ""}
                                    onChange={handleChange}
                                    placeholder="Enter your address"
                                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-semibold">Designation</Label>
                                    <Input
                                        name="designation"
                                        value={formData.designation || ""}
                                        onChange={handleChange}
                                        placeholder="e.g. Senior Developer"
                                        className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                                    />
                                </div>
                                <div>
                                    <Label className="text-sm font-semibold">Department</Label>
                                    <Input
                                        name="department"
                                        value={formData.department || ""}
                                        onChange={handleChange}
                                        placeholder="e.g. Engineering"
                                        className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm font-semibold">Joining Date</Label>
                                <Input
                                    name="joiningDate"
                                    type="date"
                                    value={formData.joiningDate || ""}
                                    onChange={handleChange}
                                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                                />
                            </div>

                            <div>
                                <Label className="text-sm font-semibold">Salary</Label>
                                <Input
                                    name="salary"
                                    type="number"
                                    value={formData.salary || ""}
                                    onChange={handleChange}
                                    placeholder="Enter salary amount"
                                    className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                                />
                            </div>
                        </div>

                        {/* Dialog Footer */}
                        <DialogFooter className="gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
                            <Button
                                variant="outline"
                                onClick={() => setOpen(false)}
                                disabled={loading}
                                className="dark:border-gray-700 dark:text-gray-300"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {loading ? (
                                    <>
                                        <span className="animate-spin mr-2">⏳</span>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </motion.div>
    );
};

export default UserDetails;