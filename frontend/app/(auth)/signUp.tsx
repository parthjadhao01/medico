import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUp = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isDoctor, setIsDoctor] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isDoctor
        ? "http://localhost:3001/api/auth/register/doctor"
        : "http://localhost:3001/api/auth/register/patient";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Registration Failed", data || "Unknown error occurred");
        setLoading(false);
        return;
      }

      // Save token based on role
      await AsyncStorage.setItem(
        isDoctor ? "doctorToken" : "patientToken",
        data.token
      );

      Alert.alert("Success", "Registration successful!");

      // Conditional redirect
      if (isDoctor) {
        router.replace("/(doctor)/appointments");
      } else {
        router.replace("/(patient)/home");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join Midicle today</Text>

      {/* Role Selector */}
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[styles.roleButton, isDoctor && styles.activeRoleButton]}
          onPress={() => setIsDoctor(true)}
        >
          <Text style={[styles.roleText, isDoctor && styles.activeRoleText]}>
            I am a Doctor
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleButton, !isDoctor && styles.activeRoleButton]}
          onPress={() => setIsDoctor(false)}
        >
          <Text style={[styles.roleText, !isDoctor && styles.activeRoleText]}>
            I am a Patient
          </Text>
        </TouchableOpacity>
      </View>

      {/* Email & Password */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      {/* SignUp Button */}
      <TouchableOpacity
        style={styles.signupButton}
        onPress={handleSignUp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      {/* Switch to SignIn */}
      <TouchableOpacity onPress={() => router.replace("/(auth)/signIn")}>
        <Text style={styles.switchText}>
          Already have an account?{" "}
          <Text style={styles.linkText}>Login here</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7faff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e90ff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 30,
  },
  roleContainer: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "space-between",
    width: "100%",
  },
  roleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#1e90ff",
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  activeRoleButton: {
    backgroundColor: "#1e90ff",
  },
  roleText: {
    color: "#1e90ff",
    fontWeight: "600",
  },
  activeRoleText: {
    color: "#fff",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  signupButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  switchText: {
    color: "#555",
  },
  linkText: {
    color: "#1e90ff",
    fontWeight: "bold",
  },
});
