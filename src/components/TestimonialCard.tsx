
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface TestimonialProps {
  testimonial: {
    id: number;
    name: string;
    role: string;
    content: string;
    avatar: string;
    rating: number;
  };
}

export function TestimonialCard({ testimonial }: TestimonialProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <img 
            src={testimonial.avatar} 
            alt={testimonial.name}
            className="h-14 w-14 rounded-full object-cover" 
          />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h3>
            <p className="text-sm text-gray-500">{testimonial.role}</p>
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300">
          "{testimonial.content}"
        </p>
      </CardContent>
    </Card>
  );
}
