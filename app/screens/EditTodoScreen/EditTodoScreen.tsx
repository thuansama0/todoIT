import { FC } from "react"
import { observer } from "mobx-react-lite"
import type { AppStackScreenProps } from "app/navigators"
import { TodoFormScreen } from "../TodoFormScreen/TodoFormScreen"

export const EditTodoScreen: FC<AppStackScreenProps<"EditTodo">> = observer(
  function EditTodoScreen({ route }) {
    return <TodoFormScreen mode="edit" initialTodo={route.params.todoData} />
  },
)
