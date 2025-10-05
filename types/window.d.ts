// Window interface extensions for Base SDK
declare global {
  interface Window {
    BaseSDK?: {
      ready: () => Promise<void> | void;
    };
    FarcasterSDK?: {
      actions: {
        ready: () => Promise<void> | void;
      };
    };
    sdk?: {
      actions: {
        ready: () => Promise<void> | void;
        share?: (data: any) => Promise<void> | void;
        close?: () => void;
        openUrl?: (url: string) => void;
      };
    };
    OnchainKit?: {
      ready: () => Promise<void> | void;
    };
  }
}

export {};