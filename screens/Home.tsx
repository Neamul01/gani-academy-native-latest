import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import colors from "../colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  DocumentData,
  addDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { database } from "../config/firebase";

const Home = () => {
  const navigation = useNavigation<any>();
  const [groupsCollectionRef, setGroupsCollectionRef] = useState<any>(null);
  const [groups, setGroups] = useState<any>([]);
  const { user, logOut: logOut } = useAuth();

  useEffect(() => {
    const ref = collection(database, "groups");
    setGroupsCollectionRef(ref);

    const unsubscribe = onSnapshot(ref, (groups: DocumentData) => {
      // console.log("Current groups in database: ", groups);
      const groupsData = groups.docs.map((doc: any) => {
        return { id: doc.id, ...doc.data() };
      });

      setGroups(groupsData);
    });

    return unsubscribe;
  }, []);

  const startGroup = async () => {
    try {
      await addDoc(groupsCollectionRef, {
        name: `Group #${Math.floor(Math.random() * 1000)}`,
        description: "This is a chat group",
        creator: user.uid,
      });
    } catch (error) {
      console.log("error creating group", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut(); // Call signOut from context
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

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
        <TouchableOpacity onPress={handleSignOut}>
          <MaterialCommunityIcons
            name="logout"
            style={{
              fontSize: 25,
              marginRight: 15,
            }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ScrollView>
        {groups.map((group: any) => (
          <TouchableOpacity
            key={group.id}
            onPress={() => navigation.navigate("Group", { id: group.id })}
            style={styles.groupCard}
          >
            <Text>{group.name}</Text>
            <Text>{group.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View>
        <Pressable style={styles.fab} onPress={startGroup}>
          <Ionicons name="add" size={24} color="white" />
        </Pressable>
      </View>
      {/* <TouchableOpacity
        onPress={() => navigation.navigate("Chat")}
        style={styles.chatButton}
      >
        <Entypo name="chat" size={24} color={colors.lightGray} />
      </TouchableOpacity> */}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    position: "absolute",
    right: 20,
    bottom: 20,
  },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 80,
    backgroundColor: "#03A9F4",
    borderRadius: 30,
    elevation: 8,
  },
  groupCard: {
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    elevation: 4,
  },
});
