import { useState, useEffect } from "react";

// Component for rendering navigation categories
export const NavCategories = ({ categories, selectedCategory, onSelectCategory }) => {
  // Local state to track selected category
  const [localSelectedCategory, setLocalSelectedCategory] = useState(selectedCategory);

  // Update local state when selectedCategory prop changes
  useEffect(() => {
    setLocalSelectedCategory(selectedCategory);
  }, [selectedCategory]);

  return (
    // Render categories list
    <ul className="flex border-b">
      {categories.map((category) => (
        <li key={category.id} className="mr-1 -mt-10">
          <a
            // Render category link
            className={`bg-white inline-block ${
              // Apply different styles based on selected category
              localSelectedCategory === category.id
                ? "border-l border-t border-r rounded-t py-2 px-4 text-fuchsia-600 font-semibold"
                : "py-2 px-4 text-fuchsia-500 hover:text-fuchsia-800 font-semibold"
            }`}
            href="#"
            onClick={() => {
              // Update local state and call onSelectCategory when category is clicked
              if (localSelectedCategory !== category.id) {
                setLocalSelectedCategory(category.id);
                onSelectCategory(category.id);
              }
            }}
          >
            {category.name} {/* Render category name */}
          </a>
        </li>
      ))}
    </ul>
  );
};
