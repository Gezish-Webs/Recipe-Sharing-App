import { Link } from "react-router-dom";

const RecipeCard = ({ recipe }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={
          recipe.imageUrl || "https://via.placeholder.com/300x200?text=No+Image"
        }
        alt={recipe.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{recipe.category}</span>
          <Link
            to={`/recipe/${recipe.id}`}
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
          >
            View Recipe
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
