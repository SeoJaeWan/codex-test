"use client";

import type { ComponentProps } from "react";
import LegacySearchFilter from "../../SearchFilter";

export interface SearchFilterProps extends ComponentProps<typeof LegacySearchFilter> {}

const SearchFilter = (props: SearchFilterProps) => (
  <LegacySearchFilter {...props} />
);

export default SearchFilter;
