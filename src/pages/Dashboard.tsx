import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navigate } from "react-router";
import { useLocation } from "react-router";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Leaf, Package, Users, TrendingUp, Plus } from "lucide-react";
import { useNavigate } from "react-router";
import FoodCard from "@/components/FoodCard";

export default function Dashboard() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const stats = useQuery(api.foodItems.getStats);
  const userDonations = useQuery(api.foodItems.getUserDonations);
  const userClaims = useQuery(api.foodItems.getUserClaims);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  const statCards = [
    {
      title: "Total Donations",
      value: stats?.totalDonated || 0,
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Items Claimed",
      value: stats?.totalClaimed || 0,
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Available Items",
      value: stats?.totalAvailable || 0,
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Waste Prevented",
      value: `${stats?.wastePreventedKg || 0}kg`,
      icon: Leaf,
      color: "text-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Track your impact and manage your food sharing activities</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate("/donate")}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Donate Food
                </Button>
                <Button
                  onClick={() => navigate("/browse")}
                  variant="outline"
                >
                  Browse Available Food
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Donations */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>My Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {userDonations && userDonations.length > 0 ? (
                    userDonations.slice(0, 3).map((item) => (
                      <FoodCard
                        key={item._id}
                        item={item}
                        showClaimButton={false}
                        isOwner={true}
                      />
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No donations yet. Start sharing food to help reduce waste!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* My Claims */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>My Claims</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {userClaims && userClaims.length > 0 ? (
                    userClaims.slice(0, 3).map((item) => (
                      <FoodCard
                        key={item._id}
                        item={item}
                        showClaimButton={false}
                      />
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No claimed items yet. Browse available food to get started!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}