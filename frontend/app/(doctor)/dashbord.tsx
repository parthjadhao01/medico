import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DoctorDashboard() {
  // Dummy counts
  const totalAppointments = 5;
  const completedAppointments = 1;
  const cancelledAppointments = 2;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Doctor Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Appointments</Text>
        <Text style={styles.count}>{totalAppointments}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Completed Appointments</Text>
        <Text style={styles.count}>{completedAppointments}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Cancelled Appointments</Text>
        <Text style={styles.count}>{cancelledAppointments}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create<{
  container: ViewStyle;
  header: TextStyle;
  card: ViewStyle;
  cardTitle: TextStyle;
  count: TextStyle;
}>({
  container: { flex: 1, backgroundColor: "#f7faff", padding: 20 },
  header: { fontSize: 24, fontWeight: "700", color: "#1e90ff", marginBottom: 20 },
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
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10, color: "#555" },
  count: { fontSize: 28, fontWeight: "700", color: "#1e90ff" },
});
