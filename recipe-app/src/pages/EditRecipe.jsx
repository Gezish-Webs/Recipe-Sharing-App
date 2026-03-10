import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  getRecipe,
  updateRecipe,
  uploadRecipeImage,
} from "../services/recipeService";

const categories = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Snack",
  "Other",
];

const EditRecipe = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [image, setImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch recipe data on mount
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchRecipe = async () => {
      try {
        const recipe = await getRecipe(id);
        // Check ownership
        if (recipe.createdBy !== currentUser.uid) {
          navigate("/");
          return;
        }
        // Populate form fields
        setTitle(recipe.title);
        setDescription(recipe.description);
        setIngredients(recipe.ingredients || [""]);
        setInstructions(recipe.instructions);
        setPrepTime(recipe.prepTime);
        setCookTime(recipe.cookTime);
        setServings(recipe.servings);
        setCategory(recipe.category);
        setExistingImageUrl(recipe.imageUrl || "");
      } catch (err) {
        setError("Failed to load recipe: " + err.message);
        console.error("Error loading recipe:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, currentUser, navigate]); // ✅ include all dependencies

  // Ingredient handlers
  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addIngredientField = () => {
    setIngredients([...ingredients, ""]);
  };

  const removeIngredientField = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const recipeData = {
        title,
        description,
        ingredients: ingredients.filter((i) => i.trim() !== ""),
        instructions,
        prepTime: Number(prepTime),
        cookTime: Number(cookTime),
        servings: Number(servings),
        category,
      };

      let imageUrl = existingImageUrl;
      if (image) {
        imageUrl = await uploadRecipeImage(image, id);
      }
      recipeData.imageUrl = imageUrl;

      await updateRecipe(id, recipeData);
      navigate(`/recipe/${id}`);
    } catch (err) {
      setError(err.message);
      console.error("Error updating recipe:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center p-8">Loading recipe...</div>;

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Recipe</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows="2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Ingredients */}
        <div>
          <label className="block mb-1 font-medium">Ingredients</label>
          {ingredients.map((ing, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                className="flex-1 border rounded px-3 py-2"
                value={ing}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                placeholder={`Ingredient ${index + 1}`}
                required
              />
              {ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredientField(index)}
                  className="ml-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredientField}
            className="text-orange-600 hover:underline"
          >
            + Add Ingredient
          </button>
        </div>

        {/* Instructions */}
        <div>
          <label className="block mb-1 font-medium">Instructions</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows="4"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
          />
        </div>

        {/* Prep & Cook Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">
              Prep Time (minutes)
            </label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">
              Cook Time (minutes)
            </label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Servings */}
        <div>
          <label className="block mb-1 font-medium">Servings</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Current Image Preview */}
        {existingImageUrl && (
          <div>
            <p className="mb-1">Current Image:</p>
            <img
              src={existingImageUrl}
              alt="Current recipe"
              className="w-32 h-32 object-cover rounded"
            />
          </div>
        )}

        {/* New Image Upload */}
        <div>
          <label className="block mb-1 font-medium">New Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 disabled:opacity-50"
        >
          {submitting ? "Updating..." : "Update Recipe"}
        </button>
      </form>
    </div>
  );
};

export default EditRecipe;
