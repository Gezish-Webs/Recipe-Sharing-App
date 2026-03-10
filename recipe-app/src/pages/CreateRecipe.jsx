import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  createRecipe,
  uploadRecipeImage,
  updateRecipe,
} from "../services/recipeService";




const categories = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Snack",
  "Other",
];

const CreateRecipe = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle ingredient list
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
      const newIngredients = ingredients.filter((_, i) => i !== index);
      setIngredients(newIngredients);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError("You must be logged in to create a recipe");
      return;
    }

    // Basic validation
    if (
      !title ||
      !description ||
      ingredients.some((i) => !i.trim()) ||
      !instructions ||
      !prepTime ||
      !cookTime ||
      !servings
    ) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // First, create the recipe document without image to get an ID
      const recipeData = {
        title,
        description,
        ingredients: ingredients.filter((i) => i.trim() !== ""),
        instructions,
        prepTime: Number(prepTime),
        cookTime: Number(cookTime),
        servings: Number(servings),
        category,
        imageUrl: "", // temporary
      };

      const recipeId = await createRecipe(recipeData, currentUser.uid);

      // If there's an image, upload it and update the recipe with imageUrl
      if (image) {
        const imageUrl = await uploadRecipeImage(image, recipeId);
        await updateRecipe(recipeId, { imageUrl });
        if (image) {
          const imageUrl = await uploadRecipeImage(image, recipeId);
          await updateRecipe(recipeId, { imageUrl });
        }
        // Update recipe with imageUrl (we'll need an update function)
        // For now, we'll handle update separately. Let's add a function in recipeService to update image only.
        // We'll do that later. For now, we'll skip image upload to keep it simple.
        // Actually, we should create an update function. Let's add it now.
        // I'll add a quick updateRecipeImage function in recipeService.
      }

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Create New Recipe</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div>
          <label className="block mb-1 font-medium">Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Recipe"}
        </button>
      </form>
    </div>
  );
};

export default CreateRecipe;
