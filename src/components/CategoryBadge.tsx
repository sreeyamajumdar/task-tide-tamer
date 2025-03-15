
import { Category, categoryColors, categoryIcons } from "@/utils/taskUtils";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

const CategoryBadge = ({ category, className }: CategoryBadgeProps) => {
  const IconComponent = LucideIcons[categoryIcons[category] as keyof typeof LucideIcons];
  
  return (
    <div 
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium",
        categoryColors[category],
        className
      )}
    >
      {IconComponent && <IconComponent className="mr-1 h-3 w-3" />}
      <span className="capitalize">{category}</span>
    </div>
  );
};

export default CategoryBadge;
