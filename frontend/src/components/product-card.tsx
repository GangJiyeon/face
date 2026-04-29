"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProductCardProps {
  name: string
  image: string
  ingredients: string[]
  matchScore: number
}

export function ProductCard({
  name,
  image,
  ingredients,
  matchScore,
}: ProductCardProps) {
  return (
    <Card className="w-40 shrink-0 snap-start border-0 bg-white shadow-sm">
      <CardContent className="p-3">
        <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-[#FDF2F8] to-[#F3E8FF]">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
          />
          <Badge className="absolute top-2 right-2 border-0 bg-[#C4B5FD] text-xs font-medium text-white">
            {matchScore}%
          </Badge>
        </div>
        <h3 className="line-clamp-2 text-sm font-medium text-foreground">
          {name}
        </h3>
        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
          {ingredients.join(", ")}
        </p>
      </CardContent>
    </Card>
  )
}
