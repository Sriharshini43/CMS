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
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewConfirmPassword, setShowNewConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [forgotStep, setForgotStep] = useState(1);
  const [success, setSuccess] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: ""
  });

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 2000); // Hide after 4 seconds
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 4000); // Hide after 4 seconds
      return () => clearTimeout(timer);
    }
  }, [error]);
  
  const handleSendOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3001/api/auth/forgotpass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("OTP sent to your email.");
        setForgotStep(2);
      } else {
        setError(data.message || "Failed to send OTP.");
      }
    } catch {
      setError("Server error.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return setError("Invalid OTP.");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/auth/verifyOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("otp_token", data.token); // Save token for reset
        setSuccess("OTP verified.");
        setForgotStep(3);
      } else {
        setError(data.message || "OTP verification failed.");
      }
    } catch {
      setError("Server error.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    if (newPassword !== newConfirmPassword) {
      return setError("Passwords do not match.");
    }

    const token = localStorage.getItem("otp_token");
    console.log("Using token for reset password:", token);
    if (!token) {
      setError("Session expired. Please request OTP again.");
      setForgotStep(1);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/auth/restPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Password reset successful. Please login.");
        localStorage.removeItem("otp_token");
        setTimeout(() => {
          setIsForgotPassword(false);
          setForgotStep(1);
        }, 2000);
      } else {
        setError(data.message || "Reset failed.");
      }
    } catch {
      setError("Server error.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = loginData;
    setError("");
    setSuccess("");
    setLoading(true);
  
    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      let data: any = {};
      try {
        data = await res.json(); // attempt to parse JSON even on error
      } catch (jsonError) {
        console.error("Failed to parse JSON:", jsonError);
      }
  
      if (res.ok) {
        setSuccess("Login successful!");
        localStorage.setItem("access_token", data.token);
  
        switch (data.role) {
          case "player":
            navigate("/playerdashboard");
            break;
          case "team_manager":
            navigate("/teamregister");
            break;
          case "tournament_orgniser":
            navigate("/tournamentregister");
            break;
          default:
            setError("Unrecognized role. Contact admin.");
            break;
        }
      } else {
        setError(data.message || data.error || "Login failed.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };  

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const { username, email, password, confirmPassword, role } = registerData;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role })
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess("Registered successfully! Please log in.");
        setIsRegister(false);
        setRegisterData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: ""
        });
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch {
      setError("Something went wrong. Try again later.");
    }
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
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="bg-black text-white border border-gray-600 p-3 rounded-md hover:border-white"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {success && <p className="text-green-500 text-sm">{success}</p>}
                  </div>
                  <Button
                    className="w-full bg-white text-black p-3 rounded-md hover:bg-gray-300"
                    type="button"
                    onClick={handleSendOtp}
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
                      OTP sent to <span className="font-medium text-white">{forgotEmail}</span>
                    </p>
                    <div className="flex justify-center">
                      <div className="w-full max-w-md">
                        <OTPInput value={otp} onChange={setOtp} />
                      </div>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-white text-black p-3 rounded-md hover:bg-gray-300"
                    onClick={handleVerifyOtp}
                    disabled={otp.length !== 6}
                    type="button"
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
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
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
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
                        value={newConfirmPassword}
                        onChange={(e) => setNewConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="bg-black text-white border border-gray-600 p-3 rounded-md hover:border-white pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3"
                        onClick={() => setShowNewConfirmPassword(!showNewConfirmPassword)}
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
                    type="button"
                    onClick={handleResetPassword}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </Button>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  {success && <p className="text-green-500 text-sm">{success}</p>}
                </>
              )}

              <p
                className="text-sm text-center underline text-gray-400 cursor-pointer mt-4"
                onClick={() => {
                  setIsForgotPassword(false);
                  setError("");
                  setSuccess("");
                  setForgotStep(1);
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
                    value={registerData.username} onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                    placeholder="Enter your username"
                    className="bg-black text-white border border-gray-600 p-3 rounded-md hover:border-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email*</Label>
                  <Input
                    type="email"
                    value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
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
                        value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
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
                        value={registerData.confirmPassword} onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })} 
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
                  <Select onValueChange={(value)  => setRegisterData({ ...registerData, role: value })}>
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
                  onClick={handleRegister}
                  className="w-full bg-white text-black p-3 rounded-md hover:bg-gray-300"
                >
                  Register
                </Button>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                {success && <p className="text-green-500 text-sm text-center">{success}</p>}
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
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    placeholder="Enter your email"
                    className="bg-black text-white border border-gray-600 p-3 rounded-md hover:border-white"
                  />
                </div>
                <div className="relative space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
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
                    <Button onClick={handleLogin} className="w-full bg-white text-black p-3 rounded-md hover:bg-gray-300">
                      Log in
                    </Button>
                  </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                {success && <p className="text-green-500 text-sm text-center">{success}</p>}

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
