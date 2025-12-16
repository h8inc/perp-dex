import React, { useState } from 'react';
import { TradingBoxPrimitive } from './TradingBoxPrimitive';

// @component: TradingBoxTestPage
// Simple test page to test TradingBoxPrimitive in isolation
// Useful for testing mobile and desktop views during development
export const TradingBoxTestPage = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="min-h-screen w-full bg-[#0b0e11] text-white font-sans">
      {/* Test Controls Bar */}
      <div className="sticky top-0 z-50 bg-[#15191e] border-b border-white/10 p-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">TradingBox Primitive Test</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('desktop')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'desktop'
                  ? 'bg-[#15F46F] text-[#06171E]'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              Desktop
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'mobile'
                  ? 'bg-[#15F46F] text-[#06171E]'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              Mobile
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Wallet:</span>
            <button
              onClick={() => setIsWalletConnected(!isWalletConnected)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isWalletConnected
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
            >
              {isWalletConnected ? 'Connected' : 'Disconnected'}
            </button>
          </div>
          
          {viewMode === 'mobile' && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Sheet:</span>
              <button
                onClick={() => setIsMobileSheetOpen(!isMobileSheetOpen)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isMobileSheetOpen
                    ? 'bg-[#15F46F] text-[#06171E]'
                    : 'bg-white/5 text-gray-400'
                }`}
              >
                {isMobileSheetOpen ? 'Open' : 'Closed'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Test Container */}
      <div className={`w-full ${viewMode === 'desktop' ? 'flex items-center justify-center p-8' : 'h-screen relative'}`}>
        {viewMode === 'desktop' ? (
          // Desktop View - Centered container
          <div className="w-full max-w-[520px] h-[800px] border border-white/10 rounded-lg overflow-hidden bg-[#0b0e11]">
            <TradingBoxPrimitive
              isWalletConnected={isWalletConnected}
              onConnectWallet={() => setIsWalletConnected(true)}
              onDisconnect={() => setIsWalletConnected(false)}
            />
          </div>
        ) : (
          // Mobile View - Full screen with bottom sheet
          <div className="relative w-full h-full bg-[#0b0e11]">
            {/* Mock content area to show the sheet behavior */}
            <div className="p-4 space-y-4">
              <div className="bg-[#15191e] rounded-lg p-4 border border-white/10">
                <h2 className="text-sm font-medium text-gray-400 mb-2">Mock Trading Interface</h2>
                <p className="text-xs text-gray-500">
                  This is a test page. The TradingBox appears as a bottom sheet on mobile.
                  Toggle the sheet state using the controls above.
                </p>
              </div>
              
              <div className="bg-[#15191e] rounded-lg p-4 border border-white/10">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Test Instructions</h3>
                <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
                  <li>Use the "Sheet" toggle to open/close the bottom sheet</li>
                  <li>Test wallet connection/disconnection</li>
                  <li>Test all trading box interactions</li>
                  <li>Verify mobile responsiveness</li>
                </ul>
              </div>
            </div>

            {/* Mobile Bottom Sheet */}
            <div className="fixed inset-x-0 bottom-0 z-50">
              <TradingBoxPrimitive
                isMobileSheet
                isSheetOpen={isMobileSheetOpen}
                onToggleSheet={() => setIsMobileSheetOpen(o => !o)}
                isWalletConnected={isWalletConnected}
                onConnectWallet={() => setIsWalletConnected(true)}
                onDisconnect={() => setIsWalletConnected(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

