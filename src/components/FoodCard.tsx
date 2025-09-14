import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Scale, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { Doc, Id } from "@/convex/_generated/dataModel";

interface FoodCardProps {
  item: Doc<"foodItems">;
  onClaim?: (itemId: Id<"foodItems">) => void;
  showClaimButton?: boolean;
  isOwner?: boolean;
}

export default function FoodCard({ item, onClaim, showClaimButton = true, isOwner = false }: FoodCardProps) {
  const isExpiringSoon = () => {
    const expiryDate = new Date(item.expiryDate);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 2;
  };

  const getStatusColor = () => {
    switch (item.status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "claimed":
        return "bg-blue-100 text-blue-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full border border-gray-200 hover:border-gray-300 transition-colors">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
              <Badge className={`mt-1 ${getStatusColor()}`}>
                {item.status}
              </Badge>
            </div>
            {isExpiringSoon() && item.status === "available" && (
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-gray-600 text-sm">{item.description}</p>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <Scale className="h-4 w-4 mr-2" />
              {item.quantity} {item.unit}
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-2" />
              Expires: {new Date(item.expiryDate).toLocaleDateString()}
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-2" />
              {item.location}
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              {item.category}
            </Badge>
            {item.allergens.map((allergen) => (
              <Badge key={allergen} variant="outline" className="text-xs">
                {allergen}
              </Badge>
            ))}
          </div>
        </CardContent>

        {showClaimButton && !isOwner && (
          <CardFooter>
            <Button
              onClick={() => onClaim?.(item._id)}
              disabled={item.status !== "available"}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {item.status === "available" ? "Claim Item" : "Not Available"}
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}