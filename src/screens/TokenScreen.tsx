import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token_bunny_v1";

async function saveToken(value: string) {
  return SecureStore.setItemAsync(TOKEN_KEY, value);
}
async function getToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}
async function deleteToken() {
  return SecureStore.deleteItemAsync(TOKEN_KEY);
}

export default function TokenScreen() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const t = await getToken();
      setToken(t);
    })();
  }, []);

  const handleSave = async () => {
    await saveToken("bunny-token-128878237");
    const t = await getToken();
    setToken(t);
    Alert.alert("✅ Saved", "Dummy token stored securely");
  };

  const handleDelete = async () => {
    await deleteToken();
    setToken(null);
    Alert.alert("🗑️ Deleted", "Token removed from secure storage");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Secure Token Demo</Text>

      <View style={styles.tokenBox}>
        <Text style={styles.tokenLabel}>Stored Token:</Text>
        <Text style={styles.tokenValue}>
          {token ?? "No token yet"}
        </Text>
      </View>

      <TouchableOpacity style={[styles.button, styles.saveBtn]} onPress={handleSave}>
        <Text style={styles.btnText}>💾 Save Dummy Token</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.deleteBtn]} onPress={handleDelete}>
        <Text style={styles.btnText}>🗑️ Delete Token</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },

  title: { fontSize: 20, fontWeight: "700", marginBottom: 20, color: "#222" },

  tokenBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  tokenLabel: { fontSize: 14, color: "#555", marginBottom: 6 },
  tokenValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0a62f8",
    backgroundColor: "#eef4ff",
    padding: 8,
    borderRadius: 6,
  },

  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  saveBtn: { backgroundColor: "#0a62f8" },
  deleteBtn: { backgroundColor: "#d32f2f" },

  btnText: { color: "white", fontWeight: "600", fontSize: 16 },
});
