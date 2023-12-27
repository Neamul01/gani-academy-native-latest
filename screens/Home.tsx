import React, { useContext, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import colors from "../colors";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { addDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
const catImageUrl =
  "https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=49ed3252c0b2ffb49cf8b508892e452d";

const Home = () => {
  const navigation = useNavigation<any>();
  const [groupsCollectionRef, setGroupsCollectionRef] = useState<any>(null);
  const [groups, setGroups] = useState([]);
  // const { user, setUser } = useContext<any>(AuthenticatedUserContext);
  const { user } = useAuth();

  const startGroup = async () => {
    // try {
    //   await addDoc(groupsCollectionRef, {
    //     name: `Group #${Math.floor(Math.random() * 1000)}`,
    //     description: 'This is a chat group',
    //     creator: user.uid,
    //   });
    // } catch (error) {
    //   console.log('error creating group', error);
    // }
  };

  console.log("user", user);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <FontAwesome
          name="search"
          size={24}
          color={colors.gray}
          style={{ marginLeft: 15 }}
        />
      ),
      headerRight: () => (
        <Image
          source={{ uri: catImageUrl }}
          style={{
            width: 40,
            height: 40,
            marginRight: 15,
          }}
        />
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View>
        <Pressable style={styles.fab} onPress={startGroup}>
          <Ionicons name="add" size={24} color="white" />
        </Pressable>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("Chat")}
        style={styles.chatButton}
      >
        <Entypo name="chat" size={24} color={colors.lightGray} />
      </TouchableOpacity>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    backgroundColor: "#fff",
  },
  chatButton: {
    backgroundColor: colors.primary,
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    marginRight: 20,
    marginBottom: 50,
  },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#03A9F4",
    borderRadius: 30,
    elevation: 8,
  },
});
