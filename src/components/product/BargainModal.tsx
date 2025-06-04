'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  X, 
  DollarSign, 
  TrendingDown,
  AlertCircle,
  Send,
} from 'lucide-react';
import { ProductDetail } from '@/types/product';
import Image from 'next/image';

interface BargainModalProps {
  product: ProductDetail;
  onClose: () => void;
  onSubmit: (offer: { price: number; message?: string }) => void;
}

export function BargainModal({ product, onClose, onSubmit }: BargainModalProps) {
  const [offerPrice, setOfferPrice] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price * 1000);
  };

  const parsePrice = (priceStr: string): number => {
    return parseFloat(priceStr.replace(/[^\d.]/g, ''));
  };

  const calculateSavings = () => {
    const offer = parsePrice(offerPrice);
    if (offer && offer < product.price) {
      return product.price - offer;
    }
    return 0;
  };

  const calculatePercentage = () => {
    const offer = parsePrice(offerPrice);
    if (offer && offer < product.price) {
      return ((product.price - offer) / product.price * 100).toFixed(1);
    }
    return 0;
  };

  const validateOffer = (): boolean => {
    const newErrors: Record<string, string> = {};
    const offer = parsePrice(offerPrice);

    if (!offerPrice) {
      newErrors.price = 'Please enter an offer price';
    } else if (isNaN(offer) || offer <= 0) {
      newErrors.price = 'Please enter a valid price';
    } else if (product.bargaining.minPrice && offer < product.bargaining.minPrice) {
      newErrors.price = `Minimum offer is ${formatPrice(product.bargaining.minPrice)}`;
    } else if (offer >= product.price) {
      newErrors.price = 'Offer must be less than listed price';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateOffer()) {
      onSubmit({
        price: parsePrice(offerPrice),
        message: message.trim() || undefined
      });
    }
  };

  const handleQuickOffer = (percentage: number) => {
    const quickOffer = product.price * (1 - percentage / 100);
    const minPrice = product.bargaining.minPrice || 0;
    const finalOffer = Math.max(quickOffer, minPrice);
    setOfferPrice(finalOffer.toFixed(2));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Make an Offer</span>
              </CardTitle>
              <CardDescription>
                Negotiate a better price with the seller
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Product Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Image
                src={product.images[0]}
                alt={product.title}
                width={64}
                height={64}
                className="object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-medium text-sm line-clamp-2 mb-1">{product.title}</h3>
                <div className="text-2xl font-bold text-blue-600">
                  {formatPrice(product.price)}
                </div>
                {product.bargaining.minPrice && (
                  <div className="text-sm text-gray-600">
                    Min: {formatPrice(product.bargaining.minPrice)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Offer Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Offers
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[10, 15, 20].map((percentage) => {
                const offerAmount = product.price * (1 - percentage / 100);
                const minPrice = product.bargaining.minPrice || 0;
                const isValidOffer = offerAmount >= minPrice;
                
                return (
                  <Button
                    key={percentage}
                    variant="outline"
                    size="sm"
                    disabled={!isValidOffer}
                    onClick={() => handleQuickOffer(percentage)}
                    className="text-xs"
                  >
                    -{percentage}%
                    <br />
                    {formatPrice(Math.max(offerAmount, minPrice))}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Custom Offer Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Offer *
            </label>
            <div className="relative">
              <Input
                type="number"
                step="0.01"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                placeholder="Enter your offer"
                className="pr-12"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                VND
              </div>
            </div>
            {errors.price && (
              <p className="text-red-600 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          {/* Savings Display */}
          {offerPrice && !errors.price && calculateSavings() > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingDown className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">You save:</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">
                    {formatPrice(calculateSavings())}
                  </div>
                  <div className="text-sm text-green-600">
                    ({calculatePercentage()}% off)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Message Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message to Seller (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message to increase your chances..."
              className="w-full p-3 border border-gray-300 rounded-md resize-none"
              rows={3}
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1">
              {message.length}/500 characters
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800 mb-1">Bargaining Tips</p>
                <ul className="text-blue-700 space-y-1">
                  <li>• Be respectful and reasonable with your offer</li>
                  <li>• Explain why you&apos;re interested in the item</li>
                  <li>• Mention if you can pick up immediately</li>
                  <li>• Be prepared to negotiate</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              <Send className="w-4 h-4 mr-2" />
              Send Offer
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="text-xs text-gray-500 text-center">
            Your offer will be sent to the seller. They can accept, reject, or counter your offer.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}