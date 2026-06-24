"use client"

import { ChevronRight } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { Product } from "@/types/api"

interface RecommendedProductsProps {
  products: Product[]
}

export function RecommendedProducts({ products }: RecommendedProductsProps) {
  if (products.length === 0) return null

  return (
    <section className="pb-28 lg:pb-8">
      <div className="mb-4 flex items-center justify-between px-5">
        <h2 className="text-lg font-semibold text-foreground">Recommended for You</h2>
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
            image={product.image_url || "/placeholder.svg?height=160&width=160"}
            ingredients={[]}
            matchScore={product.match_score ?? 0}
          />
        ))}
      </div>
    </section>
  )
}
