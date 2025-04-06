import { Card, CardContent } from "@/components/ui/card";
import { Award, BookOpen, Globe, LayoutGrid, Route, Users } from "lucide-react";

interface FeatureProps {
  feature: {
    id: number;
    title: string;
    description: string;
    icon: string;
    color: string;
  };
}

export function FeatureCard({ feature }: FeatureProps) {
  // Map string icon names to actual icon components
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "BookOpen":
        return <BookOpen className="h-6 w-6 text-white" />;
      case "LayoutGrid":
        return <LayoutGrid className="h-6 w-6 text-white" />;
      case "Route":
        return <Route className="h-6 w-6 text-white" />;
      case "Users":
        return <Users className="h-6 w-6 text-white" />;
      case "Award":
        return <Award className="h-6 w-6 text-white" />;
      case "Globe":
        return <Globe className="h-6 w-6 text-white" />;
      default:
        return <BookOpen className="h-6 w-6 text-white" />;
    }
  };

  return (
    <Card className="overflow-hidden border hover:shadow-md transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-lg ${feature.color}`}>
            {getIcon(feature.icon)}
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
