"use client";
import { useState, useEffect } from "react";
import { Share, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function useInstallPrompt() {
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const ua = navigator.userAgent;

    // Detect iOS devices
   setIsIOS(/iPad|iPhone|iPod/.test(ua) && !('MSStream' in window));

    // Detect if app is running in standalone mode
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

    // Listen for Android/Chrome install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault(); // Prevent auto mini-banner
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  // Show install banner **only if not installed**
  const showBanner = !isStandalone && (isIOS || deferredPrompt);

  return { isStandalone, isIOS, deferredPrompt, promptInstall, showBanner };
}



export function InstallPrompt() {   
  const { isStandalone, isIOS, deferredPrompt, promptInstall } = useInstallPrompt();

  if (isStandalone) return null; // already installed
  if (!isIOS && !deferredPrompt) return null; // not installable

  return (
    <main className="pb-safe fixed w-full h-[8em] bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
      <article className="max-w-md mx-auto px-4 py-4 sm:py-5">
        <section className="flex flex-col items-center space-y-4">
          <header className="flex items-center gap-2">
            <Smartphone size={20} className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800 tracking-tight">Install App</h3>
          </header>

          {/* Android/Chrome */}
          {deferredPrompt && (
            <button
              onClick={promptInstall}
              className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-sm"
            >
              Add to Home Screen
            </button>
          )}

          {/* iOS */}
          {isIOS && (
            <div className="flex flex-col items-center space-y-2">
              <p className="text-sm text-gray-600 text-center px-2 leading-relaxed">
                    To install this app, tap the share button
                <span role="img" aria-label="share icon" className="mx-1 inline-block align-middle">
                  <Share size={16} className="inline" />
                </span>
                and then select <span className="font-semibold">&#8220;Add to Home Screen&#8220;</span>
              </p>
            </div>
          )}
        </section>
      </article>
    </main>
  );
}
