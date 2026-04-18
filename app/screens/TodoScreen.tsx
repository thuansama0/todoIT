import { FC } from "react"
import { FlatList, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Header, Screen, TodoItem } from "app/components"
import { colors } from "app/theme"
import { AppStackParamList } from "../navigators"
import { observer } from "mobx-react-lite"
import { Feather } from "@expo/vector-icons"
import { CompositeScreenProps } from "@react-navigation/native"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { TabParamList } from "../navigators/TabNavigator"
const MOCK_TODOS = [
  { id: '1', title: 'Finalize Q3 project report', notes: 'Need to include latest sales data and update the executive summary.', timeText: '2d overdue', category: 'Work', isCompleted: true },
  { id: '2', title: 'Review pull requests', notes: 'Please review the changes and provide feedback.', timeText: 'Tomorrow', category: 'Work', isCompleted: false },
  { id: '3', title: 'làm công viẹc hôm nay', notes: 'làm giao diện cho các trang.', timeText: 'Apr 18', category: 'Work', isCompleted: true },
  { id: '4', title: 'Buy groceries', notes: 'Make a list of items needed for the week.', timeText: 'Tomorrow', category: 'Shopping', isCompleted: false },
  { id: '5', title: 'Finalize Q3 project report', notes: 'Need to include latest sales data and update the executive summary.', timeText: '2d overdue', category: 'Work', isCompleted: true },
  { id: '6', title: 'Update project timeline', notes: 'Please review the changes and provide feedback.', timeText: 'Tomorrow', category: 'Work', isCompleted: false },
  { id: '7', title: 'làm công viẹc hôm nay', notes: 'làm giao diện cho các trang.', timeText: 'Apr 18', category: 'Work', isCompleted: true },
  { id: '8', title: 'Buy groceries', notes: 'Make a list of items needed for the week.', timeText: 'Tomorrow', category: 'Shopping', isCompleted: false },
];

type TodoScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "Todo">,
  NativeStackScreenProps<AppStackParamList>
>

export const TodoScreen: FC<TodoScreenProps> = observer(function TodoScreen({ navigation }) {
    return (
        <Screen
          preset="fixed"
          safeAreaEdges={["top"]}
          style={{ flex: 1 }}
          contentContainerStyle={$screenInner}
        >
      <Header
        title="My Todos"
          titleContainerStyle={$nametodo} 
          titleStyle={$nametodo1}
          style={$nametodo2}  
          RightActionComponent={ 
            <Feather 
              style={$icon}
              name="refresh-cw" 
              color="blue"
              onPress={() => console.log("Đã bấm nút Refresh Todo!")}
          />
        }
      />
      
      {/* Nội dung danh sách Todo của bạn ở dưới này */}
      <FlatList
          style={$list}
          data={MOCK_TODOS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={$todoItemContainer}>
              <TodoItem 
                title={item.title}
                notes={item.notes}
                timeText={item.timeText}
                category={item.category}
                isCompleted={item.isCompleted}
              />
            </View>
          )}
          contentContainerStyle={$flatListContent} 
        />
        
        {/* Nút cộng nổi */}
        <TouchableOpacity 
            style={$fab} 
            onPress={() => navigation.navigate("NewTodo")} 
          >
            <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>
        
      </Screen>
      
    )
})

const $screenInner: ViewStyle = {
  flex: 1,
}

const $list: ViewStyle = {
  flex: 1,
}

 const $nametodo: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",

}
const $nametodo1: TextStyle = {
  fontSize: 20,
  fontWeight: "bold",
  color: colors.text,
  height : "100%",
}   
const $nametodo2: ViewStyle = { 
    minHeight: 30,
 
  backgroundColor: colors.palette.neutral200, 
  borderBottomWidth: 1, 
  borderColor: colors.palette.neutral200,
}

const $icon: TextStyle = {
    fontSize: 24,
    color: "blue",
    marginRight: 16,
     height: "100%" 
}
const $todoItemContainer: ViewStyle = {
  paddingHorizontal: 16,
   marginBottom: 0,
   paddingTop: 0,
  }
  const $flatListContent: ViewStyle = {
  paddingBottom: 100,
}

// 6. STYLE QUYẾT ĐỊNH VIỆC CỐ ĐỊNH VỊ TRÍ
const $fab: ViewStyle = {
  position: "absolute", 
  bottom: 40, 
  right: 24, 
  width: 60,
  height: 60,
  borderRadius: 30, 
  backgroundColor: '#3b5998', 
  alignItems: "center",
  justifyContent: "center",
  elevation: 8,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 6,
  zIndex: 10,
}