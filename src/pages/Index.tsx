
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Blank App</h1>
        <p className="text-xl text-muted-foreground mb-8">Start building your amazing project here!</p>
        
        <div className="space-y-4">
          <Link to="/admin">
            <Button className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Interface d'Administration</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
