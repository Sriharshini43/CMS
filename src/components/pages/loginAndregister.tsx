import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-black text-white overflow-hidden">
      {/* Left Section */}
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 px-6 py-8 md:p-8 min-h-screen">
        <h1 className="text-3xl font-bold">CricketTMS</h1>
        <p className="text-white mb-4 text-center">Manage your cricket tournament, teams, and matches</p>

        {/* Toggle Buttons */}
        <div className="bg-gray-700 p-1 mb-8 mt-4 w-full max-w-md rounded-lg">
          <div className="flex gap-2">
            <Button 
              className={`flex-1 border-black p-2 transition-colors rounded-md hover:bg-gray-400 ${!isRegister ? "bg-white text-black" : "bg-black text-white"}`}
              onClick={() => setIsRegister(false)}
            >
              Log in
            </Button>
            <Button 
              className={`flex-1 p-2 transition-colors rounded-md hover:bg-gray-400 ${isRegister ? "bg-white text-black" : "bg-black text-white"}`}
              onClick={() => setIsRegister(true)}
            >
              Register
            </Button>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4 text-center">{isRegister ? "Create an Account" : "Welcome Back"}</h2>
          <p className="text-white mb-6 text-center">{isRegister ? "Join CricketTMS and start your cricket journey" : "Login to your CricketTMS account"}</p>

          {/* Register Form */}
          {isRegister ? (
            <form className="space-y-6">
              <div className="space-y-2">
                <Label>Username*</Label>
                <Input type="text" placeholder="Enter your username" className="bg-black text-white border border-gray-600 p-3 rounded-md hover:border-white" />
              </div>

              <div className="space-y-2">
                <Label>Email*</Label>
                <Input type="email" placeholder="Enter your email" className="bg-black text-white border border-gray-600 p-3 rounded-md hover:border-white" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative space-y-2">
                  <Label>Password*</Label>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} placeholder="Enter your password" className="bg-black text-white border border-gray-600 p-3 rounded-md hover:border-white pr-10" />
                    <button type="button" className="absolute right-3 top-3" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                </div>
                <div className="relative space-y-2">
                  <Label>Confirm Password*</Label>
                  <div className="relative">
                    <Input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" className="bg-black text-white border border-gray-600 p-3 rounded-md hover:border-white pr-10" />
                    <button type="button" className="absolute right-3 top-3" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label>Role*</Label>
                <Select onValueChange={(value) => setSelectedRole(value)}>
                  <SelectTrigger className="bg-black text-white border border-gray-600 w-full p-3 rounded-md hover:border-white">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent className="bg-black text-white border border-gray-600 rounded-md">
                    <SelectItem value="organizer">Tournament Organizer</SelectItem>
                    <SelectItem value="manager">Team Manager</SelectItem>
                    <SelectItem value="player">Player</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full bg-white text-black p-3 rounded-md hover:bg-gray-300">Register</Button>
            </form>
          ) : (
            <form className="space-y-6">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="Enter your email" className="bg-black text-white border border-gray-600 p-3 rounded-md hover:border-white" />
              </div>

              <div className="relative space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} placeholder="Enter your password" className="bg-black text-white border border-gray-600 p-3 rounded-md hover:border-white pr-10" />
                  <button type="button" className="absolute right-3 top-3" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
              </div>

              <Button className="w-full bg-white text-black p-3 rounded-md hover:bg-gray-300">Log in</Button>
            </form>
          )}
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="hidden md:flex w-full md:w-1/2 items-center justify-center bg-black min-h-screen p-4">
        <img src="/image/pic.png" alt="Cricket Artwork" className="object-contain max-h-full max-w-full rounded-lg shadow-lg" />
      </div>
    </div>
  );
}
