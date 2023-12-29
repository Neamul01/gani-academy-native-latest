import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import Chat from "../screens/Chat";
import DynamicChatScreen from "../screens/DynamicChatScreen";
import CreateGroup from "../screens/Chat/CreateGroup";

const Stack = createStackNavigator();

export default function ChatStack() {
  return (
    <Stack.Navigator initialRouteName={"Home"}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Group" component={DynamicChatScreen} />
      <Stack.Screen
        name="CreateGroup"
        component={CreateGroup}
        options={{
          title: "Create Group",
        }}
      />
    </Stack.Navigator>
  );
}
