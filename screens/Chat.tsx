import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { GiftedChat } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { auth, database } from "../config/firebase";

interface IUser {
  _id: string;
  name: string;
  avatar: string;
}

interface IMessage {
  _id: string;
  text: string;
  createdAt: Date;
  user: IUser;
}

export default function Chat() {
  const [messages, setMessages] = useState<IMessage[]>([]);

  useLayoutEffect(() => {
    const collectionRef = collection(database, "chats");
    const q = query(collectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          _id: doc.id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user as IUser,
        }))
      );
    });

    return () => unsubscribe();
  }, []);

  const onSend = useCallback((messages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );

    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(database, "chats"), {
      _id,
      createdAt,
      text,
      user,
    });
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages as IMessage[])}
      messagesContainerStyle={{
        backgroundColor: "#fff",
      }}
      imageStyle={{
        borderWidth: 1,
      }}
      user={{
        _id: auth.currentUser?.email || "unknown",
        avatar: "https://i.pravatar.cc/300",
      }}
    />
  );
}
