'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2,
  MapPin,
  CreditCard,
  Wallet,
  Eye,
  EyeOff,
  Building2
} from 'lucide-react';
import { ShippingAddress, PaymentMethod } from '@/types/profile';

const mockShippingAddresses: ShippingAddress[] = [
  {
    id: 'SA001',
    label: 'Home',
    name: 'Nguyen Van A',
    phone: '+84 123 456 789',
    address: '123 Nguyen Hue Street',
    city: 'Ho Chi Minh City',
    state: 'Ho Chi Minh',
    zipCode: '700000',
    isDefault: true
  },
  {
    id: 'SA002',
    label: 'Office',
    name: 'Nguyen Van A',
    phone: '+84 123 456 789',
    address: '456 Le Loi Street, District 1',
    city: 'Ho Chi Minh City',
    state: 'Ho Chi Minh',
    zipCode: '700000',
    isDefault: false
  }
];

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'PM001',
    type: 'card',
    label: 'Primary Card',
    details: '**** **** **** 1234',
    isDefault: true,
    lastUsed: new Date('2024-01-20')
  },
  {
    id: 'PM002',
    type: 'bank',
    label: 'Vietcombank',
    details: 'Account ending in 5678',
    isDefault: false,
    lastUsed: new Date('2024-01-18')
  },
  {
    id: 'PM003',
    type: 'wallet',
    label: 'MoMo Wallet',
    details: '+84 123 456 789',
    isDefault: false,
    lastUsed: new Date('2024-01-15')
  }
];

