import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Leaf, Menu, User, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function Navbar() {
  const { isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white border-b border-gray-100 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-xl font-semibold text-gray-900">FoodShare</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="text-gray-600 hover:text-gray-900"
            >
              Dashboard
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/browse")}
              className="text-gray-600 hover:text-gray-900"
            >
              Browse Food
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/donate")}
              className="text-gray-600 hover:text-gray-900"
            >
              Donate
            </Button>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {user?.name || user?.email || "User"}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Get Started
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 py-4"
          >
            <div className="flex flex-col space-y-3">
              <Button
                variant="ghost"
                onClick={() => {
                  navigate("/dashboard");
                  setMobileMenuOpen(false);
                }}
                className="justify-start"
              >
                Dashboard
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  navigate("/browse");
                  setMobileMenuOpen(false);
                }}
                className="justify-start"
              >
                Browse Food
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  navigate("/donate");
                  setMobileMenuOpen(false);
                }}
                className="justify-start"
              >
                Donate
              </Button>
              
              {isAuthenticated ? (
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-2 px-3 py-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {user?.name || user?.email || "User"}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                    className="w-full mt-2"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    navigate("/auth");
                    setMobileMenuOpen(false);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Get Started
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
