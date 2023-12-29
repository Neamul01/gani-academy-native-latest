import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { addDoc } from "firebase/firestore";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import useAdminUID from "../../hooks/useAdminUID";

type RouterProps = {
  params: {
    groupsCollectionRef: any;
  };
};

const CreateGroup = () => {
  const [groupName, setGroupName] = useState<string>("");
  const router = useRoute<RouteProp<RouterProps>>();
  const groupsCollectionRef = router.params?.groupsCollectionRef;
  const { user } = useAuth();
  const navigation = useNavigation();
  const { adminUIDs } = useAdminUID();

  const startGroup = async () => {
    console.log("adminUIDs", adminUIDs);
    if (groupName.trim() === "") {
      console.log("Please enter a group name");
      return;
    }

    try {
      await addDoc(groupsCollectionRef, {
        name: groupName,
        description: `Group #${Math.floor(Math.random() * 1000)}`,
        creator: user.uid,
        members: [user.uid, ...adminUIDs],
      });
      navigation.goBack();
    } catch (error) {
      console.log("error creating group", error);
    }
  };
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 20,
      }}
    >
      <View style={{}}>
        <View>
          <Text style={styles.title}>Group name:</Text>
          <TextInput onChangeText={setGroupName} style={styles.textInput} />
        </View>
      </View>
      <TouchableOpacity
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 6,
          marginTop: 10,
          backgroundColor: "gray",
          width: "80%",
          marginHorizontal: "auto",
          borderRadius: 10,
        }}
        onPress={startGroup}
      >
        <Text
          style={{
            color: "white",
            fontSize: 15,
          }}
        >
          Start Chat
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateGroup;

const styles = StyleSheet.create({
  title: {
    fontSize: 15,
    paddingBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    width: 290,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderColor: "gray",
  },
});

// ------------rules

// service cloud.firestore {
//     match /databases/{database}/documents {

//       // This rule allows anyone with your Firestore database reference to view, edit,
//       // and delete all data in your Firestore database. It is useful for getting
//       // started, but it is configured to expire after 30 days because it
//       // leaves your app open to attackers. At that time, all client
//       // requests to your Firestore database will be denied.
//       //
//       // Make sure to write security rules for your app before that time, or else
//       // all client requests to your Firestore database will be denied until you Update
//       // your rules
//       match /{document=**} {
//         allow read, write: if request.time < timestamp.date(2024, 1, 24);
//       }
//     }
//   }
