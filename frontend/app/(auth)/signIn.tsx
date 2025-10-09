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
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"patient" | "doctor" | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password || !role) {
      Alert.alert("Error", "Please fill all fields and select a role");
      return;
    }

    try {
      setLoading(true);

      const endpoint =
        role === "doctor"
          ? "http://localhost:3001/api/auth/login/doctor"
          : "http://localhost:3001/api/auth/login/patient";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Backend sends 400 with message like "Invalid credentials" or "Email already exists"
        throw new Error(typeof data === "string" ? data : data.message);
      }

      // Save token based on user type
      if (role === "doctor") {
        await AsyncStorage.setItem("doctorToken", data.token);
        router.replace("/(doctor)/appointments");
      } else {
        await AsyncStorage.setItem("patientToken", data.token);
        router.replace("/(patient)/home");
      }

      Alert.alert("Success", data.message || "Login successful!");
    } catch (error: any) {
      console.error("Login error:", error);
      Alert.alert("Login Failed", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Midicle</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Role Selector */}
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              role === "patient" && styles.roleButtonActive,
            ]}
            onPress={() => setRole("patient")}
          >
            <Text
              style={[
                styles.roleText,
                role === "patient" && styles.roleTextActive,
              ]}
            >
              I’m a Patient
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleButton,
              role === "doctor" && styles.roleButtonActive,
            ]}
            onPress={() => setRole("doctor")}
          >
            <Text
              style={[
                styles.roleText,
                role === "doctor" && styles.roleTextActive,
              ]}
            >
              I’m a Doctor
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Go to Sign Up */}
        <TouchableOpacity onPress={() => router.push("/(auth)/signUp")}>
          <Text style={styles.signupText}>
            Don’t have an account?{" "}
            <Text style={{ color: "#1e90ff", fontWeight: "600" }}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7faff",
    justifyContent: "center",
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1e90ff",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 40,
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#1e90ff",
    borderRadius: 10,
    paddingVertical: 12,
    marginHorizontal: 5,
    alignItems: "center",
  },
  roleButtonActive: {
    backgroundColor: "#1e90ff",
  },
  roleText: {
    color: "#1e90ff",
    fontWeight: "600",
  },
  roleTextActive: {
    color: "#fff",
  },
  loginButton: {
    backgroundColor: "#1e90ff",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  signupText: {
    textAlign: "center",
    color: "#555",
  },
});
