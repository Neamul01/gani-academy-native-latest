import {
  View,
  FlatList,
  StyleSheet,
  Button,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import {
  DocumentData,
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { database } from "../config/firebase";
import { RouteProp, useRoute } from "@react-navigation/native";
import FileUpload from "../Components/FileUpload";
import { UploadingAndroid } from "../Components/UploadingAndroid";
import { Uploading } from "../Components/Uploading";

type RouterParams = {
  params: {
    id: string;
  };
};

const DynamicChatScreen = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<DocumentData[]>([]);
  const [message, setMessage] = useState<string>("");
  const router = useRoute<RouteProp<RouterParams>>();
  const Id = router.params.id;

  const [image, setImage] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [files, setFiles] = useState<DocumentData[]>([]);

  useLayoutEffect(() => {
    const msgCollectionRef = collection(database, `groups/${Id}/messages`);
    const q = query(msgCollectionRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (groups: DocumentData) => {
      const messages = groups.docs.map((doc: any) => {
        return { id: doc.id, ...doc.data() };
      });
      setMessages(messages);
    });

    return unsubscribe;
  }, []);

  const sendMessage = async () => {
    const msg = message.trim();
    if (msg.length === 0) return;

    const msgCollectionRef = collection(
      database,
      `groups/${router.params?.id}/messages`
    );

    await addDoc(msgCollectionRef, {
      message: msg,
      sender: user.uid,
      createdAt: serverTimestamp(),
    });

    setMessage("");
  };

  const renderMessage = ({ item }: { item: DocumentData }) => {
    const myMessage = item.sender === user.uid;
    console.log("item", item);

    const renderTextMessage = () => (
      <Text style={styles.messageText}>{item.message}</Text>
    );
    const renderImageMessage = () => (
      <Image source={{ uri: item.url }} style={styles.messageImage} />
    );

    return (
      <View
        style={[
          styles.messageContainer,
          myMessage
            ? styles.userMessageContainer
            : styles.otherMessageContainer,
        ]}
      >
        {/* <Text style={styles.messageText}>{item.message}</Text> */}
        {item.fileType === "image" ? renderImageMessage() : renderTextMessage()}
        <Text style={styles.time}>
          {item.createdAt?.toDate().toLocaleDateString()}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      {image &&
        (Platform.OS === "ios" ? (
          <Uploading image={image} progress={progress} />
        ) : (
          <UploadingAndroid image={image} progress={progress} />
        ))}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
      />
      <View style={styles.inputContainer}>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <FileUpload
            setImage={setImage}
            setProgress={setProgress}
            setMessage={setMessage}
            Id={Id}
          />
        </View>
        <TextInput
          multiline
          value={message}
          onChangeText={(text) => setMessage(text)}
          placeholder="Type a message"
          style={styles.messageInput}
        />
        <Button disabled={message === ""} title="Send" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    gap: 10,
    backgroundColor: "#fff",
  },
  messageInput: {
    flex: 1,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  messageContainer: {
    padding: 10,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  userMessageContainer: {
    backgroundColor: "#dcf8c6",
    alignSelf: "flex-end",
  },
  otherMessageContainer: {
    backgroundColor: "#fff",
  },
  messageText: {
    fontSize: 16,
  },
  time: {
    fontSize: 12,
    color: "#777",
    alignSelf: "flex-end",
  },
  messageImage: {
    width: 200, // Adjust the size as needed
    height: 200, // Adjust the size as needed
    borderRadius: 10,
  },
});

export default DynamicChatScreen;
