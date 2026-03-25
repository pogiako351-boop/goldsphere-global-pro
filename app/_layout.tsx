import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

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

    // Theme color
    if (!document.querySelector('meta[name="theme-color"]')) {
      const themeColor = document.createElement('meta');
      themeColor.name = 'theme-color';
      themeColor.content = '#000000';
      document.head.appendChild(themeColor);
    }

    // Apple mobile web app meta
    const appleMeta = document.createElement('meta');
    appleMeta.name = 'apple-mobile-web-app-capable';
    appleMeta.content = 'yes';
    document.head.appendChild(appleMeta);

    const appleStatus = document.createElement('meta');
    appleStatus.name = 'apple-mobile-web-app-status-bar-style';
    appleStatus.content = 'black-translucent';
    document.head.appendChild(appleStatus);

    // AdSense placeholder script
    if (!document.querySelector('script[data-ad-client]')) {
      const adsScript = document.createElement('script');
      adsScript.async = true;
      adsScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      adsScript.setAttribute('data-ad-client', 'ca-pub-XXXXXXXXXXXXXXXX');
      adsScript.crossOrigin = 'anonymous';
      document.head.appendChild(adsScript);
    }
  }
}

export default function RootLayout() {
  useEffect(() => {
    registerServiceWorker();
    injectPWAMeta();
  }, []);

  return (
    <>
      <StatusBar style="light" />
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
