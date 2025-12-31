// src/components/layout/Header.jsx
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "../assets/logo2.png";

const TOKEN_KEY = "token";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) =>
    location.pathname === path
      ? "text-white font-semibold"
      : "text-gray-300";

  useEffect(() => {
    const hasToken = !!localStorage.getItem(TOKEN_KEY);
    setIsAuthenticated(hasToken);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setIsMenuOpen(false);
    navigate("/login");
  };

 return (
  <>
    {/* NAVBAR */}
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/70 backdrop-blur-xl border-b border-border shadow-sm">
      <div className="container mx-auto px-4 lg:px-12">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* LEFT — LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="Skiez Pdf Books"
              className="h-16 sm:h-14 md:h-22 w-auto object-contain mt-3"
            />
          </Link>

          {/* CENTER — DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10 ml-auto md:mr-8 mt-3">
            <Link to="/" className={`poppins-medium nav-link ${isActive("/")}`}>
              Home
            </Link>

            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`poppins-medium nav-link ${isActive("/dashboard")}`}
              >
                My Guides
              </Link>
            )}

            <Link
              to="/courses"
              className={`poppins-medium nav-link ${isActive("/courses")}`}
            >
              Courses
            </Link>
            <Link
              to="/study-price"
              className={`poppins-medium nav-link ${isActive("/study-price")}`}
            >
              Pricing
            </Link>
          </div>

          {/* RIGHT — ACTIONS */}
          <div className="flex items-center gap-3 mt-3">
            {/* Desktop buttons */}
            <div className="hidden md:flex items-center gap-3">
              {!isAuthenticated ? (
                <>
                  <Button variant="glass" className="poppins-medium">
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button
                    variant="default"
                    className="poppins-medium"
                    onClick={() => navigate("/")}
                  >
                    Get Started
                  </Button>
                </>
              ) : (
                <Button
                  variant="purple"
                  className="poppins-medium rounded-xl"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              )}
            </div>

            {/* Mobile toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>

        </div>
      </div>
    </nav>

    {/* MOBILE MENU */}
    <div
      className={`md:hidden fixed left-0 right-0 top-16 sm:top-20 z-40
      bg-card/95 backdrop-blur-xl border-b border-border shadow-lg
      transition-all duration-300 ease-in-out
      ${
        isMenuOpen
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
    >
      <div className="flex flex-col gap-4 p-6 text-base sm:text-lg">

        <Link to="/" onClick={() => setIsMenuOpen(false)}>
          Home
        </Link>

        {isAuthenticated && (
          <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
            My Guides
          </Link>
        )}

        <Link to="/courses" onClick={() => setIsMenuOpen(false)}>
          Courses
        </Link>

        <Link to="/study-price" onClick={() => setIsMenuOpen(false)}>
          Pricing
        </Link>

        {!isAuthenticated ? (
          <>
            <Button
              className="w-full"
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/");
              }}
            >
              Get Started
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/login");
              }}
            >
              Login
            </Button>
          </>
        ) : (
          <Button
            variant="purple"
            className="w-full rounded-lg"
            onClick={handleLogout}
          >
            Logout
          </Button>
        )}
      </div>
    </div>
  </>
);

}
