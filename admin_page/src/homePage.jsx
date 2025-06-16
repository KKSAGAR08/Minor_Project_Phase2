import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

export default function Component() {
  const handleAdminClick = () => {
    console.log("Admin login clicked")
    navigate('/adminlogin')
  }

  const handleStudentClick = () => {
    console.log("Student login clicked")
    navigate('/stdlogin')
  }

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Hostel Management System</h1>
          </div>

          <nav className="flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Photos
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Testimonial
            </a>
            <Button variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50">
              Admin
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="max-w-4xl">
          {/* Hero Section */}
          <div className="mb-12">
            <h1 className="text-6xl font-bold text-blue-500 mb-6 leading-tight">Hostel Management System</h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
              All-in-one solution for managing your hostel operations. Streamline bookings, payments, and guest
              management with our intuitive platform.
            </p>
          </div>

          {/* Login Buttons */}
          <div className="flex space-x-4">
            <Button
              onClick={handleAdminClick}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg font-medium rounded-lg"
            >
              Admin
            </Button>
            <Button
              onClick={handleStudentClick}
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-50 px-8 py-3 text-lg font-medium rounded-lg"
            >
              Student
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