interface AddressFormData {
  label: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface PaymentFormData {
  type: 'card' | 'bank' | 'wallet';
  label: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  accountNumber?: string;
  bankName?: string;
  phoneNumber?: string;
}

export function ShippingPaymentSettings() {
  const [activeTab, setActiveTab] = useState<'shipping' | 'payment'>('shipping');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const [showCardDetails, setShowCardDetails] = useState(false);

  const [addressForm, setAddressForm] = useState<AddressFormData>({
    label: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [paymentForm, setPaymentForm] = useState<PaymentFormData>({
    type: 'card',
    label: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    accountNumber: '',
    bankName: '',
    phoneNumber: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAddressForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!addressForm.label) newErrors.label = 'Label is required';
    if (!addressForm.name) newErrors.name = 'Name is required';
    if (!addressForm.phone) newErrors.phone = 'Phone is required';
    if (!addressForm.address) newErrors.address = 'Address is required';
    if (!addressForm.city) newErrors.city = 'City is required';
    if (!addressForm.state) newErrors.state = 'State is required';
    if (!addressForm.zipCode) newErrors.zipCode = 'Zip code is required';

    // Phone validation
    if (addressForm.phone && !/^\+84\s\d{3}\s\d{3}\s\d{3}$/.test(addressForm.phone)) {
      newErrors.phone = 'Invalid phone format (e.g., +84 123 456 789)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!paymentForm.label) newErrors.label = 'Label is required';

    if (paymentForm.type === 'card') {
      if (!paymentForm.cardNumber) newErrors.cardNumber = 'Card number is required';
      if (!paymentForm.expiryDate) newErrors.expiryDate = 'Expiry date is required';
      if (!paymentForm.cvv) newErrors.cvv = 'CVV is required';
      
      // Card number validation (basic)
      if (paymentForm.cardNumber && !/^\d{16}$/.test(paymentForm.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Invalid card number';
      }
      
      // CVV validation
      if (paymentForm.cvv && !/^\d{3,4}$/.test(paymentForm.cvv)) {
        newErrors.cvv = 'Invalid CVV';
      }
    } else if (paymentForm.type === 'bank') {
      if (!paymentForm.accountNumber) newErrors.accountNumber = 'Account number is required';
      if (!paymentForm.bankName) newErrors.bankName = 'Bank name is required';
    } else if (paymentForm.type === 'wallet') {
      if (!paymentForm.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAddress = () => {
    if (validateAddressForm()) {
      console.log('Save address:', addressForm);
      setShowAddressForm(false);
      setEditingAddressId(null);
      setAddressForm({
        label: '',
        name: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: ''
      });
    }
  };

  const handleSavePayment = () => {
    if (validatePaymentForm()) {
      console.log('Save payment method:', paymentForm);
      setShowPaymentForm(false);
      setEditingPaymentId(null);
      setPaymentForm({
        type: 'card',
        label: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        accountNumber: '',
        bankName: '',
        phoneNumber: ''
      });
    }
  };

  const getPaymentIcon = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'card': return <CreditCard className="w-5 h-5" />;
      case 'bank': return <Building2 className="w-5 h-5" />;
      case 'wallet': return <Wallet className="w-5 h-5" />;
      default: return <CreditCard className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-600">Manage your shipping and payment preferences</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('shipping')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'shipping'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Shipping Addresses</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'payment'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>Payment Methods</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Shipping Addresses Tab */}
      {activeTab === 'shipping' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Shipping Addresses</h3>
            <Button onClick={() => setShowAddressForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Address
            </Button>
          </div>

          {/* Address List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockShippingAddresses.map((address) => (
              <Card key={address.id} className="relative">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold">{address.label}</h4>
                      {address.isDefault && (
                        <Badge className="bg-green-100 text-green-800">Default</Badge>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost" onClick={() => setEditingAddressId(address.id)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p className="font-medium text-gray-900">{address.name}</p>
                    <p>{address.phone}</p>
                    <p>{address.address}</p>
                    <p>{address.city}, {address.state} {address.zipCode}</p>
                  </div>
                  {!address.isDefault && (
                    <Button size="sm" variant="outline" className="mt-3">
                      Set as Default
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add/Edit Address Form */}
          {(showAddressForm || editingAddressId) && (
            <Card>
              <CardHeader>
                <CardTitle>{editingAddressId ? 'Edit Address' : 'Add New Address'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Label *
                    </label>
                    <Input
                      value={addressForm.label}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, label: e.target.value }))}
                      placeholder="e.g., Home, Office"
                    />
                    {errors.label && (
                      <p className="text-red-600 text-sm mt-1">{errors.label}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <Input
                      value={addressForm.name}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <Input
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+84 123 456 789"
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zip Code *
                    </label>
                    <Input
                      value={addressForm.zipCode}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, zipCode: e.target.value }))}
                      placeholder="700000"
                    />
                    {errors.zipCode && (
                      <p className="text-red-600 text-sm mt-1">{errors.zipCode}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <Input
                    value={addressForm.address}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Street address"
                  />
                  {errors.address && (
                    <p className="text-red-600 text-sm mt-1">{errors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <Input
                      value={addressForm.city}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Ho Chi Minh City"
                    />
                    {errors.city && (
                      <p className="text-red-600 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province *
                    </label>
                    <Select value={addressForm.state} onValueChange={(value) => setAddressForm(prev => ({ ...prev, state: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hanoi">Hanoi</SelectItem>
                        <SelectItem value="ho-chi-minh">Ho Chi Minh</SelectItem>
                        <SelectItem value="da-nang">Da Nang</SelectItem>
                        <SelectItem value="can-tho">Can Tho</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.state && (
                      <p className="text-red-600 text-sm mt-1">{errors.state}</p>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button onClick={handleSaveAddress}>
                    {editingAddressId ? 'Update Address' : 'Save Address'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowAddressForm(false);
                      setEditingAddressId(null);
                      setErrors({});
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Payment Methods Tab */}
      {activeTab === 'payment' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Payment Methods</h3>
            <Button onClick={() => setShowPaymentForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </div>

          {/* Payment Methods List */}
          <div className="space-y-4">
            {mockPaymentMethods.map((method) => (
              <Card key={method.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getPaymentIcon(method.type)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold">{method.label}</h4>
                          {method.isDefault && (
                            <Badge className="bg-green-100 text-green-800">Default</Badge>
                          )}
                        </div>
                        <p className="text-gray-600">{method.details}</p>
                        {method.lastUsed && (
                          <p className="text-sm text-gray-500">
                            Last used: {method.lastUsed.toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {!method.isDefault && (
                        <Button size="sm" variant="outline">
                          Set Default
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => setEditingPaymentId(method.id)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add/Edit Payment Method Form */}
          {(showPaymentForm || editingPaymentId) && (
            <Card>
              <CardHeader>
                <CardTitle>{editingPaymentId ? 'Edit Payment Method' : 'Add Payment Method'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Type *
                    </label>
                    <Select 
                      value={paymentForm.type} 
                      onValueChange={(value: 'card' | 'bank' | 'wallet') => setPaymentForm(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                        <SelectItem value="bank">Bank Account</SelectItem>
                        <SelectItem value="wallet">Digital Wallet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Label *
                    </label>
                    <Input
                      value={paymentForm.label}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, label: e.target.value }))}
                      placeholder="e.g., Primary Card, Work Account"
                    />
                    {errors.label && (
                      <p className="text-red-600 text-sm mt-1">{errors.label}</p>
                    )}
                  </div>
                </div>

                {/* Card Fields */}
                {paymentForm.type === 'card' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number *
                      </label>
                      <div className="relative">
                        <Input
                          type={showCardDetails ? 'text' : 'password'}
                          value={paymentForm.cardNumber}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, cardNumber: e.target.value }))}
                          placeholder="1234 5678 9012 3456"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCardDetails(!showCardDetails)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showCardDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.cardNumber && (
                        <p className="text-red-600 text-sm mt-1">{errors.cardNumber}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date *
                        </label>
                        <Input
                          value={paymentForm.expiryDate}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                          placeholder="MM/YY"
                        />
                        {errors.expiryDate && (
                          <p className="text-red-600 text-sm mt-1">{errors.expiryDate}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV *
                        </label>
                        <Input
                          type="password"
                          value={paymentForm.cvv}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, cvv: e.target.value }))}
                          placeholder="123"
                        />
                        {errors.cvv && (
                          <p className="text-red-600 text-sm mt-1">{errors.cvv}</p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Bank Fields */}
                {paymentForm.type === 'bank' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bank Name *
                      </label>
                      <Select 
                        value={paymentForm.bankName} 
                        onValueChange={(value) => setPaymentForm(prev => ({ ...prev, bankName: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select bank" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vietcombank">Vietcombank</SelectItem>
                          <SelectItem value="techcombank">Techcombank</SelectItem>
                          <SelectItem value="bidv">BIDV</SelectItem>
                          <SelectItem value="mb">MB Bank</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.bankName && (
                        <p className="text-red-600 text-sm mt-1">{errors.bankName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Number *
                      </label>
                      <Input
                        value={paymentForm.accountNumber}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, accountNumber: e.target.value }))}
                        placeholder="Enter account number"
                      />
                      {errors.accountNumber && (
                        <p className="text-red-600 text-sm mt-1">{errors.accountNumber}</p>
                      )}
                    </div>
                  </>
                )}

                {/* Wallet Fields */}
                {paymentForm.type === 'wallet' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <Input
                      value={paymentForm.phoneNumber}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      placeholder="+84 123 456 789"
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-600 text-sm mt-1">{errors.phoneNumber}</p>
                    )}
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button onClick={handleSavePayment}>
                    {editingPaymentId ? 'Update Payment Method' : 'Save Payment Method'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowPaymentForm(false);
                      setEditingPaymentId(null);
                      setErrors({});
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
} 