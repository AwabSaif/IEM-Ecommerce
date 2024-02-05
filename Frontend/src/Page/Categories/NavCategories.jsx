import { useState, useEffect } from "react";

export const NavCategories = ({ categories, selectedCategory, onSelectCategory }) => {
  const [localSelectedCategory, setLocalSelectedCategory] = useState(selectedCategory);

  useEffect(() => {
    setLocalSelectedCategory(selectedCategory);
  }, [selectedCategory]);

  return (
    <ul className="flex border-b">
      {categories.map((category) => (
        <li key={category.id} className="mr-1 -mt-10">
          <a
            className={`bg-white inline-block ${
              localSelectedCategory === category.id
                ? "border-l border-t border-r rounded-t py-2 px-4 text-fuchsia-600 font-semibold"
                : "py-2 px-4 text-fuchsia-500 hover:text-fuchsia-800 font-semibold"
            }`}
            href="#"
            onClick={() => {
              if (localSelectedCategory !== category.id) {
                setLocalSelectedCategory(category.id);
                onSelectCategory(category.id);
              }
            }}
          >
            {category.name}
          </a>
        </li>
      ))}
    </ul>
  );
};
