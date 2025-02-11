"use client";
import { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Link from "next/link";

interface Recipe {
  id: number;
  user_id: number;
  title: string;
  description: string;
  ingredients: string;
  steps: string;
  image_url: string;
  user_name: string;
}

export default function ExploreRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [page, setPage] = useState(1);
  const recipesPerPage = 3; 

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const res = await fetch("/api/exploreRecipes");
        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("El formato de datos recibido no es un array");
        }
        setRecipes(data);
      } catch (error: unknown) {
        console.error("Error fetching recipes:", (error as Error).message);
      }
    }
    fetchRecipes();
  }, []);

  // Función para manejar "Like"
  const handleLike = async (recipeId: number) => {
    try {
      const res = await fetch("/api/likedRecipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId }),
      });
      if (!res.ok) {
        const err = await res.json(); 
        throw new Error(err.error || "Error al guardar la receta");
      }
      alert("Receta guardada!");
    } catch (error: unknown) {
      console.error("Error adding liked recipe:", (error as Error).message);
      alert((error as Error).message);
    }
  };

  const indexOfLastRecipe = page * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  return (
    <>
      <Link href="/">
        <img
          src="/images/super-chef-fork-spatula-chef-hero-mascot-vector-illustration-mascot-logo-image-super-chef-fork-spatula-chef-hero-197636829.webp"
          alt="Hero de CookBook Online"
          width={110}
          height={110}
          className="heroImage2"
        />
      </Link>
      <div className="exploreRecipesContainer">
        <h1>Explorar Recetas</h1>
        <div className="recipeList">
          {(!Array.isArray(currentRecipes) || currentRecipes.length === 0) ? (
            <p>No hay recetas disponibles</p>
          ) : (
            currentRecipes.map((recipe, i) => (
              <div key={recipe.title + i} className="recipeCard">
                <h2 className="recipeTitle">{recipe.title}</h2>
                <p className="recipeDescription">{recipe.description}</p>
                <p className="recipeIngredients">{recipe.ingredients}</p>
                <p className="recipeSteps">{recipe.steps}</p>
                <p className="recipeUser">Publicado por: {recipe.user_name}</p>
                <img 
                  src={recipe.image_url} 
                  alt={recipe.title}
                  width={500} 
                  height={200}
                  className="recipeImage" 
                />
                <button onClick={() => handleLike(recipe.id)}>Like</button>
              </div>
            ))
          )}
        </div>
      </div>

      <Stack spacing={2} sx={{ alignItems: "center", marginTop: 2 }}>
        <Pagination
          count={Math.ceil(recipes.length / recipesPerPage)}
          page={page}
          onChange={(_event, value) => setPage(value)}
          color="primary"
        />
      </Stack>
    </>
  );
}
