import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextStyle,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Dummy profile API response
const profileData = [
  {
    _id: "68e6bd5bbd743cce1e5bf7a7",
    email: "Parth96@gmail.com",
    name: "Parth",
    age: 24,
  },
];

// Dummy appointments API response
const appointmentsData = [
  {
    _id: "68e6d9efbe6f425d271f07e7",
    doctorId: {
      _id: "68e68f93bddbfff2340aa875",
      consultationFee: 423,
      name: "John Doe",
      specialization: "dentist",
    },
    patientId: "68e6bd5bbd743cce1e5bf7a7",
    patientName: "Parth jadhao",
    date: "2025-10-08",
    slotTime: "10:00",
    status: "Pending",
  },
  {
    _id: "68e6e204be6f425d271f0840",
    doctorId: {
      _id: "68e68f93bddbfff2340aa875",
      consultationFee: 423,
      name: "John Doe",
      specialization: "dentist",
    },
    patientId: "68e6bd5bbd743cce1e5bf7a7",
    patientName: "Parth jadhao",
    date: "2025-10-08",
    slotTime: "11:00",
    status: "Pending",
  },
  {
    _id: "68e6e44f66520c7e46a0f474",
    doctorId: {
      _id: "68e680a1bddbfff2340aa837",
      consultationFee: 4242443,
      name: "Parth Jadhao",
      specialization: "dentist",
    },
    patientId: "68e6bd5bbd743cce1e5bf7a7",
    patientName: "Parth",
    date: "2025-10-08",
    slotTime: "10:00",
    status: "Pending",
  },
  {
    _id: "68e6e78266520c7e46a0f4c4",
    doctorId: {
      _id: "68e64d30d80c9dde8d7f4361",
      consultationFee: 1555,
      name: "Parth Jadhao",
      specialization: "Cardiologist",
    },
    patientId: "68e6bd5bbd743cce1e5bf7a7",
    patientName: "Parth",
    date: "2025-10-08",
    slotTime: "10:00",
    status: "Pending",
  },
];

interface Appointment {
  _id: string;
  doctorId: {
    _id: string;
    name: string;
    specialization: string;
    consultationFee: number;
  };
  patientId: string;
  patientName: string;
  date: string;
  slotTime: string;
  status: string;
}

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    // Simulate fetching from API
    setAppointments(appointmentsData);
  }, []);

  const handleCancel = (appointmentId: string) => {
    Alert.alert("Cancelled", `Appointment ${appointmentId} cancelled successfully!`);
  };

  const handleReschedule = (appointmentId: string) => {
    Alert.alert("Reschedule", `Appointment ${appointmentId} rescheduled successfully!`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Your Appointments</Text>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.infoText}>Doctor: {item.doctorId.name}</Text>
            <Text style={styles.infoText}>Specialization: {item.doctorId.specialization}</Text>
            <Text style={styles.infoText}>
              Date: {item.date} | Time: {item.slotTime}
            </Text>
            <Text style={styles.infoText}>Status: {item.status}</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#2196f3" }]}
                onPress={() => handleReschedule(item._id)}
              >
                <Text style={styles.btnText}>Reschedule</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#f44336" }]}
                onPress={() => handleCancel(item._id)}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
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
});
