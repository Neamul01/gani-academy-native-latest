import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import {
  DocumentData,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { database } from "../config/firebase";

const useAdminUID = () => {
  const [adminUIDs, setAdminUIDs] = useState<string[]>([]);

  useEffect(() => {
    // const ref = collection(database, "users");
    const ref = query(
      collection(database, "users"),
      where("role", "==", "admin")
    );

    const unsubscribe = onSnapshot(ref, (users: DocumentData) => {
      // console.log("Current users in database: ", groups);
      const usersData = users.docs.map((doc: any) => {
        return doc.id;
      });

      setAdminUIDs(usersData);
    });

    return unsubscribe;
  }, []);
  return { adminUIDs };
};

export default useAdminUID;
