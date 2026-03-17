"use client";

import type { ComponentProps } from "react";
import LegacyMultiSelect from "../../MultiSelect";

export interface MultiSelectProps extends ComponentProps<typeof LegacyMultiSelect> {}

const MultiSelect = (props: MultiSelectProps) => (
  <LegacyMultiSelect {...props} />
);

export default MultiSelect;
