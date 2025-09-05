import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
};

const USERS_KEY = 'cached_users_v1';

export default function UsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!res.ok) throw new Error('Network error');
        const data: User[] = await res.json();
        if (!mounted) return;
        setUsers(data);
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(data));
      } catch (err) {
        // fallback to cached data
        const cached = await AsyncStorage.getItem(USERS_KEY);
        if (cached && mounted) setUsers(JSON.parse(cached));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUsers();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator size="small" /></View>;

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(u) => u.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>{item.email}</Text>
            <Text>{item.phone}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No users available</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  card: { padding: 12, borderWidth: 1, borderColor: '#eee', marginVertical: 6, borderRadius: 6 },
  name: { fontWeight: '700' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
