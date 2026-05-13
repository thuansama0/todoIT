import { FC } from "react"
import { observer } from "mobx-react-lite"
import type { AppStackScreenProps } from "app/navigators"
import { TodoFormScreen } from "../TodoFormScreen/TodoFormScreen"

interface NewTodoScreenProps extends AppStackScreenProps<"NewTodo"> {}

export const NewTodoScreen: FC<NewTodoScreenProps> = observer(function NewTodoScreen({
  navigation,
}) {
  return <TodoFormScreen mode="create" navigation={navigation} />
})
