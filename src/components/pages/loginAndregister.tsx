import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OTPInput } from "@/components/ui/otpInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [forgotStep, setForgotStep] = useState(1);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewConfirmPassword, setShowNewConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = () => {
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError("");

    setTimeout(() => {
      setForgotStep(2);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-black text-white overflow-hidden">
      {/* Left Section */}
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 px-6 py-8 md:p-8 min-h-screen">
        <h1 className="text-3xl font-bold">CricketTMS</h1>
        <p className="text-white mb-4 text-center">
          Manage your cricket tournament, teams, and matches
        </p>

        {!isForgotPassword && (
          <div className="bg-[#27272A] p-1 mb-8 mt-4 w-full max-w-md rounded-lg">
            <div className="flex gap-2">
              <Button
                className={`flex-1 p-2 rounded-md transition-colors hover:bg-gray-400 ${
                  !isRegister ? "bg-white text-black" : "bg-[#27272A] text-white"
                }`}
                onClick={() => {
                  setIsRegister(false);
                  setIsForgotPassword(false);
                }}
              >
                Log in
              </Button>
              <Button
                className={`flex-1 p-2 rounded-md transition-colors hover:bg-gray-400 ${
                  isRegister ? "bg-white text-black" : "bg-[#27272A] text-white"
                }`}
                onClick={() => {
                  setIsRegister(true);
                  setIsForgotPassword(false);
                }}
              >
                Register
              </Button>
            </div>
          </div>
        )}

        <div className="w-full max-w-md leading-1">
          {isForgotPassword ? (
            <form className="space-y-6">
              <h2 className="text-xl font-semibold mb-4 text-center">Forgot Password</h2>

              {forgotStep === 1 && (
                <>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="bg-black text-white border border-gray-600 p-3 rounded-md hover:border-white"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                  </div>
                  <Button
                    className="w-full bg-white text-black p-3 rounded-md hover:bg-gray-300"
                    onClick={handleSendOtp}
                    disabled={email.trim() === "" || loading}
                    type="button"
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </Button>
                </>
              )}

              {forgotStep === 2 && (
                <>
                  <div className="space-y-4">
                    <Label>One-Time Password</Label>
                    <p className="text-sm text-gray-400 text-center">
                      OTP sent to <span className="font-medium text-white">{email}</span>
                    </p>
                    <div className="flex justify-center">
                      <div className="w-full max-w-md">
                        <OTPInput value={otp} onChange={setOtp} />
                      </div>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-white text-black p-3 rounded-md hover:bg-gray-300"
                    onClick={() => setForgotStep(3)}
                    disabled={otp.length !== 6}
                    type="button"
                  >
                    Verify OTP
                  </Button>
                </>
              )}

              {forgotStep === 3 && (
                <>
                  <div className="relative space-y-2">
                    <Label>New Password</Label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="New password"
                        className="bg-black text-white border border-gray-600 p-3 rounded-md hover:border-white pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                    </div>
                  </div>

                  <div className="relative space-y-2">
                    <Label>Confirm Password</Label>
                    <div className="relative">
                      <Input
                        type={showNewConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        className="bg-black text-white border border-gray-600 p-3 rounded-md hover:border-white pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3"
                        onClick={() =>
                          setShowNewConfirmPassword(!showNewConfirmPassword)
                        }
                      >
                        {showNewConfirmPassword ? (
                          <Eye size={15} />
                        ) : (
                          <EyeOff size={15} />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-white text-black p-3 rounded-md hover:bg-gray-300"
                    onClick={() => {
                      setForgotStep(1);
                      setIsForgotPassword(false);
                      setEmail("");
                      setOtp("");
                    }}
                    type="button"
                  >
                    Reset Password
                  </Button>
                </>
              )}

              <p
                className="text-sm text-center underline text-gray-400 cursor-pointer mt-4"
                onClick={() => {
                  setIsForgotPassword(false);
                  setIsRegister(false);
                  setForgotStep(1);
                  setEmail("");
                  setOtp("");
                }}
              >
                Back to Login
              </p>
            </form>
          ) : isRegister ? (
            <>
              <h2 className="text-xl font-semibold mb-4 text-center">
                Create an Account
              </h2>
              <p className="text-white mb-6 text-center">
                Join CricketTMS and start your cricket journey
              </p>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label>Username*</Label>
                  <Input
                    type="text"
                    placeholder="Enter your username"
                    className="bg-black text-white border border-gray-600 p-3 rounded-md hover:border-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email*</Label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-black text-white border border-gray-600 p-3 rounded-md hover:border-white"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative space-y-2">
                    <Label>Password*</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="bg-black text-white border border-gray-600 p-3 rounded-md hover:border-white pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                    </div>
                  </div>
                  <div className="relative space-y-2">
                    <Label>Confirm Password*</Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="bg-black text-white border border-gray-600 p-3 rounded-md hover:border-white pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <Eye size={15} /> : <EyeOff size={15} />}
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
                      <SelectItem value="tournament_organizer">Tournament Organizer</SelectItem>
                      <SelectItem value="team_manager">Team Manager</SelectItem>
                      <SelectItem value="player">Player</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-white text-black p-3 rounded-md hover:bg-gray-300"
                >
                  Register
                </Button>
                <p
                  className="text-sm text-center underline text-gray-400 cursor-pointer"
                  onClick={() => setIsRegister(false)}
                >
                  Already have an account? Log in
                </p>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4 text-center">Welcome Back</h2>
              <p className="text-white mb-6 text-center">
                Login to your CricketTMS account
              </p>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-black text-white border border-gray-600 p-3 rounded-md hover:border-white"
                  />
                </div>
                <div className="relative space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="bg-black text-white border border-gray-600 p-3 rounded-md hover:border-white pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-end text-sm">
                    <p
                      className="underline text-gray-400 cursor-pointer"
                      onClick={() => setIsForgotPassword(true)}
                    >
                      Forgot password?
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <Button className="w-full bg-white text-black p-3 rounded-md hover:bg-gray-300">
                      Log in
                    </Button>
                  </div>

                  <p
                    className="text-sm text-center underline text-gray-400 cursor-pointer"
                    onClick={() => setIsRegister(true)}
                  >
                    Don't have an account? Register
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden md:flex w-full md:w-1/2 items-center justify-center bg-black min-h-screen p-4">
        <img
          src="/image/pic.png"
          alt="Cricket Artwork"
          className="object-contain max-h-full max-w-full rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}
