import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PatientProfile() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  useEffect(() => {
    fetchPatientProfile();
  }, []);

  const fetchPatientProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("patientToken");
      if (!token) return;

      const res = await fetch("http://localhost:3001/api/patient/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch profile");

      const data = await res.json();
      setName(data[0].name || "");
      setAge(data[0].age?.toString() || "");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Unable to fetch profile");
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("patientToken");
    router.replace("/(auth)/signIn");
  };

  const handleSaveProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("patientToken");
      const res = await fetch("http://localhost:3001/api/patient/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, age: Number(age) }),
      });
      if (!res.ok) throw new Error("Failed to update profile");

      Alert.alert("Success", "Profile updated");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Unable to update profile");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with logo and logout */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
            style={styles.logo}
          />
          <Text style={styles.headerTitle}>Patient Profile</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Personal Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />
        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
          <Text style={styles.saveText}>Save Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7faff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  logo: { width: 40, height: 40, borderRadius: 20 },
  headerTitle: { fontSize: 20, fontWeight: "700", marginLeft: 10, color: "#1e90ff" },
  logoutText: { color: "#ff4d4d", fontWeight: "600", fontSize: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    margin: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: "700", marginBottom: 15, color: "#1e90ff" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    backgroundColor: "#f7faff",
  },
  saveBtn: {
    backgroundColor: "#1e90ff",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: { color: "#fff", fontWeight: "600" },
});
