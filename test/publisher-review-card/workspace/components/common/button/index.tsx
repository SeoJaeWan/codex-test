"use client";

import type { ComponentProps } from "react";
import LegacyButton from "../../Button";

export interface ButtonProps extends ComponentProps<typeof LegacyButton> {}

const Button = (props: ButtonProps) => <LegacyButton {...props} />;

export default Button;
