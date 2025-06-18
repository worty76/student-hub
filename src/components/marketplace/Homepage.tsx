'use client';

import { BannerSlider } from './BannerSlider';
import { FeaturedCategories } from './FeaturedCategories';
import { SuggestedListings } from './SuggestedListings';
import { bannerSlides, categories } from '@/constants/marketplace-data';

export function Homepage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="container mx-auto px-4 py-8">
        <BannerSlider slides={bannerSlides} autoPlayInterval={6000} />
      </section>

      <FeaturedCategories categories={categories} />

      <SuggestedListings />

      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Trading?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of students and locals buying and selling quality second-hand items
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg">
                Start Selling
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 hover:scale-105">
                Browse Items
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA Stats */}
      <section className="py-12 bg-white border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">2,500+</div>
              <div className="text-gray-600">Active Listings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">1,200+</div>
              <div className="text-gray-600">Happy Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">850+</div>
              <div className="text-gray-600">Successful Deals</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">15</div>
              <div className="text-gray-600">University Areas</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 