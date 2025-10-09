import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextStyle,
  ViewStyle,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

interface Appointment {
  _id: string;
  patientName: string;
  date: string;
  slotTime: string;
  status: string;
}

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [doctorId, setDoctorId] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("doctorToken");
      if (!token) throw new Error("No token found");

      // Fetch doctor profile
      const profileRes = await fetch("http://localhost:3001/api/doctor/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profileData = await profileRes.json();

      if (!profileData?.doctor?._id) throw new Error("Doctor info not found");
      const id = profileData.doctor._id;
      setDoctorId(id);

      // Fetch appointments for doctor
      const appointmentRes = await fetch(
        `http://localhost:3001/api/appointments/doctor/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const appointmentData = await appointmentRes.json();

      setAppointments(appointmentData || []);
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appointmentId: string, status: "Approved" | "Rejected") => {
    try {
      const token = await AsyncStorage.getItem("doctorToken");
      if (!token) throw new Error("No token found");

      const res = await fetch(`http://localhost:3001/api/appointments/${appointmentId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update appointment");

      Alert.alert("Success", `Appointment ${status.toLowerCase()} successfully`);
      fetchAppointments();
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Something went wrong");
    }
  };

  const getStatusStyle = (status: string): TextStyle => ({
    color:
      status === "Pending"
        ? "#ff9800"
        : status === "Approved"
        ? "#4caf50"
        : status === "Rejected"
        ? "#f44336"
        : "#555",
    fontWeight: "600",
    marginBottom: 5,
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#1e90ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Your Appointments</Text>

      {appointments.length === 0 ? (
        <Text style={styles.emptyText}>No appointments yet.</Text>
      ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.infoText}>Patient: {item.patientName}</Text>
              <Text style={styles.infoText}>
                Date: {item.date} | Time: {item.slotTime}
              </Text>
              <Text style={getStatusStyle(item.status)}>Status: {item.status}</Text>

              {item.status === "Pending" && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.btn, { backgroundColor: "#4caf50" }]}
                    onPress={() => updateStatus(item._id, "Approved")}
                  >
                    <Text style={styles.btnText}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btn, { backgroundColor: "#f44336" }]}
                    onPress={() => updateStatus(item._id, "Rejected")}
                  >
                    <Text style={styles.btnText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create<{
  container: ViewStyle;
  header: TextStyle;
  card: ViewStyle;
  infoText: TextStyle;
  buttonContainer: ViewStyle;
  btn: ViewStyle;
  btnText: TextStyle;
  emptyText: TextStyle;
}>({
  container: { flex: 1, backgroundColor: "#f7faff" },
  header: { fontSize: 22, fontWeight: "700", color: "#1e90ff", marginLeft: 20, marginTop: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  infoText: { color: "#555", marginBottom: 5 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  btn: { flex: 1, padding: 10, borderRadius: 8, marginHorizontal: 5, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "600" },
  emptyText: { textAlign: "center", marginTop: 50, color: "#555", fontSize: 16 },
});
