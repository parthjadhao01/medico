import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const Index = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* App Logo */}
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/2966/2966488.png", // replace with your logo if needed
        }}
        style={styles.logo}
      />

      {/* App Name */}
      <Text style={styles.appName}>Midicle</Text>
      <Text style={styles.subtitle}>Your Doctor Appointment Companion</Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/(auth)/signIn")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => router.push("/(auth)/signUp")}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7faff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1e90ff",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 40,
  },
  buttonContainer: {
    width: "100%",
  },
  loginButton: {
    backgroundColor: "#1e90ff",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  signupButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
