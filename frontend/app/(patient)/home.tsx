import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function PatientHome() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSpeciality, setSelectedSpeciality] = useState("All");

  const specialities = [
    "All",
    "Cardiologist",
    "Dentist",
    "Dermatologist",
    "Orthopedic",
    "Neurologist",
    "Pediatrician",
  ];

  const fetchDoctors = async () => {
    try {
      const token = await AsyncStorage.getItem("patientToken");
      if (!token) {
        console.warn("No token found. Redirect to login if needed.");
        return;
      }

      const response = await fetch("http://localhost:3001/api/doctor/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (Array.isArray(data)) setDoctors(data);
      else if (Array.isArray(data.doctors)) setDoctors(data.doctors);
      else if (data.doctor) setDoctors([data.doctor]);
      else setDoctors([]);

      // Fallback demo appointments
      setAppointments([
        {
          id: "1",
          doctorName: "Dr. Parth Jadhao",
          specialization: "Cardiologist",
          date: "2025-10-12",
          time: "10:00 AM",
        },
        {
          id: "2",
          doctorName: "Dr. Nisha Mehta",
          specialization: "Dentist",
          date: "2025-10-15",
          time: "3:00 PM",
        },
      ]);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setDoctors([]);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = doc.name?.toLowerCase().includes(search.toLowerCase());
    const matchesSpeciality =
      selectedSpeciality === "All" ||
      doc.specialization?.toLowerCase() === selectedSpeciality.toLowerCase();
    return matchesSearch && matchesSpeciality;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 🔍 Search Bar */}
        <TextInput
          placeholder="Search doctors..."
          value={search}
          onChangeText={setSearch}
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 12,
            padding: 12,
            marginBottom: 12,
            fontSize: 16,
          }}
        />

        {/* 🩺 Speciality Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {specialities.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setSelectedSpeciality(item)}
              style={{
                backgroundColor:
                  selectedSpeciality === item ? "#1e90ff" : "#f0f0f0",
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 8,
                marginRight: 10,
              }}
            >
              <Text
                style={{
                  color: selectedSpeciality === item ? "#fff" : "#333",
                  fontWeight: "600",
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 📅 Upcoming Appointments - Horizontal */}
        <Text style={{ marginTop: 20, fontSize: 18, fontWeight: "700" }}>
          Upcoming Appointments
        </Text>

        {appointments.length > 0 ? (
          <FlatList
            data={appointments}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 10 }}
            renderItem={({ item }) => (
              <View
                style={{
                  width: 200,
                  backgroundColor: "#f9f9f9",
                  borderRadius: 10,
                  padding: 12,
                  marginRight: 12,
                  shadowColor: "#000",
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                <Text style={{ fontWeight: "600", fontSize: 16 }}>
                  {item.doctorName}
                </Text>
                <Text style={{ color: "#777" }}>{item.specialization}</Text>
                <Text style={{ marginTop: 4, color: "#444" }}>
                  {item.date} • {item.time}
                </Text>
              </View>
            )}
          />
        ) : (
          <Text style={{ marginTop: 10, color: "#888" }}>
            No upcoming appointments yet.
          </Text>
        )}

        {/* 👨‍⚕️ Doctors Section - Vertical */}
        <Text style={{ marginTop: 28, fontSize: 18, fontWeight: "700" }}>
          Available Doctors
        </Text>

        {filteredDoctors.length > 0 ? (
          <FlatList
            data={filteredDoctors}
            keyExtractor={(item) => item._id}
            style={{ marginTop: 10 }}
            renderItem={({ item }) => (
              <View
                style={{
                  width: "100%",
                  backgroundColor: "#f9f9f9",
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  elevation: 2,
                }}
              >
                <Image
                  source={{
                    uri:
                      "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
                  }}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    marginRight: 12,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "700", fontSize: 16 }}>
                    {item.name || "Dr. Unknown"}
                  </Text>
                  <Text style={{ color: "#555", fontSize: 14 }}>
                    {item.specialization || "General Practitioner"}
                  </Text>
                  <Text style={{ color: "#888", marginTop: 4 }}>
                    ₹{item.consultationFee || 500}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#1e90ff",
                    borderRadius: 8,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                  }}
                  onPress={() => router.push({
                    pathname: "/(book)/bookDoctor",
                    params: { doctor: JSON.stringify(item) } // pass doctor object
                  })}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "#fff",
                      fontWeight: "600",
                    }}
                  >
                    Book Now
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <Text style={{ marginTop: 10, color: "#888" }}>
            No doctors available right now.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
