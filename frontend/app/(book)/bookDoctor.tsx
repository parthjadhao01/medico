import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";

interface Slot {
  _id: string;
  day: string;
  start: string;
  end: string;
}

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  experience?: number;
  consultationFee?: number;
  availableTimeSlots: Slot[];
}

interface Patient {
  id: string;
  name: string;
}

export default function BookDoctor() {
  const { doctor } = useLocalSearchParams();
  const router = useRouter();
  const doc: Doctor | null = doctor ? JSON.parse(doctor as string) : null;

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]); // today
  const [slots, setSlots] = useState<Slot[]>(doc?.availableTimeSlots || []);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch patient profile
  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("patientToken");
        if (!token) throw new Error("No token found");

        const res = await fetch("http://localhost:3001/api/patient/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch patient profile");

        const data = await res.json();

        if (data && data[0]) {
          setPatient({ id: data[0]._id, name: data[0].name });
        } else {
          throw new Error("Patient info not found");
        }
      } catch (err) {
        console.log("Error fetching patient profile:", err);
        Alert.alert("Error", "Unable to fetch patient info.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientProfile();
  }, []);

  const bookAppointment = async (slot: Slot) => {
    try {
      const token = await AsyncStorage.getItem("patientToken");
      if (!token || !patient) {
        Alert.alert("Error", "Patient info missing.");
        return;
      }

      const res = await fetch("http://localhost:3001/api/appointments", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId: doc?._id,
          patientId: patient.id,
          patientName: patient.name,
          date: selectedDate,
          slotTime: slot.start,
        }),
      });

      const data = await res.json();

      if (data.success) {
        Alert.alert("Success", "Appointment booked successfully");
        router.back();
      } else {
        Alert.alert("Error", data.message || "Failed to book slot");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Something went wrong");
    }
  };

  if (!doc) return <Text>Doctor not found</Text>;
  if (loading) return <ActivityIndicator size="large" color="#1e90ff" style={{ flex: 1 }} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
      {/* Doctor Info */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: "700" }}>{doc.name}</Text>
        <Text style={{ fontSize: 16, color: "#555" }}>{doc.specialization}</Text>
        <Text style={{ fontSize: 16, color: "#555" }}>Experience: {doc.experience || 0} yrs</Text>
        <Text style={{ fontSize: 16, color: "#555" }}>Fee: ₹{doc.consultationFee || 500}</Text>
        <Text style={{ fontSize: 14, color: "#888", marginTop: 8 }}>Date: {selectedDate}</Text>
      </View>

      {/* Slots */}
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 10 }}>Available Slots</Text>
      {slots.length > 0 ? (
        <FlatList
          data={slots}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => bookAppointment(item)}
              style={{
                backgroundColor: "#1e90ff",
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                marginBottom: 10,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "600", textAlign: "center" }}>
                {item.start} - {item.end} ({item.day})
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text>No slots available today</Text>
      )}
    </SafeAreaView>
  );
}
