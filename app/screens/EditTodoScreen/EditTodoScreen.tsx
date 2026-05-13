import { FC } from "react"
import { observer } from "mobx-react-lite"
import type { AppStackScreenProps } from "app/navigators"
import { TodoFormScreen } from "../TodoFormScreen/TodoFormScreen"

export const EditTodoScreen: FC<AppStackScreenProps<"EditTodo">> = observer(
  function EditTodoScreen({ route, navigation }) {
    return (
      <TodoFormScreen mode="edit" navigation={navigation} initialTodo={route.params.todoData} />
    )
  },
)
