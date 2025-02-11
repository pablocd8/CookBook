"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation" // added import

interface Recipe {
  id: number
  title: string
  description: string
  ingredients: string
  steps: string
  image_url: string
  user_id: number
}

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    description: "",
    ingredients: "",
    steps: "",
    image_url: "",
    user_id: JSON.parse(localStorage.getItem("user") || "{}")?.id || null
  })
  const router = useRouter() // added router hook

  useEffect(() => {
    fetchRecipes()
  }, [])

  const fetchRecipes = async () => {
    try {
      const res = await fetch("/api/recipes")
      const data = await res.json()
      if (Array.isArray(data)) {
        // Filter out any invalid recipes
        const validRecipes = data.filter(
          (recipe): recipe is Recipe => recipe && typeof recipe === "object" && "id" in recipe && "title" in recipe,
        )
        setRecipes(validRecipes)
      } else {
        setRecipes([])
      }
    } catch (error) {
      console.error("Error fetching recipes:", error)
      setRecipes([])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewRecipe({ ...newRecipe, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(newRecipe);
    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecipe),
      })
      const data = await res.json()
      console.log(data);
      if (data.recipe && "id" in data.recipe && "title" in data.recipe) {
        setRecipes([...recipes, data.recipe])
        setNewRecipe({ title: "", description: "", ingredients: "", steps: "", image_url: "" , user_id: JSON.parse(localStorage.getItem("user") || "{}")?.id || null })
        router.push("/explorerRecipes") // redirect after successful submission
      } else {
        console.error("Invalid recipe data received from server")
      }
    } catch (error) {
      console.error("Error adding recipe:", error)
    }
  }

  // Eliminamos o comentamos las funciones no utilizadas
  // const handleDelete = async (id: number) => {
  //   try {
  //     const res = await fetch("/api/recipes", {
  //       method: "DELETE",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ id }),
  //     })
  //     const data = await res.json()
  //     if (data.recipe && "id" in data.recipe) {
  //       setRecipes(recipes.filter((recipe) => recipe.id !== data.recipe.id))
  //     } else {
  //       console.error("Invalid response from server on delete")
  //     }
  //   } catch (error) {
  //     console.error("Error deleting recipe:", error)
  //   }
  // }

  // const handleEdit = async (id: number) => {
  //   const recipeToEdit = recipes.find((recipe) => recipe.id === id)
  //   if (!recipeToEdit) {
  //     console.error("Recipe not found")
  //     return
  //   }

  //   setNewRecipe({
  //     title: recipeToEdit.title,
  //     description: recipeToEdit.description,
  //     ingredients: recipeToEdit.ingredients,
  //     steps: recipeToEdit.steps,
  //     image_url: recipeToEdit.image_url,
  //     user_id: JSON.parse(localStorage.getItem("user") || "{}")?.id || null
  //   })

  //   try {
  //     const res = await fetch("/api/recipes", {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ ...newRecipe, id }),
  //     })
  //     const data = await res.json()
  //     if (data.recipe && "id" in data.recipe && "title" in data.recipe) {
  //       setRecipes(recipes.map((recipe) => (recipe.id === id ? data.recipe : recipe)))
  //     } else {
  //       console.error("Invalid response from server on edit")
  //     }
  //   } catch (error) {
  //     console.error("Error editing recipe:", error)
  //   }
  // }

  return (
    <div className="divPadreForm">
      <form className="formLogin" onSubmit={handleSubmit}>
        <header>
          <h1>Agregar Receta</h1>
        </header>

        <div className="contenedorInput">
          <label htmlFor="title">Título:</label>
          <input type="text" id="title" name="title" value={newRecipe.title} onChange={handleChange} required />

          <label htmlFor="description">Descripción:</label>
          <textarea
            id="description"
            name="description"
            value={newRecipe.description}
            onChange={handleChange}
            required
          />

          <label htmlFor="ingredients">Ingredientes:</label>
          <textarea
            id="ingredients"
            name="ingredients"
            value={newRecipe.ingredients}
            onChange={handleChange}
            required
          />

          <label htmlFor="steps">Instrucciones:</label>
          <textarea
            id="steps"
            name="steps"
            value={newRecipe.steps}
            onChange={handleChange}
            required
          />
         <label htmlFor="image_url">Imagen:</label>
          <textarea
            id="image_url"
            name="image_url"
            value={newRecipe.image_url}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Agregar Receta</button>
      </form>
    </div>
  )
}
