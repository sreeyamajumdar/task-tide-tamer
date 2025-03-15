
import { cn } from "@/lib/utils";
import { Category, categoryColors, categoryIcons } from "@/utils/taskUtils";
import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";

interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

const CategoryBadge = ({ category, className }: CategoryBadgeProps) => {
  // Get the icon name from categoryIcons
  const iconName = categoryIcons[category];
  
  // Dynamically access the correct icon component from LucideIcons
  // We need to cast this to any because TypeScript doesn't know which keys exist at compile time
  const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as LucideIcon;
  
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
