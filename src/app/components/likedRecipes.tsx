"use client";
import { useEffect, useState } from "react";



interface LikedRecipe {
    id: number;
    recipe_id: number;
    title: string;
    description: string;
    ingredients: string;
    steps: string;
    image_url: string;
    user_name: string;
  }
  

export default function LikedRecipesPage() {
    const [likedRecipes, setLikedRecipes] = useState<LikedRecipe[]>([]);

  useEffect(() => {
    async function fetchLikedRecipes() {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;
      const user = JSON.parse(storedUser);
      try {
        const res = await fetch(`/api/likedRecipes?userId=${user.id}`);
        const data = await res.json();
        console.log("Datos recibidos:", data)
        setLikedRecipes(data);
      } catch (error) {
        console.error("Error fetching liked recipes:", (error as Error).message);
      }
    }
    fetchLikedRecipes();
  }, []);
  const handleDeleteRecipe = async (recipeId: number) => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        alert("Debes iniciar sesión para darle like a una receta");
        return;
      }
      const user = JSON.parse(storedUser);
      console.log(recipeId,user.id);
      const res = await fetch("/api/likedRecipes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId, userId: user.id }),
      });
      console.log(res);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al eliminar la receta");
      }
      alert("Receta Eliminada!");
        window.location.reload();  
    } catch (error: unknown) {
      console.error("Error adding liked recipe:", (error as Error).message);
      alert((error as Error).message);

    }

  };

  return (
    <div className="exploreRecipesContainer">
      <h1>Recetas Guardadas</h1>
      <div className="recipeList">
      {likedRecipes.length === 0 ? (
        <p>No tienes recetas guardadas</p>
      ) : (
        likedRecipes.map((recipe) => (
          <div key={recipe.id} className="recipeCard">
            <h2 className="recipeTitle">{recipe.title}</h2>
                <p className="recipeDescription">{recipe.description}</p>
                <p className="recipeIngredients">{recipe.ingredients}</p>
                <p className="recipeSteps">{recipe.steps}</p>
                <img 
                  src={recipe.image_url} 
                  alt={recipe.title}
                  width={500} 
                  height={200}
                  className="recipeImage" 
                />
            <button onClick={() => handleDeleteRecipe(recipe.id)} className="like-button" aria-label="Like Recipe">🗑️</button>

          </div>
        ))
      )}
      </div>
    </div>
  );
}
