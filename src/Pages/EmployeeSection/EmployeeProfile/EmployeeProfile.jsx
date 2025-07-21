import React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { motion } from "framer-motion"

// ✅ Fake data
const performanceData = [
  { month: "Jan", tasks: 20 },
  { month: "Feb", tasks: 28 },
  { month: "Mar", tasks: 25 },
  { month: "Apr", tasks: 32 },
  { month: "May", tasks: 30 },
  { month: "Jun", tasks: 35 },
]

const works = [
  { title: "Backend API Optimization", status: "Completed" },
  { title: "Database Migration", status: "In Progress" },
  { title: "Payment Gateway Integration", status: "Completed" },
  { title: "Employee Attendance Module", status: "Pending" },
]

const skills = [
  { name: "Node.js", level: 85 },
  { name: "Express.js", level: 80 },
  { name: "MongoDB", level: 75 },
  { name: "React", level: 70 },
]

const certifications = [
  "Certified Backend Developer – 2024",
  "MongoDB Advanced Certificate",
  "AWS Cloud Practitioner",
]

const reviews = [
  { by: "HR - Jane Doe", feedback: "Very consistent and reliable in task delivery." },
  { by: "Admin - John Smith", feedback: "Strong technical expertise, needs slight improvement in documentation." },
]

export default function EmployeeProfile() {
  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ✅ Performance Graph */}
      <Card className="dark:bg-gray-900 shadow-lg">
        <CardHeader className='bg-gradient-to-r from-indigo-500 to-purple-500'>
          <CardTitle className="text-xl font-bold text-gray-200 dark:text-gray-100">
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={performanceData}>
              <Line type="monotone" dataKey="tasks" stroke="#4f46e5" strokeWidth={2} />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ✅ Works / Projects */}
      <Card className="dark:bg-gray-900 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500">
          <CardTitle className="text-xl font-bold text-gray-200 dark:text-gray-100">
            Recent Works & Projects
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {works.map((work, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2"
            >
              <span className="text-gray-700 dark:text-gray-300">{work.title}</span>
              <Badge
                variant={work.status === "Completed" ? "secondary" : "outline"}
                className={
                  work.status === "Completed"
                    ? "bg-green-500 text-white"
                    : work.status === "In Progress"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-500 text-white"
                }
              >
                {work.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ✅ Skills Section */}
      <Card className="dark:bg-gray-900 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500">
          <CardTitle className="text-xl font-bold text-gray-200 dark:text-gray-100">
            Skills & Expertise
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {skills.map((skill, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>{skill.name}</span>
                <span>{skill.level}%</span>
              </div>
              <Progress value={skill.level} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ✅ Certifications */}
      <Card className="dark:bg-gray-900 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500">
          <CardTitle className="text-xl font-bold text-gray-200 dark:text-gray-100">
            Certifications
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {certifications.map((cert, idx) => (
            <Badge key={idx} variant="secondary" className="bg-blue-600 text-white">
              {cert}
            </Badge>
          ))}
        </CardContent>
      </Card>

      {/* ✅ HR & Admin Reviews */}
      <Card className="dark:bg-gray-900 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-fuchsia-500">
          <CardTitle className="text-xl font-bold text-gray-200 dark:text-gray-100">
            HR & Admin Reviews
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="border-l-4 border-indigo-500 pl-4 text-gray-700 dark:text-gray-300"
            >
              <p className="italic">“{review.feedback}”</p>
              <span className="text-sm text-gray-500 dark:text-gray-400">- {review.by}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}
