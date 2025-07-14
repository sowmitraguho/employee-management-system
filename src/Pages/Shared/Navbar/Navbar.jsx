import React, { useContext } from 'react';
import ThemeToggle from '../../../Components/ui/ThemeToggle';
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
// import { useAuth } from "@/context/AuthContext"; // assumes AuthContext setup
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AuthContext } from '../../../Contexts/AuthContext/AuthContext';



const Navbar = () => {
    const { 
    loggedInUser, logOut} = useContext(AuthContext);
    return (
        <div>
            <header className="bg-white dark:bg-gray-900 border-b shadow-md">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-primary">
          EM System
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition"
          >
            Dashboard
          </Link>
          <Link
            to="/contact"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition"
          >
            Contact Us
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {loggedInUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer w-8 h-8">
                  <AvatarImage src={loggedInUser.photoURL} />
                  <AvatarFallback>{loggedInUser.displayName ? loggedInUser.displayName[0] : 'U'}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={()=> logOut()}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
        </div>
    );
};

export default Navbar;