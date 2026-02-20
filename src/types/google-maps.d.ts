// Type declarations for Google Maps
declare global {
  interface Window {
    google: {
      maps: {
        Size: new (width: number, height: number) => any;
        Point: new (x: number, y: number) => any;
        [key: string]: any;
      };
      [key: string]: any;
    };
  }
}

export {};
