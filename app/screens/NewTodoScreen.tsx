import { FC, useState } from "react"
import { View, Text, ViewStyle, TextStyle, Switch, TouchableOpacity, ScrollView, TextInput } from "react-native"
import { AppStackScreenProps } from "../navigators" // Giả định navigator file của bạn
import { Screen, Header, TextField, Button } from "app/components" // Dùng components của Ignite
import { colors } from "app/theme"
import { Feather, Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native";

interface NewTodoScreenProps extends AppStackScreenProps<"NewTodo"> {}

export const NewTodoScreen: FC<NewTodoScreenProps> = ({}) => {
  const navigation = useNavigation()

  // Các State quản lý form
  const [title, setTitle] = useState("")
  const [notes, setNotes] = useState("")
  const [isDueDateSet, setIsDueDateSet] = useState(false)
  
  // Tạm thời fix cứng category đang chọn
  const [selectedCategory, setSelectedCategory] = useState("game")

  return (
    // Dùng preset="fixed" để Header cố định, ScrollView chỉ lăn phần form
    <Screen preset="fixed" safeAreaEdges={["top"]} style={$screenContainer}>
      
      {/* 1. Header (Có nút X để đóng) */}
      <Header
        title="New Todo"
        titleContainerStyle={$headerTitleContainer} 
        titleStyle={$headerTitle}
        style={$headerContainer}  
        // Nút bên trái là nút X (để quay lại/đóng)
        LeftActionComponent={ 
          <Feather
            style={$closeIcon}
            name="x" 
            onPress={() => navigation.goBack()} 
          />
        }
      />

      {/* 2. Phần nội dung Form (dùng ScrollView) */}
      <ScrollView 
        style={$formContainer} 
        contentContainerStyle={$formContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={$label}>Title *</Text>
        <TextInput 
          style={$input} 
          placeholder="What needs to be done?" 
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#bdbdbd"
        />

        {/* Notes */}
        <Text style={$label}>Notes (optional)</Text>
        <TextInput 
          style={[$input, $notesInput]} 
          placeholder="Add any details..." 
          multiline // Cho phép nhập nhiều dòng
          value={notes}
          onChangeText={setNotes}
          placeholderTextColor="#bdbdbd"
          textAlignVertical="top" // Chữ bắt đầu từ đỉnh ô trên iOS
        />

        {/* Toggle Due date */}
        <View style={$dueDateRow}>
          <Text style={$dueDateLabel}>Set due date</Text>
          <Switch 
            value={isDueDateSet} 
            onValueChange={setIsDueDateSet} 
            trackColor={{ false: "#e0e0e0", true: "#bbdefb" }}
            thumbColor={isDueDateSet ? "#3b5998" : "#f5f5f5"}
          />
        </View>

        {/* Category (Tạm thời làm giả nút bấm dropdown) */}
        <Text style={$label}>Category</Text>
        <TouchableOpacity style={$dropdownButton}>
          <Text style={$dropdownText}>{selectedCategory}</Text>
          <Feather name="chevron-down" size={18} color="#757575" />
        </TouchableOpacity>

        {/* Image Picker Area (Nét đứt) */}
        <Text style={$label}>Image</Text>
        <TouchableOpacity style={$imagePickerWrapper}>
          {/* Phần này bạn có thể xài expo-image-picker sau này */}
          <Ionicons name="checkmark-circle-outline" size={24} color="#4CAF50" />
          <Text style={$imagePickerText}>Image selected (tap to change)</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 3. Footer Button (Nút Create Todo cố định bám đáy) */}
      <View style={$footerContainer}>
        <Button 
          text="Create Todo" 
          style={$submitButton} 
          textStyle={$submitButtonText}
          onPress={() => console.log("Gửi API tạo mới:", { title, notes, selectedCategory })} 
        />
      </View>
    </Screen>
  )
}

// ==========================================
// THÀNH PHẦN STYLES (ĐÃ TÁCH BIỆT RÕ RÀNG)
// ==========================================

// --- Style cho Container ---
const $screenContainer: ViewStyle = {
  flex: 1,
  backgroundColor: '#f8f9fc', // Nền hơi xám nhạt để ô input trắng nổi bật
};

// --- Style cho Header ---
const $headerContainer: ViewStyle = {
  minHeight: 30, 
  backgroundColor: '#ffffff', // Header màu trắng
  borderBottomWidth: 1, 
  borderColor: '#eeeeee',
}
const $headerTitleContainer: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
}
const $headerTitle: TextStyle = {
  fontSize: 18,
  fontWeight: "bold",
  color: colors.text,
  height : "100%",
}   
const $closeIcon: TextStyle = {
    fontSize: 24,
    color: "#000000",
    marginLeft: 16, // Khoảng cách bên trái cho icon
}

// --- Style cho Form Container ---
const $formContainer: ViewStyle = {
  flex: 1, // Chiếm khoảng trống còn lại giữa header và footer
};
const $formContent: ViewStyle = {
  padding: 16, 
  paddingBottom: 24, // Chừa khoảng trống dưới cùng
};

// --- Style cho các Element trong Form ---
const $label: TextStyle = {
  fontSize: 14,
  fontWeight: "600",
  color: "#424242",
  marginBottom: 8,
  marginTop: 16, // Khoảng cách với ô input phía trên
};

const $input: TextStyle = {
  backgroundColor: '#ffffff',
  borderWidth: 1,
  borderColor: '#e0e0e0',
  borderRadius: 8,
  paddingHorizontal: 16,
  paddingVertical: 12,
  fontSize: 16,
  color: colors.text,
};

const $notesInput: ViewStyle = {
  height: 120, // Tăng chiều cao cho ô ghi chú
  minHeight: 120,
};

const $dueDateRow: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 24, // Khoảng cách lớn so với notes input
  marginBottom: 8,
};
const $dueDateLabel: TextStyle = {
  fontSize: 14,
  fontWeight: "600",
  color: "#424242",
};

const $dropdownButton: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#ffffff',
  borderWidth: 1,
  borderColor: '#e0e0e0',
  borderRadius: 8,
  padding: 16,
};
const $dropdownText: TextStyle = {
  fontSize: 16,
  color: colors.text,
  textTransform: 'capitalize', // Viết hoa chữ cái đầu (game -> Game)
};

const $imagePickerWrapper: ViewStyle = {
  backgroundColor: '#ffffff',
  borderWidth: 1,
  borderColor: '#bdbdbd',
  borderStyle: 'dashed', // Nét đứt y như hình
  borderRadius: 8,
  padding: 24,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center', // Căn giữa mọi thứ
};
const $imagePickerText: TextStyle = {
  marginLeft: 10,
  fontSize: 14,
  color: "#616161",
};

// --- Style cho Footer (Nút Submit) ---
const $footerContainer: ViewStyle = {
  padding: 16,
  paddingBottom: 24, // Khoảng cách đáy an toàn
  backgroundColor: '#f8f9fc',
  borderTopWidth: 1, // Đường kẻ mờ phân tách footer
  borderColor: '#eeeeee',
};
const $submitButton: ViewStyle = {
  backgroundColor: '#3b5998',
  paddingVertical: 16,
  borderRadius: 12,
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 56, // Đảm bảo đủ độ cao cho nút to
};
const $submitButtonText: TextStyle = {
  color: '#ffffff',
  fontSize: 16,
  fontWeight: 'bold',
};