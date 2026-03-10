import { useState, useEffect } from "react";
import { getAllRecipes } from "../services/recipeService";
import RecipeCard from "../components/RecipeCard";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getAllRecipes();
        setRecipes(data);
        setFilteredRecipes(data);
      } catch (err) {
        setError("Failed to load recipes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRecipes(recipes);
    } else {
      const lower = searchTerm.toLowerCase();
      const filtered = recipes.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(lower) ||
          recipe.description.toLowerCase().includes(lower) ||
          recipe.ingredients.some((ing) => ing.toLowerCase().includes(lower)),
      );
      setFilteredRecipes(filtered);
    }
  }, [searchTerm, recipes]);

  if (loading) return <div className="text-center p-8">Loading recipes...</div>;
  if (error) return <div className="text-center p-8 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">All Recipes</h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search recipes by title, description, or ingredient..."
          className="w-full border rounded px-4 py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {filteredRecipes.length === 0 ? (
        <p>No recipes match your search.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
