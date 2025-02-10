"use client"
import { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
interface Recipe {
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
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    }
    fetchRecipes();
  }, []);

  // Calcular el rango de recetas a mostrar
  const indexOfLastRecipe = page * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    
    <>
  <Link href="/">
  <Image
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
          {currentRecipes.map((recipe, i) => (
            <div key={recipe.title + i} className="recipeCard">
              <h2 className="recipeTitle">{recipe.title}</h2>
              <p className="recipeDescription">{recipe.description}</p>
              <p className="recipeIngredients">{recipe.ingredients}</p>
              <p className="recipeSteps">{recipe.steps}</p>
              <p className="recipeUser">Publicado por: {recipe.user_name}</p>
              <img src={recipe.image_url} alt={recipe.title} className="recipeImage" />
            </div>
          ))}
        </div>
      </div>

      <Stack spacing={2} sx={{ alignItems: "center", marginTop: 2 }}>
        <Pagination
          count={Math.ceil(recipes.length / recipesPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Stack>
    </>
  );
}
