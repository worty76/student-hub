"use client";

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ProductDetail } from '@/types/product';
import { categories } from '@/constants/marketplace-data';
import { 
  ImagePlus, 
  X, 
  Eye, 
  Upload,
  MapPin,
  DollarSign,
  Package,
  Tag,
  FileText,
  Camera,
  AlertCircle,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ProductFormData {
  title: string;
  description: string;
  price: string;
  category: string;
  condition: ProductDetail['condition'];
  location: string;
  images: File[];
  specifications: Record<string, string>;
  shipping: {
    methods: string[];
    cost: string;
    estimatedDays: string;
  };
  bargaining: {
    enabled: boolean;
    minPrice: string;
    acceptsOffers: boolean;
  };
}

interface FormErrors {
  [key: string]: string;
}

interface ProductListingFormProps {
  onSubmit?: (data: ProductFormData) => void;
  onPreview?: (data: ProductFormData) => void;
  isSubmitting?: boolean;
}

const CONDITION_OPTIONS = [
  { value: 'like-new', label: 'Like New', description: 'Barely used, perfect condition' },
  { value: 'good', label: 'Good', description: 'Minor wear, works perfectly' },
  { value: 'fair', label: 'Fair', description: 'Visible wear, fully functional' },
  { value: 'poor', label: 'Poor', description: 'Heavy wear, may need repair' }
] as const;

const SHIPPING_METHODS = [
  'Pickup Only',
  'Local Delivery',
  'Express Shipping',
  'Standard Shipping'
];

// Local areas data since it was removed from marketplace-data
const areas = [
  { id: 'fpt', name: 'FPT University Area' },
  { id: 'duytan', name: 'Duy Tân Area' },
  { id: 'bachkhoa', name: 'Bách Khoa Area' },
  { id: 'downtown', name: 'Downtown Area' },
  { id: 'other', name: 'Other Area' }
];

export function ProductListingForm({ 
  onSubmit, 
  onPreview, 
  isSubmitting = false 
}: ProductListingFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: 'good',
    location: '',
    images: [],
    specifications: {},
    shipping: {
      methods: ['Pickup Only'],
      cost: '0',
      estimatedDays: '1'
    },
    bargaining: {
      enabled: false,
      minPrice: '',
      acceptsOffers: true
    }
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [dragActive, setDragActive] = useState(false);
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (formData.title.length > 100) newErrors.title = 'Title must be less than 100 characters';
    
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.description.length < 20) newErrors.description = 'Description must be at least 20 characters';
    
    if (!formData.price) newErrors.price = 'Price is required';
    if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a valid positive number';
    }
    
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (formData.images.length === 0) newErrors.images = 'At least one image is required';
    if (formData.images.length > 10) newErrors.images = 'Maximum 10 images allowed';

    if (formData.bargaining.enabled && formData.bargaining.minPrice) {
      const minPrice = Number(formData.bargaining.minPrice);
      const price = Number(formData.price);
      if (minPrice >= price) {
        newErrors.minPrice = 'Minimum price must be less than listing price';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ProductFormData, value: string | number | boolean | File[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNestedChange = (
    parent: keyof ProductFormData,
    field: string,
    value: string | number | boolean | string[]
  ) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as Record<string, unknown>),
        [field]: value
      }
    }));
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newImages = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) return false;
      if (file.size > 10 * 1024 * 1024) return false; // 10MB limit
      return true;
    });

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, 10)
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [newSpecKey.trim()]: newSpecValue.trim()
        }
      }));
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  const removeSpecification = (key: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: Object.fromEntries(
        Object.entries(prev.specifications).filter(([k]) => k !== key)
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit?.(formData);
    }
  };

  const handlePreview = () => {
    if (validateForm()) {
      setShowPreview(true);
      onPreview?.(formData);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">List Your Product</h1>
          <p className="text-muted-foreground mt-2">
            Create a listing to sell your item to the community
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handlePreview}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button 
            type="submit" 
            form="product-form"
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Listing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                List Product
              </>
            )}
          </Button>
        </div>
      </div>

      <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Product Title *</label>
              <Input
                placeholder="What are you selling?"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                maxLength={100}
                className={cn(errors.title && "border-red-500")}
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {formData.title.length}/100 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                className={cn(
                  "flex min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
                  errors.description && "border-red-500 focus-visible:ring-red-500"
                )}
                placeholder="Describe your item in detail. Include condition, features, reason for selling, etc."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                maxLength={2000}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {formData.description.length}/2000 characters
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Price (VND) *</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className={cn("pl-10", errors.price && "border-red-500")}
                    min="0"
                    step="1000"
                  />
                </div>
                {errors.price && (
                  <p className="text-sm text-red-500 mt-1">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger className={cn(errors.category && "border-red-500")}>
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      <SelectValue placeholder="Select a category" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500 mt-1">{errors.category}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Condition *</label>
                <Select 
                  value={formData.condition} 
                  onValueChange={(value: ProductDetail['condition']) => handleInputChange('condition', value)}
                >
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {CONDITION_OPTIONS.map((condition) => (
                      <SelectItem key={condition.value} value={condition.value}>
                        <div>
                          <div className="font-medium">{condition.label}</div>
                          <div className="text-xs text-muted-foreground">{condition.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location *</label>
                <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                  <SelectTrigger className={cn(errors.location && "border-red-500")}>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <SelectValue placeholder="Select your area" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((area) => (
                      <SelectItem key={area.id} value={area.name}>
                        {area.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.location && (
                  <p className="text-sm text-red-500 mt-1">{errors.location}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Product Images
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                errors.images && "border-red-500"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e.target.files)}
              />
              <ImagePlus className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">Upload Product Images</p>
              <p className="text-muted-foreground mb-4">
                Drag and drop images here, or click to browse
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose Files
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Maximum 10 images, 10MB each. JPG, PNG supported.
              </p>
            </div>

            {errors.images && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                {errors.images}
              </div>
            )}

            {formData.images.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-3">
                  Selected Images ({formData.images.length}/10)
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        width={96}
                        height={96}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {index === 0 && (
                        <Badge className="absolute bottom-1 left-1 text-xs">
                          Cover
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Product Specifications (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input
                placeholder="Specification name (e.g., Brand)"
                value={newSpecKey}
                onChange={(e) => setNewSpecKey(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Value (e.g., Apple)"
                value={newSpecValue}
                onChange={(e) => setNewSpecValue(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={addSpecification}
                disabled={!newSpecKey.trim() || !newSpecValue.trim()}
              >
                Add
              </Button>
            </div>

            {Object.entries(formData.specifications).length > 0 && (
              <div className="space-y-2">
                {Object.entries(formData.specifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <span className="font-medium">{key}:</span>
                      <span className="ml-2">{value}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSpecification(key)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Shipping & Pricing Options */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping & Pricing Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Shipping Methods</label>
              <div className="grid grid-cols-2 gap-3">
                {SHIPPING_METHODS.map((method) => (
                  <label key={method} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.shipping.methods.includes(method)}
                      onChange={(e) => {
                        const methods = e.target.checked
                          ? [...formData.shipping.methods, method]
                          : formData.shipping.methods.filter(m => m !== method);
                        handleNestedChange('shipping', 'methods', methods);
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{method}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Shipping Cost (VND)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.shipping.cost}
                  onChange={(e) => handleNestedChange('shipping', 'cost', e.target.value)}
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Delivery Days</label>
                <Input
                  type="number"
                  placeholder="1"
                  value={formData.shipping.estimatedDays}
                  onChange={(e) => handleNestedChange('shipping', 'estimatedDays', e.target.value)}
                  min="1"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="bargaining"
                  checked={formData.bargaining.enabled}
                  onChange={(e) => handleNestedChange('bargaining', 'enabled', e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="bargaining" className="text-sm font-medium">
                  Allow price negotiation
                </label>
              </div>

              {formData.bargaining.enabled && (
                <div className="ml-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Minimum Price (VND)</label>
                    <Input
                      type="number"
                      placeholder="Lowest price you'll accept"
                      value={formData.bargaining.minPrice}
                      onChange={(e) => handleNestedChange('bargaining', 'minPrice', e.target.value)}
                      className={cn(errors.minPrice && "border-red-500")}
                      min="0"
                    />
                    {errors.minPrice && (
                      <p className="text-sm text-red-500 mt-1">{errors.minPrice}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="accepts-offers"
                      checked={formData.bargaining.acceptsOffers}
                      onChange={(e) => handleNestedChange('bargaining', 'acceptsOffers', e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="accepts-offers" className="text-sm">
                      Accept instant offers
                    </label>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Preview Modal */}
      {showPreview && (
        <ProductPreview 
          formData={formData} 
          onClose={() => setShowPreview(false)} 
        />
      )}
    </div>
  );
}

// Preview Component
function ProductPreview({ 
  formData, 
  onClose 
}: { 
  formData: ProductFormData; 
  onClose: () => void; 
}) {
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('vi-VN').format(Number(price)) + ' VND';
  };

  const getConditionColor = (condition: ProductDetail['condition']) => {
    const colors = {
      'like-new': 'bg-green-100 text-green-800',
      'good': 'bg-blue-100 text-blue-800',
      'fair': 'bg-yellow-100 text-yellow-800',
      'poor': 'bg-red-100 text-red-800'
    };
    return colors[condition];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Preview Listing</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Images */}
          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {formData.images.slice(0, 4).map((file, index) => (
                <Image
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt={`Product ${index + 1}`}
                  width={128}
                  height={128}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          {/* Basic Info */}
          <div>
            <h1 className="text-2xl font-bold mb-2">{formData.title}</h1>
            <p className="text-3xl font-bold text-primary mb-4">
              {formatPrice(formData.price)}
            </p>
            <div className="flex items-center gap-3 mb-4">
              <Badge className={getConditionColor(formData.condition)}>
                {formData.condition}
              </Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {formData.location}
              </span>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{formData.description}</p>
          </div>

          {/* Specifications */}
          {Object.keys(formData.specifications).length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Specifications</h3>
              <div className="space-y-2">
                {Object.entries(formData.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-sm text-gray-600">{key}</span>
                    <span className="text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shipping */}
          <div>
            <h3 className="font-semibold mb-3">Shipping Information</h3>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Methods:</span> {formData.shipping.methods.join(', ')}
              </p>
              <p className="text-sm">
                <span className="font-medium">Cost:</span> {formatPrice(formData.shipping.cost)}
              </p>
              <p className="text-sm">
                <span className="font-medium">Delivery:</span> {formData.shipping.estimatedDays} day(s)
              </p>
            </div>
          </div>

          {/* Bargaining */}
          {formData.bargaining.enabled && (
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700">Price negotiation available</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}