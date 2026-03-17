"use client";

import type { ComponentProps } from "react";
import LegacyDatePicker from "../../DatePicker";

export interface DatePickerProps extends ComponentProps<typeof LegacyDatePicker> {}

const DatePicker = (props: DatePickerProps) => <LegacyDatePicker {...props} />;

export default DatePicker;
