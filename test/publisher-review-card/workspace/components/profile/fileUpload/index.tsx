"use client";

import type { ComponentProps } from "react";
import LegacyFileUpload from "../../FileUpload";

export interface FileUploadProps extends ComponentProps<typeof LegacyFileUpload> {}

const FileUpload = (props: FileUploadProps) => <LegacyFileUpload {...props} />;

export default FileUpload;
