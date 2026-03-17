"use client";

import type { ComponentProps } from "react";
import LegacyEmptyState from "../../EmptyState";

export interface EmptyStateProps extends ComponentProps<typeof LegacyEmptyState> {}

const EmptyState = (props: EmptyStateProps) => <LegacyEmptyState {...props} />;

export default EmptyState;
