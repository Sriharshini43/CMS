import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function TournamentRegistrationForm() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");

      const res = await fetch("http://localhost:3001/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: accessToken }),
      });

      if (res.ok) {
        localStorage.removeItem("access_token");
        setSuccess("Logged out successfully.");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        const data = await res.json();
        setError(data.message || "Logout failed.");
      }
    } catch (err) {
      setError("Something went wrong during logout.");
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className="min-h-screen bg-black text-white px-20 py-6">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-700 mb-4">
        <div>
          <h1 className="text-2xl font-bold">CricketTMS</h1>
          <p className="text-gray-400 text-sm">Organize. Play. Win</p>
        </div>
        <Button
          onClick={handleLogout}
          className="px-3 py-1 rounded-md hover:bg-gray-400 bg-white text-black flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Log out</span>
        </Button>
      </div>

      {/* Subheader */}
      <div className="pb-4 mb-4">
        <h2 className="text-xl font-semibold">Tournament Registration</h2>
        <p className="text-sm text-gray-400">Fill in the details to register your tournament</p>
      </div>

      {/* Form Card */}
      <div className="flex justify-center">
        <Card className="bg-black border border-gray-700 text-white w-full max-w-6xl rounded-2xl shadow-md">
          <CardContent className="p-6 space-y-6">
            {/* Tournament Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[ 
                { id: "tournament-name", label: "Tournament Name", placeholder: "ICC World Cup" },
                { id: "city", label: "City", placeholder: "Mumbai" },
                { id: "organizer-name", label: "Organizer Name", placeholder: "John Doe" },
                { id: "organizer-email", label: "Organizer Email", placeholder: "john@example.com", type: "email" },
                { id: "contact-number", label: "Contact Number", placeholder: "+91 9876543210", type: "tel" },
              ].map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <div className="border border-gray-600 rounded-md py-2 px-4 text-sm bg-black">
                    <Input
                      id={field.id}
                      type={field.type || "text"}
                      placeholder={field.placeholder}
                      className="bg-transparent text-white placeholder-gray-400 p-0 border-none focus-visible:ring-0"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Dates, Category, Pitch */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <div className="border border-gray-600 rounded-md py-2 px-4 text-sm bg-black">
                  <Input
                    id="start-date"
                    type="date"
                    className="bg-transparent text-white p-0 border-none focus-visible:ring-0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <div className="border border-gray-600 rounded-md py-2 px-4 text-sm bg-black">
                  <Input
                    id="end-date"
                    type="date"
                    className="bg-transparent text-white p-0 border-none focus-visible:ring-0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Tournament Category</Label>
                <div className="border border-gray-600 rounded-md py-2 px-4 text-sm bg-black">
                  <select
                    id="category"
                    className="w-full bg-black text-white border-none focus:outline-none"
                  >
                    <option className="bg-black text-white">Select</option>
                    <option className="bg-black text-white">Men</option>
                    <option className="bg-black text-white">Women</option>
                    <option className="bg-black text-white">U-19</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pitch Type */}
            <div className="space-y-2 w-full sm:w-1/3">
              <Label htmlFor="pitch-type">Pitch Type</Label>
              <div className="border border-gray-600 rounded-md py-2 px-4 text-sm bg-black">
                <select
                  id="pitch-type"
                  className="w-full bg-black text-white border-none focus:outline-none"
                >
                  <option className="bg-black text-white">Select</option>
                  <option className="bg-black text-white">Grass</option>
                  <option className="bg-black text-white">Turf</option>
                  <option className="bg-black text-white">Matting</option>
                </select>
              </div>
            </div>

            {/* ✅ Updated Logo Upload */}
            <div className="space-y-2">
              <Label htmlFor="tournament-logo">Tournament Logo</Label>
              <div
                className="flex items-center justify-center h-20 border border-gray-600 rounded-md bg-black text-sm text-gray-400 cursor-pointer"
                onClick={() => logoInputRef.current?.click()}
              >
                Upload Logo
              </div>
              <Input
                id="tournament-logo"
                type="file"
                accept="image/png, image/jpeg"
                ref={logoInputRef}
                className="hidden"
              />
              <p className="text-xs text-gray-400">PNG/JPG | Min 200x200px</p>
            </div>

            {/* ✅ Updated Banner Upload */}
            <div className="space-y-2">
              <Label htmlFor="tournament-banner">Tournament Banner</Label>
              <div
                className="flex items-center justify-center h-32 border border-gray-600 rounded-md bg-black text-sm text-gray-400 cursor-pointer"
                onClick={() => bannerInputRef.current?.click()}
              >
                Upload Banner
              </div>
              <Input
                id="tournament-banner"
                type="file"
                accept="image/png, image/jpeg"
                ref={bannerInputRef}
                className="hidden"
              />
              <p className="text-xs text-gray-400">PNG/JPG | Recommended 1200x400px</p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="tournament-description">Description</Label>
              <div className="border border-gray-600 rounded-md px-4 py-2 bg-black">
                <Textarea
                  id="tournament-description"
                  placeholder="Write a short description of the tournament..."
                  className="bg-transparent text-white placeholder-gray-400 border-none h-32 focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Next Button */}
            <div className="flex justify-end pt-6">
              <Button className="bg-white text-black hover:bg-gray-200">
                Next →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
