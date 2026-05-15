import { useEffect, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import PWASplashScreen from '@/components/PWASplashScreen';

function registerServiceWorker() {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.log('SW registration failed:', err);
      });
    });
  }
}

function injectPWAMeta() {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    // Manifest link
    if (!document.querySelector('link[rel="manifest"]')) {
      const manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      manifestLink.href = '/manifest.json';
      document.head.appendChild(manifestLink);
    }

    // Theme color - Carbon Black
    if (!document.querySelector('meta[name="theme-color"]')) {
      const themeColor = document.createElement('meta');
      themeColor.name = 'theme-color';
      themeColor.content = '#0B0B0F';
      document.head.appendChild(themeColor);
    }

    // Apple mobile web app meta - full chrome-less experience
    if (!document.querySelector('meta[name="apple-mobile-web-app-capable"]')) {
      const appleMeta = document.createElement('meta');
      appleMeta.name = 'apple-mobile-web-app-capable';
      appleMeta.content = 'yes';
      document.head.appendChild(appleMeta);
    }

    if (!document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')) {
      const appleStatus = document.createElement('meta');
      appleStatus.name = 'apple-mobile-web-app-status-bar-style';
      appleStatus.content = 'black-translucent';
      document.head.appendChild(appleStatus);
    }

    // Apple mobile web app title
    if (!document.querySelector('meta[name="apple-mobile-web-app-title"]')) {
      const appleTitle = document.createElement('meta');
      appleTitle.name = 'apple-mobile-web-app-title';
      appleTitle.content = 'GoldSphere';
      document.head.appendChild(appleTitle);
    }

    // Apple touch icons - high resolution for Retina displays
    if (!document.querySelector('link[rel="apple-touch-icon"]')) {
      const touchIcon180 = document.createElement('link');
      touchIcon180.rel = 'apple-touch-icon';
      touchIcon180.setAttribute('sizes', '180x180');
      touchIcon180.href = '/apple-touch-icon.png';
      document.head.appendChild(touchIcon180);

      const touchIcon152 = document.createElement('link');
      touchIcon152.rel = 'apple-touch-icon';
      touchIcon152.setAttribute('sizes', '152x152');
      touchIcon152.href = '/apple-touch-icon-152x152.png';
      document.head.appendChild(touchIcon152);

      const touchIcon167 = document.createElement('link');
      touchIcon167.rel = 'apple-touch-icon';
      touchIcon167.setAttribute('sizes', '167x167');
      touchIcon167.href = '/apple-touch-icon-167x167.png';
      document.head.appendChild(touchIcon167);
    }

    // Apple splash screen - obsidian background for seamless transition
    if (!document.querySelector('meta[name="apple-mobile-web-app-orientations"]')) {
      const orientMeta = document.createElement('meta');
      orientMeta.name = 'apple-mobile-web-app-orientations';
      orientMeta.content = 'portrait';
      document.head.appendChild(orientMeta);
    }

    // Viewport meta for full-screen PWA on iOS
    const existingViewport = document.querySelector('meta[name="viewport"]');
    if (existingViewport) {
      existingViewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover');
    }

    // iOS Safari status bar color
    if (!document.querySelector('meta[name="msapplication-navbutton-color"]')) {
      const navColor = document.createElement('meta');
      navColor.name = 'msapplication-navbutton-color';
      navColor.content = '#0B0B0F';
      document.head.appendChild(navColor);
    }

    // AdSense script injection
    if (!document.querySelector('script[data-ad-client]')) {
      const adsScript = document.createElement('script');
      adsScript.async = true;
      adsScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7498656720223965';
      adsScript.setAttribute('data-ad-client', 'ca-pub-7498656720223965');
      adsScript.crossOrigin = 'anonymous';
      document.head.appendChild(adsScript);
    }
  }
}

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(() => {
    // Only show splash on web in standalone (PWA) mode
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const isStandalone =
        (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
        (window.navigator as any).standalone === true;
      return isStandalone;
    }
    return false;
  });

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  useEffect(() => {
    registerServiceWorker();
    injectPWAMeta();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      {showSplash && <PWASplashScreen onFinish={handleSplashFinish} />}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#000000' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="alerts"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="history"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="article/[id]"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="ai-insights"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="privacy"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="terms"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="about"
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack>
    </>
  );
}
