import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function TeamRegistrationForm() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogout = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
    
        const res = await fetch("http://localhost:3001/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: accessToken }), // send access token only
        });
    
        if (res.ok) {
          // Clear token from storage
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
  
    // Auto-clear messages
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
