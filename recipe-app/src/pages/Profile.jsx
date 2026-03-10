import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  getRecipesByUser,
  createMultipleRecipes,
} from "../services/recipeService";
import { sampleRecipes } from "../data/sampleRecipes";
import RecipeCard from "../components/RecipeCard";

const Profile = () => {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        const data = await getRecipesByUser(userId);
        setRecipes(data);
      } catch (err) {
        setError("Failed to load recipes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserRecipes();
  }, [userId]);

  const handleSeedRecipes = async () => {
    if (!currentUser || currentUser.uid !== userId) {
      alert("You can only add recipes to your own profile");
      return;
    }
    setSeeding(true);
    try {
      await createMultipleRecipes(sampleRecipes, currentUser.uid);
      // Refresh the list
      const updated = await getRecipesByUser(userId);
      setRecipes(updated);
      alert("Sample recipes added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add sample recipes");
    } finally {
      setSeeding(false);
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-600">{error}</div>;

  const isOwnProfile = currentUser && currentUser.uid === userId;

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Recipes</h1>
        {isOwnProfile && (
          <button
            onClick={handleSeedRecipes}
            disabled={seeding}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {seeding ? "Adding..." : "Add Sample Recipes"}
          </button>
        )}
      </div>
      {recipes.length === 0 ? (
        <p>
          No recipes yet.{" "}
          {isOwnProfile && "Click the button above to add some sample recipes!"}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
