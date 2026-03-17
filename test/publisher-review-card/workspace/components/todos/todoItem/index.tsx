"use client";

import type { ComponentProps } from "react";
import LegacyTodoItem from "../../TodoItem";

export interface TodoItemProps extends ComponentProps<typeof LegacyTodoItem> {}

const TodoItem = (props: TodoItemProps) => <LegacyTodoItem {...props} />;

export default TodoItem;
