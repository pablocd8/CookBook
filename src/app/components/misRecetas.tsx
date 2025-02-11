"use client";
import { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

// Definir un tipo para el usuario
interface User {
  id: number;
  // Puedes extender con otras propiedades si es necesario
}

interface Recipe {
  id: number;
  title: string;
  description: string;
  ingredients: string;
  steps: string;
  image_url: string;
  user_id: number;
}

export default function MisRecetas() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState(1);
  const recipesPerPage = 3;
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Recipe>>({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);

      //console.log("Usuario obtenido de localStorage:", parsedUser); // <-- Verificar usuario almacenado

      fetch(`/api/misRecetas?user_id=${parsedUser.id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Datos recibidos de la API:", data); // <-- Verificar datos de la API

          if (!Array.isArray(data)) {
            console.error("Error: La API no devolvió un array válido.");
            return;
          }

          setRecipes(data);
        })
        .catch((error) => console.error("Error fetching user recipes:", error));
    }
  }, []);

  const indexOfLastRecipe = page * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  // console.log("Todas las recetas en el estado:", recipes); // <-- Verificar estado actual
  // console.log("Recetas en la página actual:", currentRecipes); // <-- Verificar paginación

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // DELETE
  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta receta?")) return;
    try {
      const res = await fetch("/api/recipes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, user_id: user?.id }),
      });
      const data = await res.json();

      //console.log("Respuesta del DELETE:", data); // <-- Verificar respuesta de eliminación

      if (data.recipe && data.recipe.id === id) {
        setRecipes(recipes.filter((recipe) => recipe.id !== id));
      } else {
        console.error("Error eliminando la receta");
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const startEditing = (recipe: Recipe) => {
    setEditingId(recipe.id);
    setEditData(recipe);
    //console.log("Editando receta:", recipe); // <-- Verificar qué receta se está editando
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({});
  };

  // PUT
  const handleEditSubmit = async (id: number) => {
    try {
      const res = await fetch("/api/recipes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editData, id, user_id: user?.id }),
      });
      const data = await res.json();

      //console.log("Respuesta del PUT:", data); // <-- Verificar respuesta de edición

      if (data.recipe && data.recipe.id === id) {
        setRecipes(recipes.map((r) => (r.id === id ? data.recipe : r)));
        setEditingId(null);
        setEditData({});
      } else {
        console.error("Error al editar la receta");
      }
    } catch (error) {
      console.error("Error editing recipe:", error);
    }
  };

  return (
    <>
      <div className="exploreRecipesContainer">
        <h1>Mis Recetas</h1>
        {recipes.length === 0 ? (
          <p>No tienes recetas creadas</p>
        ) : (
          <div className="recipeList">
            {currentRecipes.map((recipe) => {
              console.log("Receta en el map:", recipe); // Se imprime cada receta en la consola
              return (
                <div key={recipe.id} className="recipeCard">
                  {editingId === recipe.id ? (
                    <>
                      <input
                        type="text"
                        name="title"
                        value={editData.title || ""}
                        onChange={handleEditChange}
                        className="recipeTitle"
                      />
                      <textarea
                        name="description"
                        value={editData.description || ""}
                        onChange={handleEditChange}
                        className="recipeDescription"
                      />
                      <textarea
                        name="ingredients"
                        value={editData.ingredients || ""}
                        onChange={handleEditChange}
                        className="recipeIngredients"
                      />
                      <textarea
                        name="steps"
                        value={editData.steps || ""}
                        onChange={handleEditChange}
                        className="recipeSteps"
                      />
                      <input
                        type="text"
                        name="image_url"
                        value={editData.image_url || ""}
                        onChange={handleEditChange}
                        className="recipeImage"
                      />
                      <div className="buttonContainer">
                        <button className="editButton" onClick={() => handleEditSubmit(recipe.id)}>Guardar</button>
                        <button className="deleteButton" onClick={cancelEditing}>Cancelar</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="recipeTitle">{recipe.title}</h2>
                      <p className="recipeDescription">{recipe.description}</p>
                      <p className="recipeIngredients">{recipe.ingredients}</p>
                      <p className="recipeSteps">{recipe.steps}</p>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={recipe.image_url} alt={recipe.title} className="recipeImage" />
                      <div className="buttonContainer">
                        <button className="editButton" onClick={() => startEditing(recipe)}>Editar</button>
                        <button className="deleteButton" onClick={() => handleDelete(recipe.id)}>Eliminar</button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
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