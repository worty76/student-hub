'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Category } from '@/types/marketplace';
import Link from 'next/link';

interface FeaturedCategoriesProps {
  categories: Category[];
}

export function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Browse by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find exactly what you&apos;re looking for in our carefully organized categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/category/${category.id}`}
              className="group block"
            >
              <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white border-0 shadow-lg">
                <div className="relative h-48 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundImage: `url(${category.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 text-4xl">
                    {category.icon}
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="text-sm font-medium bg-white text-black bg-opacity-20 px-2 py-1 rounded-full">
                      {category.productCount.toLocaleString()} items
                    </span>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-all group-hover:translate-x-1" />
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {category.description}
                  </p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
                      Explore Category →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Link href="/categories">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
              View All Categories
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
} 