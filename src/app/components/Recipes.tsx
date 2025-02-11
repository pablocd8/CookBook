import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Recipe {
  id: number
  title: string
  description: string
  ingredients: string
  steps: string
  image_url: string
  user_id: number | null
}

export default function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    description: "",
    ingredients: "",
    steps: "",
    image_url: "",
    user_id: null 
  })
  const router = useRouter()

  // Se ejecuta solo en el cliente
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (user?.id) {
      setNewRecipe((prev) => ({ ...prev, user_id: user.id }))
    }
  }, [])

  const fetchRecipes = async () => {
    try {
      const res = await fetch("/api/recipes")
      const data = await res.json()
      if (Array.isArray(data)) {
        const validRecipes = data.filter(
          (recipe): recipe is Recipe => recipe && typeof recipe === "object" && "id" in recipe && "title" in recipe
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

  useEffect(() => {
    fetchRecipes()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewRecipe({ ...newRecipe, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecipe),
      })
      const data = await res.json()
      if (data.recipe && "id" in data.recipe && "title" in data.recipe) {
        setRecipes([...recipes, data.recipe])
        setNewRecipe({ title: "", description: "", ingredients: "", steps: "", image_url: "", user_id: newRecipe.user_id })
        router.push("/explorerRecipes")
      } else {
        console.error("Invalid recipe data received from server")
      }
    } catch (error) {
      console.error("Error adding recipe:", error)
    }
  }

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
          <textarea id="description" name="description" value={newRecipe.description} onChange={handleChange} required />

          <label htmlFor="ingredients">Ingredientes:</label>
          <textarea id="ingredients" name="ingredients" value={newRecipe.ingredients} onChange={handleChange} required />

          <label htmlFor="steps">Instrucciones:</label>
          <textarea id="steps" name="steps" value={newRecipe.steps} onChange={handleChange} required />

          <label htmlFor="image_url">Imagen:</label>
          <textarea id="image_url" name="image_url" value={newRecipe.image_url} onChange={handleChange} required />
        </div>

        <button type="submit">Agregar Receta</button>
      </form>
    </div>
  )
}
