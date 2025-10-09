import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function DoctorProfile() {
  const router = useRouter();
  const [doctor, setDoctor] = useState<any>({});
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [fee, setFee] = useState("");
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ✅ Fetch doctor profile
  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("doctorToken");
      if (!token) {
        Alert.alert("Error", "No token found. Please login again.");
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:3001/api/doctor/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch profile");

      const data = await res.json();
      console.log("Doctor API response:", data);

      const doctorData = data.doctor;
      if (!doctorData) {
        Alert.alert("Error", "Invalid response from server.");
        setLoading(false);
        return;
      }

      // ✅ Set all doctor details
      setDoctor(doctorData);
      setName(doctorData.name || "");
      setSpecialization(doctorData.specialization || "");
      setExperience(doctorData.experience?.toString() || "");
      setFee(doctorData.consultationFee?.toString() || "");
      setSlots(doctorData.availableTimeSlots || []);
    } catch (err) {
      console.error("Error fetching profile:", err);
      Alert.alert("Error", "Unable to fetch profile.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout doctor
  const handleLogout = async () => {
    await AsyncStorage.removeItem("doctorToken");
    router.replace("/(auth)/signIn");
  };

  // ✅ Slot overlap checker
  const isOverlapping = (newSlot: any) => {
    return slots.some(
      (slot) =>
        slot.day === newSlot.day &&
        (moment(newSlot.start, "HH:mm").isBetween(
          moment(slot.start, "HH:mm"),
          moment(slot.end, "HH:mm"),
          undefined,
          "[)"
        ) ||
          moment(newSlot.end, "HH:mm").isBetween(
            moment(slot.start, "HH:mm"),
            moment(slot.end, "HH:mm"),
            undefined,
            "(]"
          ) ||
          moment(slot.start, "HH:mm").isBetween(
            moment(newSlot.start, "HH:mm"),
            moment(newSlot.end, "HH:mm")
          ))
    );
  };

  // ✅ Add slot API
  const handleAddSlot = async () => {
    if (!startTime || !endTime) {
      Alert.alert("Error", "Enter both start & end time");
      return;
    }

    const newSlot = { day: selectedDay, start: startTime, end: endTime };
    const daySlots = slots.filter((s) => s.day === selectedDay);

    if (daySlots.length >= 10) {
      Alert.alert("Error", "Maximum 10 slots per day");
      return;
    }
    if (isOverlapping(newSlot)) {
      Alert.alert("Error", "Slot overlaps with existing slot");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("doctorToken");
      const res = await fetch("http://localhost:3001/api/doctor/add-slot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSlot),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add slot");

      setSlots(data.slots || []);
      setStartTime("");
      setEndTime("");
      Alert.alert("Success", "Slot added successfully!");
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Something went wrong");
    }
  };

  // ✅ Update profile API
  const handleSaveProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("doctorToken");
      const res = await fetch("http://localhost:3001/api/doctor/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          specialization,
          experience: Number(experience),
          consultationFee: Number(fee),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      Alert.alert("Success", "Profile updated successfully!");
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Something went wrong");
    }
  };

  // ✅ Loader
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={{ fontSize: 16, color: "#555" }}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f7faff" }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/2966/2966488.png" }}
            style={styles.logo}
          />
          <Text style={styles.headerName}>Dr. {name || ""}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="exit-outline" size={28} color="#ff4d4d" />
        </TouchableOpacity>
      </View>

      <FlatList
        ListHeaderComponent={
          <View style={{ padding: 20 }}>
            {/* Profile Form */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Profile Info</Text>
              <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
              <TextInput
                style={styles.input}
                placeholder="Specialization"
                value={specialization}
                onChangeText={setSpecialization}
              />
              <TextInput
                style={styles.input}
                placeholder="Experience (in years)"
                keyboardType="numeric"
                value={experience}
                onChangeText={setExperience}
              />
              <TextInput
                style={styles.input}
                placeholder="Consultation Fee"
                keyboardType="numeric"
                value={fee}
                onChangeText={setFee}
              />
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
                <Text style={styles.saveText}>Save Profile</Text>
              </TouchableOpacity>
            </View>

            {/* Add Slot Form */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Add Available Slot</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", marginVertical: 10 }}>
                {DAYS.map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[styles.dayBtn, selectedDay === d && styles.selectedDayBtn]}
                    onPress={() => setSelectedDay(d)}
                  >
                    <Text style={selectedDay === d ? { color: "#fff", fontWeight: "600" } : {}}>
                      {d}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={styles.input}
                placeholder="Start Time HH:mm"
                value={startTime}
                onChangeText={setStartTime}
              />
              <TextInput
                style={styles.input}
                placeholder="End Time HH:mm"
                value={endTime}
                onChangeText={setEndTime}
              />
              <TouchableOpacity style={styles.saveBtn} onPress={handleAddSlot}>
                <Text style={styles.saveText}>Add Slot</Text>
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 18, fontWeight: "600", marginVertical: 10 }}>
              Existing Slots
            </Text>
          </View>
        }
        data={slots}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View style={styles.slotCard}>
            <Text>
              {item.day}: {item.start} - {item.end}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// ✅ Styles
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7faff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  headerName: { fontWeight: "700", fontSize: 20, marginLeft: 10 },
  logo: { width: 40, height: 40, borderRadius: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10, color: "#1e90ff" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginVertical: 5,
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
  dayBtn: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#1e90ff",
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedDayBtn: { backgroundColor: "#1e90ff" },
  slotCard: {
    backgroundColor: "#e6f0ff",
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
  },
});
