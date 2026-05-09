import { getSnapshot, isStateTreeNode } from "mobx-state-tree"

type TodoCategoryPlain = {
  id: string
  name: string
  isPublic: boolean
  isOwner: boolean
} | null

export type TodoPlain = {
  id: string
  title: string
  content: string
  imageUrl: string
  dueDate: number
  isCompleted: boolean
  reminderMinutes: number
  category: TodoCategoryPlain
}

export function toPlainTodo(todo: any): TodoPlain {
  // Uu tien snapshot cua MST de lay plain object an toan, sau do normalize default
  // de tranh undefined khi data den tu optimistic/local hoac backend thieu field.
  const raw = isStateTreeNode(todo) ? getSnapshot(todo) : todo

  return {
    ...raw,
    id: raw.id,
    title: raw.title ?? "",
    content: raw.content ?? "",
    imageUrl: raw.imageUrl ?? "",
    dueDate: raw.dueDate ?? 0,
    isCompleted: !!raw.isCompleted,
    reminderMinutes: raw.reminderMinutes ?? 0,
    category: raw.category
      ? {
          id: raw.category.id,
          name: raw.category.name,
          isPublic: !!raw.category.isPublic,
          isOwner: !!raw.category.isOwner,
        }
      : null,
  }
}
