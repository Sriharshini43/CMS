import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LoginAndRegisterPage from "@/components/pages/loginAndregister";

function App() {
  return (
    <Router>
      <GlobalNavigationControl />
      <Routes>
        <Route path="/" element={<LoginAndRegisterPage />} />
      </Routes>
    </Router>
  );
}

const GlobalNavigationControl = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const disableNavigation = (event: PopStateEvent) => {
      event.preventDefault();
      event.stopPropagation();
      window.history.pushState(null, "", window.location.href);
    };

    const disableBackButton = () => {
      window.history.pushState(null, "", window.location.href);
    };

    disableBackButton();
    window.addEventListener("popstate", disableNavigation);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F5" || (e.ctrlKey && e.key === "r")) {
        e.preventDefault();
        alert("Page refresh is disabled.");
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      sessionStorage.removeItem("userSession");
      fetch("/api/logout", { method: "POST", credentials: "include" });
      navigate("/login");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", disableNavigation);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [navigate]);

  return null;
};

export default App;
