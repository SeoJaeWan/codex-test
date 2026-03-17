"use client";

import type { ComponentProps } from "react";
import LegacyCookieBanner from "../../CookieBanner";

export interface CookieBannerProps extends ComponentProps<typeof LegacyCookieBanner> {}

const CookieBanner = (props: CookieBannerProps) => (
  <LegacyCookieBanner {...props} />
);

export default CookieBanner;
