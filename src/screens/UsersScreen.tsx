import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
};

const USERS_KEY = "cached_users_v1";

export default function UsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setOffline(false);
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!res.ok) throw new Error("Network error");
        const data: User[] = await res.json();
        if (!mounted) return;
        setUsers(data);
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(data));
      } catch (err) {
        // fallback to cached data
        const cached = await AsyncStorage.getItem(USERS_KEY);
        if (cached && mounted) {
          setUsers(JSON.parse(cached));
          setOffline(true);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUsers();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0a62f8" />
        <Text style={{ marginTop: 10 }}>Loading users...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      {offline && (
        <View style={styles.offlineBanner}>
          <Text style={{ color: "white" }}>Offline Mode: Showing cached data</Text>
        </View>
      )}

      <FlatList
        data={users}
        keyExtractor={(u) => u.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.8}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.email}>{item.email}</Text>
              <Text style={styles.phone}>{item.phone}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No users available</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#f9f9f9" },

  offlineBanner: {
    backgroundColor: "#d32f2f",
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
    alignItems: "center",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#0a62f8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  avatarText: { color: "white", fontWeight: "bold", fontSize: 16 },

  name: { fontWeight: "700", fontSize: 16, color: "#333" },
  email: { color: "#555", marginTop: 2 },
  phone: { color: "#777", marginTop: 1 },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
