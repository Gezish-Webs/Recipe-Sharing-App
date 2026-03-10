import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getRecipe, deleteRecipe } from "../services/recipeService";

const RecipeDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipe(id);
        setRecipe(data);
      } catch (err) {
        // Use err.message to avoid unused variable warning
        setError(`Recipe not found: ${err.message}`);
        // Optionally log the error for debugging
        console.error("Error fetching recipe:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]); // Include id in dependency array

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    try {
      await deleteRecipe(id);
      navigate("/");
    } catch (err) {
      // Use err here as well
      alert(`Failed to delete recipe: ${err.message}`);
      console.error("Delete error:", err);
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-600">{error}</div>;
  if (!recipe) return null;

  const isOwner = currentUser && currentUser.uid === recipe.createdBy;

  return (
    <div className="container mx-auto p-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          src={
            recipe.imageUrl ||
            "https://via.placeholder.com/1200x400?text=No+Image"
          }
          alt={recipe.title || "Recipe"}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
            {isOwner && (
              <div className="space-x-2">
                <Link
                  to={`/edit/${recipe.id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          <p className="text-gray-700 text-lg mb-4">{recipe.description}</p>
          <div className="flex space-x-6 text-sm text-gray-600 mb-4">
            <span>Prep: {recipe.prepTime} min</span>
            <span>Cook: {recipe.cookTime} min</span>
            <span>Servings: {recipe.servings}</span>
            <span>Category: {recipe.category}</span>
          </div>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Ingredients</h2>
            <ul className="list-disc list-inside">
              {recipe.ingredients?.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Instructions</h2>
            <p className="whitespace-pre-line">{recipe.instructions}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
