import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token_demo_v1";

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

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync("auth_token");
      if (token) setToken(token);
    };
    loadToken();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Secure Token Demo</Text>
      <Text style={{ marginBottom: 12 }}>
        Stored Token: {token ?? "No token yet"}
      </Text>
      <Button
        title="Save Dummy Token"
        onPress={async () => {
          await saveToken("dummy-token-12345");
          const t = await getToken();
          setToken(t);
          Alert.alert("Saved", "Dummy token saved in secure storage");
        }}
      />
      <View style={{ height: 8 }} />
      <Button
        title="Delete Token"
        onPress={async () => {
          await deleteToken();
          setToken(null);
          Alert.alert("Deleted", "Token removed from secure storage");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, alignItems: "flex-start" },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
});
