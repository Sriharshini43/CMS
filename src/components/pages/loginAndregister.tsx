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

  const [registerErrors, setRegisterErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: ""
  });

  const [loginErrors, setLoginErrors] = useState({
    email: "",
    password: "",
  });

  const [ForgotPasswordErrors, setForgotPasswordErrors] = useState({
    newPassword: "",
    newConfirmPassword: "",
  });

  const isValidEmail = (email: string) => {
    return /^[\w.-]+@(?:gmail\.com|[\w-]+\.\w+)$/.test(email);
  };

  const isValidUsername = (username: string) => {
    return /^[A-Za-z0-9]{2,}$/.test(username) && /[A-Za-z]/.test(username);
  };  
  
  const isValidPassword = (password: string) => {
    return /^(?=[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/.test(password);
  };
  

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 200); 
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 4000); 
      return () => clearTimeout(timer);
    }
  }, [error]);
  
  const handleSendOtp = async () => {
    setLoading(true);
    setError("");
  
    if (!isValidEmail(forgotEmail)) {
      setError("Please enter a valid email (gmail.com or custom domain).");
      setLoading(false);
      return;
    }
  
    try {
      const res = await fetch("http://localhost:3001/api/auth/forgotpass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail })
      });
  
      const data = await res.json();
      
      if (res.ok) {
        setSuccess("OTP sent to your email.");
        setTimeout(() => {
          setSuccess(""); 
          setForgotStep(2);
        }, 200);
      } else if (data.code === 'USER_NOT_EXISTS') {
        setError("User does not exist");
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
        localStorage.setItem("otp_token", data.token);
        setSuccess("OTP verified.");
        setTimeout(() => {
          setSuccess("");
          setForgotStep(3);
        }, 200);
      } else {
        setError(data.error || "OTP verification failed.");
      }
    } catch {
      setError("Server error.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    let errors = {
      newPassword: "",
      newConfirmPassword: "",
    };
  
    if (newPassword !== newConfirmPassword) {
      errors.newConfirmPassword = "Passwords do not match.";
    }
  
    if (!isValidPassword(newPassword)) {
      errors.newPassword =
        "Password must be at least 8 characters, start with a capital letter, and include a number and special character.";
    }
  
    setForgotPasswordErrors(errors);
  
    // Stop if there's any error
    if (Object.values(errors).some((e) => e)) return;
  
    const token = localStorage.getItem("otp_token");
    if (!token) {
      setError("Session expired. Please request OTP again.");
      setForgotStep(1);
      return;
    }
  
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/auth/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      });
  
      const data = await res.json();
      if (res.ok) {
        setSuccess("Password reset successful. Please login.");
        localStorage.removeItem("otp_token");
        setTimeout(() => {
          setIsForgotPassword(false); 
          setForgotStep(1); 
          setSuccess(""); 
        }, 200);
      } else {
        setError(data.message || "Reset failed.");
      }
    } catch {
      setError("Server error.");
    } finally {
      setLoading(false);
    }
  };  

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = loginData;
    setError("");
    setSuccess("");
    setLoading(true);
  
    // Clear previous field errors
    setLoginErrors({
      email: "",
      password: "",
    });
  
    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        setSuccess("Login successful!");
        localStorage.setItem("access_token", data.token);
  
        switch (data.role?.toLowerCase()) {
          case "player":
            setTimeout(() => navigate("/playerdashboard"), 200);
            break;
          case "team_manager":
            setTimeout(() => navigate("/teamregistration"), 200);
            break;
          case "tournament_orgniser":
            setTimeout(() => navigate("/tournamentregister"), 200);
            break;
          default:
            setError("Unrecognized role. Contact admin.");
            break;
        }
      } else {
        switch (data.code) {
          case "USER_NOT_EXISTS":
            setLoginErrors((prev) => ({
              ...prev,
              email: "No account found with this email.",
            }));
            break;
          case "INVALID_PASSWORD":
            setLoginErrors((prev) => ({
              ...prev,
              password: "Incorrect password. Please try again.",
            }));
            break;
          default:
            setError(data.message || data.error || "Login failed.");
        }
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

    let errors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: ""
    };
    
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    if (!isValidEmail(email)) {
      errors.email = "Email must end with @gmail.com or @----.com";
    }
    if (!isValidUsername(username)) {
      errors.username = "Username must be at least 2 characters, contain only letters or numbers, and include at least one letter.";
    }
    if (!isValidPassword(password)) {
      errors.password = "Password must be at least 8 characters, start with a capital letter, and include a number and special character.";
    }
    if (!registerData.role) {
      errors.role = "Role is required.";
    }
    
    setRegisterErrors(errors);
    
    // Check if any error exists
    if (Object.values(errors).some(err => err)) return;    

    try {
      const res = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role })
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess("Registered successfully! Please log in.");
        setRegisterData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: ""
        });
        setTimeout(() => {
          setIsRegister(false);
          setSuccess(""); 
        }, 2000);
      } else {
        if (data.code === "USER_EXISTS") {
          setError("User with this email id already exists");
        } else {
          setError(data.message || "Registration failed");
        }
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
            <form className="space-y-8">
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
                  <div className="space-y-8">
                    <p className="text-sm text-gray-400 text-center">
                      OTP sent to <span className="font-medium text-white">{forgotEmail}</span>
                    </p>
                    <div className="flex justify-center">
                      <div className="w-full max-w-md">
                        <OTPInput value={otp} onChange={setOtp} />
                      </div>
                    </div>
                    {/* Resend OTP link */}
                    <p className="text-sm text-center text-gray-300">
                      Didn't receive OTP?{" "}
                      <button
                        className="text-blue-400 underline hover:text-blue-600"
                        onClick={() => setForgotStep(1)}
                        type="button"
                      >
                        Resend OTP
                      </button>
                    </p>
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  {success && <p className="text-green-500 text-sm">{success}</p>}
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
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setForgotPasswordErrors((prev) => ({ ...prev, newPassword: "" }));
                        }}
                        placeholder="New password"
                        className={`bg-black text-white border p-3 rounded-md hover:border-white pr-10 ${
                          ForgotPasswordErrors.newPassword ? "border-red-500" : "border-gray-600"
                        }`}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                    </div>
                    {ForgotPasswordErrors.newPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {ForgotPasswordErrors.newPassword}
                      </p>
                    )}
                  </div>

                  <div className="relative space-y-2">
                    <Label>Confirm Password</Label>
                    <div className="relative">
                      <Input
                        type={showNewConfirmPassword ? "text" : "password"}
                        value={newConfirmPassword}
                        onChange={(e) => {
                          setNewConfirmPassword(e.target.value);
                          setForgotPasswordErrors((prev) => ({
                            ...prev,
                            newConfirmPassword: "",
                          }));
                        }}
                        placeholder="Confirm new password"
                        className={`bg-black text-white border p-3 rounded-md hover:border-white pr-10 ${
                          ForgotPasswordErrors.newConfirmPassword ? "border-red-500" : "border-gray-600"
                        }`}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3"
                        onClick={() =>
                          setShowNewConfirmPassword(!showNewConfirmPassword)
                        }
                      >
                        {showNewConfirmPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                    </div>
                    {ForgotPasswordErrors.newConfirmPassword && (
                      <p className="text-red-500 text-sm mt-1">
                        {ForgotPasswordErrors.newConfirmPassword}
                      </p>
                    )}
                  </div>

                  <Button
                    className="w-full bg-white text-black p-3 rounded-md hover:bg-gray-300"
                    type="button"
                    onClick={handleResetPassword}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </Button>

                  {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                  {success && <p className="text-green-500 text-sm text-center">{success}</p>}
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
                    value={registerData.username} onChange={(e) => {
                      setRegisterData({ ...registerData, username: e.target.value });
                      setRegisterErrors({ ...registerErrors, username: "" });
                    }}
                    placeholder="Enter your username"
                    className={`bg-black text-white border p-3 rounded-md hover:border-white ${
                      registerErrors.username ? "border-red-500" : "border-gray-600"
                    }`}
                  />
                  {registerErrors.username && (
                    <p className="text-red-500 text-sm mt-1">{registerErrors.username}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Email*</Label>
                  <Input
                    type="email"
                    value={registerData.email} onChange={(e) => {
                      setRegisterData({ ...registerData, email: e.target.value });
                      setRegisterErrors({ ...registerErrors, email: "" });
                    }}
                    placeholder="Enter your email"
                    className={`bg-black text-white border p-3 rounded-md hover:border-white ${
                      registerErrors.email ? "border-red-500" : "border-gray-600"
                    }`}
                  />
                  {registerErrors.email && <p className="text-red-500 text-sm">{registerErrors.email}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative space-y-2">
                    <Label>Password*</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={registerData.password}  onChange={(e) => {
                          setRegisterData({ ...registerData, password: e.target.value });
                          setRegisterErrors({ ...registerErrors, password: "" });
                        }}
                        placeholder="Enter your password"
                        className={`bg-black text-white border p-3 rounded-md hover:border-white pr-10 ${
                          registerErrors.password ? "border-red-500" : "border-gray-600"
                        }`}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                    </div>
                    {registerErrors.password && <p className="text-red-500 text-sm">{registerErrors.password}</p>}
                  </div>
                  <div className="relative space-y-2">
                    <Label>Confirm Password*</Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={registerData.confirmPassword} onChange={(e) => {
                          setRegisterData({ ...registerData, confirmPassword: e.target.value });
                          setRegisterErrors({ ...registerErrors, confirmPassword: "" });
                        }}
                        placeholder="Confirm your password"
                        className={`bg-black text-white border p-3 rounded-md hover:border-white pr-10 ${
                          registerErrors.confirmPassword ? "border-red-500" : "border-gray-600"
                        }`}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                    </div>
                    {registerErrors.confirmPassword && (
                        <p className="text-red-500 text-sm">{registerErrors.confirmPassword}</p>
                      )}
                  </div>
                </div>
                {/* Role */}
                <div className="space-y-2 mt-4">
                  <Label>Role*</Label>
                  <Select
                    onValueChange={(value) => {
                      setRegisterData({ ...registerData, role: value });
                      setRegisterErrors({ ...registerErrors, role: "" });
                    }}
                  >
                    <SelectTrigger
                      className={`bg-black text-white w-full p-3 rounded-md hover:border-white ${
                        registerErrors.role ? "border-red-500" : "border-gray-600"
                      }`}
                    >
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent className="bg-black text-white border border-gray-600 rounded-md">
                      <SelectItem value="tournament_orgniser">Tournament Organizer</SelectItem>
                      <SelectItem value="team_manager">Team Manager</SelectItem>
                      <SelectItem value="player">Player</SelectItem>
                    </SelectContent>
                  </Select>
                  {registerErrors.role && <p className="text-red-500 text-sm">{registerErrors.role}</p>}
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
              <form className="space-y-6" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => {
                      setLoginData({ ...loginData, email: e.target.value });
                      setLoginErrors({ ...loginErrors, email: "" }); // Clear email error on change
                    }}
                    placeholder="Enter your email"
                    className={`bg-black text-white border p-3 rounded-md hover:border-white ${
                      loginErrors.email ? "border-red-500" : "border-gray-600"
                    }`}
                  />
                  {loginErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{loginErrors.email}</p>
                  )}
                </div>

                <div className="relative space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) => {
                        setLoginData({ ...loginData, password: e.target.value });
                        setLoginErrors({ ...loginErrors, password: "" }); // Clear password error on change
                      }}
                      placeholder="Enter your password"
                      className={`bg-black text-white border p-3 rounded-md pr-10 hover:border-white ${
                        loginErrors.password ? "border-red-500" : "border-gray-600"
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                  </div>
                  {loginErrors.password && (
                    <p className="text-red-500 text-sm mt-1">{loginErrors.password}</p>
                  )}
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
                    <Button
                      type="submit"
                      className="w-full bg-white text-black p-3 rounded-md hover:bg-gray-300"
                    >
                      Log in
                    </Button>
                  </div>

                  {/* Show general errors only if there are no field-level errors */}
                  {!loginErrors.email && !loginErrors.password && error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                  )}

                  {success && (
                    <p className="text-green-500 text-sm text-center">{success}</p>
                  )}

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
