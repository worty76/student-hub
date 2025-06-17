'use client';

import React from 'react';

interface ConnectionStatusProps {
  isRealTime: boolean;
  isPolling: boolean;
}

export default function ConnectionStatus({ isRealTime, isPolling }: ConnectionStatusProps) {
  if (isRealTime) {
    return (
      <div></div>
    );
  }

  if (isPolling) {
    return (
      <div></div>
    );
  }

  return (
    <div></div>
  );
} 