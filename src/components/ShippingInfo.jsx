import React from 'react';
import { Truck, Gift, Info } from 'lucide-react';

export default function ShippingInfo({ subtotal }) {
  const isFreeShipping = subtotal >= 999;
  const amountNeeded = 999 - subtotal;
  
  return (
    <div className="space-y-3">
      {/* Shipping Status Card */}
      <div className={`p-4 rounded-xl border-2 transition-all ${
        isFreeShipping 
          ? 'border-green-200 bg-green-50' 
          : 'border-amber-200 bg-amber-50'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${
            isFreeShipping ? 'bg-green-100' : 'bg-amber-100'
          }`}>
            <Truck className={`h-5 w-5 ${
              isFreeShipping ? 'text-green-600' : 'text-amber-600'
            }`} />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm">
              {isFreeShipping ? 'FREE Shipping Applied!' : 'Standard Shipping'}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {isFreeShipping 
                ? 'You saved ₹49 on shipping charges' 
                : 'Ships within 24-48 hours • Trackable'
              }
            </div>
          </div>
          <div className="text-right">
            <div className={`font-bold ${isFreeShipping ? 'text-green-600' : 'text-amber-600'}`}>
              {isFreeShipping ? 'FREE' : '₹49'}
            </div>
            {!isFreeShipping && (
              <div className="text-[10px] text-muted-foreground">+GST</div>
            )}
          </div>
        </div>
      </div>
      
      {/* Free Shipping Progress */}
      {!isFreeShipping && subtotal > 0 && (
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-700">
              Add ₹{amountNeeded.toLocaleString('en-IN')} more for FREE shipping
            </span>
          </div>
          <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((subtotal / 999) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-blue-600 mt-1">
            <span>₹0</span>
            <span>₹500</span>
            <span>₹999</span>
          </div>
        </div>
      )}
      
      {/* GST Info */}
      {!isFreeShipping && subtotal > 0 && (
        <div className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
          <Info className="h-3 w-3 text-muted-foreground mt-0.5" />
          <div className="text-[10px] text-muted-foreground">
            Shipping charges include 18% GST. Total shipping: ₹49 (GST: ₹8.82)
          </div>
        </div>
      )}
      
      {/* Free Shipping Banner */}
      {isFreeShipping && (
        <div className="flex items-center gap-2 p-2 bg-green-100 rounded-lg">
          <Truck className="h-3 w-3 text-green-600" />
          <div className="text-[10px] text-green-700 font-medium">
            ✓ Free shipping applied. No hidden charges.
          </div>
        </div>
      )}
    </div>
  );
}
