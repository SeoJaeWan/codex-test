"use client";

import type { ComponentProps } from "react";
import LegacyNavbar from "../../Navbar";

export interface NavbarProps extends ComponentProps<typeof LegacyNavbar> {}

const Navbar = (props: NavbarProps) => <LegacyNavbar {...props} />;

export default Navbar;
