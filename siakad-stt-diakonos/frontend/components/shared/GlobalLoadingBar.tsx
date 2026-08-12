'use client';

import { useSyncExternalStore } from 'react';
import {
  subscribeLoading,
  getLoadingSnapshot,
  getLoadingServerSnapshot,
} from '@/lib/loadingStore';

export default function GlobalLoadingBar() {
  const isLoading = useSyncExternalStore(
    subscribeLoading,
    getLoadingSnapshot,
    getLoadingServerSnapshot
  );

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-9999 h-1 overflow-hidden bg-blue-100">
      <div className="h-full w-2/5 bg-blue-600 animate-global-loading-bar" />
    </div>
  );
}