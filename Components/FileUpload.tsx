import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import {
  DocumentData,
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { database, storageDatabase } from "../config/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { MediaTypeOptions, launchImageLibraryAsync } from "expo-image-picker";
import { useAuth } from "../context/AuthContext";

type FileUploadProps = {
  setMessage: Dispatch<SetStateAction<string>>;
  Id: string;
  setImage: Dispatch<SetStateAction<string>>;
  setProgress: Dispatch<SetStateAction<number>>;
};

const FileUpload = ({
  setMessage,
  Id,
  setImage,
  setProgress,
}: FileUploadProps) => {
  const [files, setFiles] = useState<DocumentData[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(database, `groups/${Id}/messages`),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            // console.log("New file", change.doc.data());
            setFiles((prevFiles) => [...prevFiles, change.doc.data()]);
          }
        });
      }
    );
    return () => unsubscribe();
  }, []);
  async function pickImage() {
    let result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      await uploadImage(result.assets[0].uri, "image");
    }
  }

  async function uploadImage(uri: string, fileType: string) {
    const response = await fetch(uri);
    if (!response) return;

    const blob = await response.blob();
    if (!blob) return;

    const storageRef = ref(storageDatabase, "Stuff/" + new Date().getTime());
    const uploadTask = uploadBytesResumable(storageRef, blob);

    // listen for events
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setProgress(Number(progress.toFixed()));
      },
      (error) => {
        // handle error
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log("File available at", downloadURL);
          // save record
          await saveRecord(fileType, downloadURL, new Date().toISOString());
          setImage("");
        });
      }
    );
  }

  async function saveRecord(fileType: string, url: string, createdAt: string) {
    try {
      const docRef = await addDoc(
        collection(database, `groups/${Id}/messages`),
        {
          fileType,
          url,
          sender: user.uid,
          createdAt: serverTimestamp(),
        }
      );
      console.log("document saved correctly", docRef.id);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <TouchableOpacity onPress={pickImage}>
        <FontAwesome name="photo" size={24} color="black" />
      </TouchableOpacity>
    </>
  );
};

export default FileUpload;

const styles = StyleSheet.create({});
