import React, { useContext, useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthContext } from "../../../Contexts/AuthContext/AuthContext";
import ThemeToggle from "../../../Components/ui/ThemeToggle";
import { CompanyLogo } from "../../../Components/CompanyLogo/CompanyLogo";
import { Menu, X } from "lucide-react";
import Spinner from "../../../Components/Spinner/Spinner";

const Navbar = () => {
  const { loggedInUser, logOut, loading } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if(loading) return <Spinner/>;

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-800 z-50">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2">
          <CompanyLogo />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-md font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition hover:from-red-500 hover:via-pink-500 hover:to-blue-500 hover:bg-white"
          >
            Home 
          </Link>
          <Link
            to="/about"
            className="text-md font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition hover:from-red-500 hover:via-pink-500 hover:to-blue-5000"
          >
            About Us
          </Link>
          
          <Link
            to="/contactus"
            className="text-md font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition hover:from-red-500 hover:via-pink-500 hover:to-blue-500"
          >
            Contact Us
          </Link>
          {loggedInUser && <Link
            to="/dashboard"
            className="text-md font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition hover:from-red-500 hover:via-pink-500 hover:to-blue-500"
          >
            Dashboard
          </Link>}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <ThemeToggle />

          {/* Auth Section */}
          {loggedInUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer w-9 h-9 ring-2 ring-transparent hover:ring-blue-400 transition">
                  <AvatarImage src={loggedInUser.photoURL} />
                  <AvatarFallback>
                    {loggedInUser.displayName
                      ? loggedInUser.displayName[0]
                      : "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => logOut()}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex gap-2">
              <Link to="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:border-blue-500 hover:text-blue-500"
                >
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:opacity-90"
                >
                  Register
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col p-4 gap-3">
            <Link
            to="/"
            className="text-md font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition hover:from-red-500 hover:via-pink-500 hover:to-blue-500 hover:bg-white"
          >
            Home 
          </Link>
          <Link
            to="/about"
            className="text-md font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition hover:from-red-500 hover:via-pink-500 hover:to-blue-5000"
          >
            About Us
          </Link>
          
          <Link
            to="/contact"
            className="text-md font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition hover:from-red-500 hover:via-pink-500 hover:to-blue-500"
          >
            Contact Us
          </Link>
          {loggedInUser && <Link
            to="/dashboard"
            className="text-md font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition hover:from-red-500 hover:via-pink-500 hover:to-blue-500"
          >
            Dashboard
          </Link>}

            {!loggedInUser && (
              <div className="flex flex-col gap-2 mt-2">
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full hover:border-blue-500 hover:text-blue-500"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:opacity-90"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
