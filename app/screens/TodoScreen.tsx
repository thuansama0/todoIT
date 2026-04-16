import { FC } from "react"
import { FlatList, TextStyle, View,  ViewStyle } from "react-native"
import { Button, Screen, Text, TextField , Header, Icon } from "app/components"
import { colors, spacing } from "app/theme"
import { AppStackScreenProps } from "../navigators"
import { observer } from "mobx-react-lite"
import { useState } from "react"
import { Feather } from '@expo/vector-icons';

interface TodoScreenProps extends AppStackScreenProps<"Todo"> {}

export const TodoScreen: FC<TodoScreenProps> = observer(function TodoScreen() {
    return (
        <Screen preset="fixed" safeAreaEdges={["top"]}> 
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
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11,12,13,14,15,16,17,18,19,20]} // Dữ liệu giả để test cuộn
        keyExtractor={(item) => String(item)}
        renderItem={({ item }) => (
          <View style={{ padding: 20, borderBottomWidth: 1, borderColor: "#ccc" }}>
            <Text text={`Todo Item ${item}`} />
          </View>
        )}
        // Thêm contentContainerStyle để khi cuộn xuống dưới cùng không bị lẹm vào Bottom Tab
        contentContainerStyle={{ paddingBottom: 100 }} 
      />
      
    </Screen>
      
    )
})
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
    //   height: 7, // Tăng chiều cao của Header để căn giữa tốt hơn
    //   backgroundColor: colors.palette.lighterGrey, 
        //   borderBottomWidth: 1,
    //   borderColor: colors.palette.lighterGrey,
    minHeight: 30, // Đặt chiều cao chuẩn cho Header
 // Căn giữa mọi thứ theo chiều dọc
  backgroundColor: colors.palette.lighterGrey, 
  borderBottomWidth: 1, 
  borderColor: colors.palette.lighterGrey,
}

const $icon: TextStyle = {
    fontSize: 24,
    color: "blue",
    marginRight: 16,
     height: "100%" 
}