import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function TeamRegistrationForm() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const teamLogoInputRef = useRef<HTMLInputElement>(null);
  const [teamFileName, setTeamFileName] = useState("No file chosen");

  const handleTeamFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setTeamFileName(file ? file.name : "No file chosen");
  };

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

      {/* Subheader */}
      <div className="pb-4 mb-4">
        <h2 className="text-xl font-semibold">Team Registration</h2>
        <p className="text-sm text-gray-400">Fill in the details to register your team</p>
      </div>

      {/* Form Card */}
      <div className="flex justify-center">
        <Card className="bg-black border border-gray-700 text-white w-full max-w-3xl rounded-2xl shadow-md">
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Team information</h3>
              <p className="text-sm text-gray-400">
                Provide all the required information about your team
              </p>
            </div>

            {/* Team Name & Venue */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="team-name">Team name</Label>
                <div className="border border-gray-600 rounded-md py-2 px-4 text-sm bg-black">
                  <Input
                    id="team-name"
                    placeholder="Chennai Super Kings"
                    className="bg-transparent text-white placeholder-gray-400 p-0 border-none focus-visible:ring-0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="home-venue">Home Venue</Label>
                <div className="border border-gray-600 rounded-md py-2 px-4 text-sm bg-black">
                  <Input
                    id="home-venue"
                    placeholder="M.A Chidambaram stadium"
                    className="bg-transparent text-white placeholder-gray-400 p-0 border-none focus-visible:ring-0"
                  />
                </div>
              </div>
            </div>

            {/* Team Logo */}
            <div className="space-y-2 w-full">
              <label htmlFor="team-logo" className="text-white text-sm">
                Team Logo
              </label>

              <div
                className="h-20 w-full border border-gray-600 rounded-md bg-black text-sm text-gray-400 cursor-pointer flex justify-center items-center space-x-4"
                onClick={() => teamLogoInputRef.current?.click()}
              >
                <span className="text-white font-medium">Upload Logo</span>
                <span className="text-xs truncate max-w-[50%]">{teamFileName}</span>
              </div>

              <input
                id="team-logo"
                type="file"
                accept="image/png, image/jpeg"
                ref={teamLogoInputRef}
                className="hidden"
                onChange={handleTeamFileChange}
              />

              <p className="text-xs text-gray-400">
                Upload a square logo image (PNG, JPG) with a minimum size of 200x200px.
              </p>
            </div>

            {/* Owner Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: "owner-name", label: "Owner name", placeholder: "Kitbill" },
                { id: "owner-email", label: "Owner Email", placeholder: "Kitbill@gmail.com", type: "email" },
                { id: "owner-phone", label: "Owner Phone", placeholder: "+91 9876543210", type: "tel" },
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

            {/* Team Motto */}
            <div className="space-y-2 pb-25">
              <Label htmlFor="team-motto">Team motto</Label>
              <div className="border border-gray-600 rounded-md px-4 py-2 bg-black">
                <Textarea
                  id="team-motto"
                  placeholder="Enter your team's motto or a brief description"
                  className="bg-transparent text-white placeholder-gray-400 border-none h-32 focus-visible:ring-0"
                />
              </div>
              <p className="text-xs text-gray-400">
                A short description or motto that represents your team.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-8">
              <Button variant="ghost" className="border border-gray-600 text-white">
                Cancel
              </Button>
              <Button className="bg-white text-black hover:bg-gray-200">
                Register Team
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
