"use client";

import { useState } from "react";

export interface CookieBannerProps {}

const CookieBanner = (_props: CookieBannerProps) => {
  const [visible, setVisible] = useState(
    () => typeof window !== "undefined" && !localStorage.getItem("cookie-consent")
  );

  if (!visible) return null;

  const accept = () => {
    localStorage.setItem("cookie-consent", "true");
    setVisible(false);
  };

  return (
    <div
      data-testid="cookie-banner"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/30"
    >
      <div className="w-full border-t bg-white p-4 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            ???ë±€ê¶—?ëŒ„ë“ƒ??è‘ì¢ê¶Žç‘œ??ÑŠìŠœ?â‘¸ë•²?? æ€¨ê¾©ëƒ½ ?ëŒìŠœ?ì„ë–†?ã…»ãˆƒ ?ìˆˆì“½?ëŒï¼œ?ëª„ìŠ‚.
          </p>
          <button
            onClick={accept}
            data-testid="cookie-accept"
            className="shrink-0 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            ?ìˆˆì“½
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
