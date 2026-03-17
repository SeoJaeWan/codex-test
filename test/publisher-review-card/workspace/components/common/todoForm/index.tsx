"use client";

import type { ComponentProps } from "react";
import LegacyTodoForm from "../../TodoForm";

export interface TodoFormProps extends ComponentProps<typeof LegacyTodoForm> {}

const TodoForm = (props: TodoFormProps) => <LegacyTodoForm {...props} />;

export default TodoForm;
