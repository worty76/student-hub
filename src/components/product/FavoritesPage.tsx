/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Heart,
  AlertCircle,
  RefreshCw,
  ShoppingBag,
  Grid,
  List,
} from "lucide-react";
import { toast } from "sonner";
import useFavorites from "@/hooks/useFavorites";
import { FavoritesList } from "./FavoritesList";

export function FavoritesPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const {
    favoriteProductsData,
    isLoading,
    error,
    isAuthenticated,
    refreshFavorites,
    clearError,
  } = useFavorites();

  // Handle authentication redirect
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Unauthorized", {
        description: "Please log in to view your favorites",
        action: {
          label: "Login",
          onClick: () => router.push("/auth/login"),
        },
      });
    }
  }, [isAuthenticated, router]);

  const handleRefresh = async () => {
    clearError();
    await refreshFavorites();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-semibold mb-2">
            Loading your favorites...
          </h2>
          <p className="text-muted-foreground">
            Please wait while we fetch your favorite products
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card className="max-w-lg mx-auto">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  {error === "Unauthorized"
                    ? "Unauthorized"
                    : error === "User not found"
                    ? "User Not Found"
                    : "Error Loading Favorites"}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {error === "Unauthorized"
                    ? "Please log in to view your favorites"
                    : error === "User not found"
                    ? "Unable to find your user account"
                    : "There was an error loading your favorite products"}
                </p>
              </div>
              <div className="flex gap-2 justify-center">
                {error === "Unauthorized" ? (
                  <Button onClick={() => router.push("/auth/login")}>
                    Go to Login
                  </Button>
                ) : (
                  <Button onClick={handleRefresh} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Empty state
  if (!favoriteProductsData || favoriteProductsData.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card className="max-w-lg mx-auto">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h2 className="text-xl font-semibold mb-2">No Favorites Yet</h2>
                <p className="text-muted-foreground mb-4">
                  You haven&apos;t added any products to your favorites list
                  yet. Start exploring and add products you like!
                </p>
              </div>
              <Button onClick={() => router.push("/marketplace")}>
                <ShoppingBag className="h-4 w-4 mr-2" />
                Browse Products
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
            <p className="text-muted-foreground">
              {favoriteProductsData.length} product
              {favoriteProductsData.length !== 1 ? "s" : ""} in your favorites
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* View Toggle */}
            <div className="flex rounded-lg border">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4 mr-2" />
                Grid
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4 mr-2" />
                Table
              </Button>
            </div>

            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === "grid" ? (
        <FavoritesList />
      ) : (
        <div className="space-y-4">
          {/* Table View for Desktop */}
          <div className="hidden lg:block">
            <Card>
              <CardHeader>
                <CardTitle>Favorites Table</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium">Product</th>
                        <th className="text-left p-4 font-medium">Price</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Condition</th>
                        <th className="text-left p-4 font-medium">Category</th>
                        <th className="text-left p-4 font-medium">Location</th>
                        <th className="text-left p-4 font-medium">Views</th>
                        <th className="text-left p-4 font-medium">Favorites</th>
                        <th className="text-left p-4 font-medium">Created</th>
                        <th className="text-left p-4 font-medium">Updated</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {favoriteProductsData.map((product) => (
                        <tr
                          key={product._id}
                          className="border-b hover:bg-muted/50 transition-colors"
                        >
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                                {product.images && product.images.length > 0 ? (
                                  <img
                                    src={product.images[0]}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full">
                                    <ShoppingBag className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-sm truncate">
                                  {product.title}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {product._id}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-green-600">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(product.price)}
                            </span>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline">{product.status}</Badge>
                          </td>
                          <td className="p-4">
                            <Badge variant="secondary">
                              {product.condition}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <span className="text-sm">{product.category}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm">{product.location}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm">{product.views}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm">{product.favorites}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-xs text-muted-foreground">
                              {new Date(product.createdAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-xs text-muted-foreground">
                              {new Date(product.updatedAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                          </td>
                          <td className="p-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                router.push(`/products/${product._id}`)
                              }
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mobile/Tablet fallback to grid */}
          <div className="lg:hidden">
            <FavoritesList />
          </div>
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;
