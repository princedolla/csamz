import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import CarManagement from "./pages/CarManagement";
import PackageManagement from "./pages/PackageManagement";
import ServicePackagePage from "./pages/ServicePackagePage";
import PaymentPage from "./pages/PaymentPage";
import ReportsPage from "./pages/ReportsPage";
import LoginPage from "./pages/LoginPage";
import { authAPI } from "./services/api";

function App() {
  const [activeTab, setActiveTab] = useState("Car Management");
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const loadCurrentSession = async () => {
      try {
        const response = await authAPI.me();
        setUser(response.data.data);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadCurrentSession();
  }, []);

  const handleLogin = async (payload) => {
    setAuthError("");
    setIsSubmittingLogin(true);
    try {
      const response = await authAPI.login(payload);
      setUser(response.data.data);
    } catch (error) {
      const message = error?.response?.data?.message || "Login failed";
      setAuthError(message);
      setUser(null);
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Client still clears local user state even if request fails.
    } finally {
      setUser(null);
      setActiveTab("Car Management");
    }
  };

  // Switch page based on selected navigation tab.
  const renderPage = () => {
    switch (activeTab) {
      case "Car Management":
        return <CarManagement />;
      case "Package Management":
        return <PackageManagement />;
      case "Service Package":
        return <ServicePackagePage />;
      case "Payment":
        return <PaymentPage />;
      case "Reports":
        return <ReportsPage />;
      default:
        return <CarManagement />;
    }
  };

  if (isLoadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 p-4">
        <LoginPage onLogin={handleLogin} isSubmitting={isSubmittingLogin} errorMessage={authError} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout} />
      <main className="mx-auto max-w-7xl p-4">{renderPage()}</main>
    </div>
  );
}

export default App;
