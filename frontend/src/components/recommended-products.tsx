"use client"

import { ChevronRight } from "lucide-react"
import { ProductCard } from "@/components/product-card"

const products = [
  {
    id: 1,
    name: "Hydrating Serum with Hyaluronic Acid",
    image: "/placeholder.svg?height=160&width=160",
    ingredients: ["Hyaluronic Acid", "Niacinamide"],
    matchScore: 95,
  },
  {
    id: 2,
    name: "Vitamin C Brightening Essence",
    image: "/placeholder.svg?height=160&width=160",
    ingredients: ["Vitamin C", "Ferulic Acid"],
    matchScore: 88,
  },
  {
    id: 3,
    name: "Calming Centella Cream",
    image: "/placeholder.svg?height=160&width=160",
    ingredients: ["Centella Asiatica", "Panthenol"],
    matchScore: 92,
  },
  {
    id: 4,
    name: "Retinol Night Treatment",
    image: "/placeholder.svg?height=160&width=160",
    ingredients: ["Retinol", "Squalane"],
    matchScore: 85,
  },
]

export function RecommendedProducts() {
  return (
    <section className="pb-28 lg:pb-8">
      <div className="mb-4 flex items-center justify-between px-5">
        <h2 className="text-lg font-semibold text-foreground">
          Recommended for You
        </h2>
        <button className="flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground">
          See all
          <ChevronRight className="ml-0.5 h-4 w-4" />
        </button>
      </div>
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            image={product.image}
            ingredients={product.ingredients}
            matchScore={product.matchScore}
          />
        ))}
      </div>
    </section>
  )
}
