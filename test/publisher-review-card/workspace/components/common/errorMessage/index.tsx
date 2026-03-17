"use client";

import type { ComponentProps } from "react";
import LegacyErrorMessage from "../../ErrorMessage";

export interface ErrorMessageProps extends ComponentProps<typeof LegacyErrorMessage> {}

const ErrorMessage = (props: ErrorMessageProps) => (
  <LegacyErrorMessage {...props} />
);

export default ErrorMessage;
