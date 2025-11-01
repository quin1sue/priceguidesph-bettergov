'use client';

import { Footer } from '@/components/custom/global/footer';
import { useInstallPrompt } from '@/components/custom/global/installationPWA';
import { Nav } from '@/components/custom/global/nav';
import { Share, Smartphone } from 'lucide-react';

export default function InstallPage() {
  const { isStandalone, isIOS, deferredPrompt, promptInstall } = useInstallPrompt();

  // Already installed
  if (isStandalone) {
    return (
        <>
        <Nav />
      <main className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6 bg-gray-50">
        <Smartphone size={48} className="text-blue-500 mb-4" />
        <h1 className="text-2xl font-bold">App Already Installed &#10003;</h1>
        <p className="mt-4 text-gray-600">
          You can open the app directly from your home screen.
        </p>
      </main>
      <Footer />
      </>
    );
  }

  return (
    <>
    <Nav />
    <main className="flex flex-col items-center justify-center min-h-[70vh] mt-[2em] text-center px-6 bg-gray-50">
      <Smartphone size={48} className="text-blue-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Install PriceGuides App</h1>
      <p className="text-gray-600 mb-6 max-w-md">
        Install this app on your device for faster load times and a native app experience.
      </p>

      {/* Android / Chrome */}
      {deferredPrompt && (
        <button
          onClick={promptInstall}
          className="w-full max-w-xs bg-blue-500 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-sm mb-6"
        >
          Add to Home Screen
        </button>
      )}

      {/* iOS Instructions */}
      {isIOS && (
        <div className="text-left max-w-sm p-4 rounded-lg shadow-md">
          <p className="mb-2">
            1. Tap the share button{' '}
            <Share className="inline-block align-middle mx-1" size={16} /> in Safari.
          </p>
          <p className="mb-2">
            2. Select <strong>&#8220;Add to Home Screen&#8221;</strong>.
          </p>
          <p>3. Enjoy the app like a native app!</p>
        </div>
      )}
    </main>
    <Footer />
    </>
  );
}
