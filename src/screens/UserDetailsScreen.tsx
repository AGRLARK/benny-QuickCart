import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  UserDetails: { id: string };
};

type Route = RouteProp<RootStackParamList, 'UserDetails'>;

export default function UserDetailsScreen() {
  const route = useRoute<Route>();
  const { id } = route.params;
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    // try to load cached users and find the user by id
    (async () => {
      try {
        const cached = await AsyncStorage.getItem('cached_users_v1');
        if (cached) {
          const list = JSON.parse(cached);
          const found = list.find((u: any) => String(u.id) === String(id));
          if (found) {
            setUser(found);
            return;
          }
        }
        // If no cached user, try network once
        const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (e) {
        // ignore
      }
    })();
  }, [id]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Details (ID: {id})</Text>
      {user ? (
        <>
          <Text style={styles.name}>{user.name}</Text>
          <Text>Email: {user.email}</Text>
          <Text>Phone: {user.phone}</Text>
          <Text>Website: {user.website}</Text>
        </>
      ) : (
        <Text style={{ marginTop: 8 }}>Loading user info...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontWeight: '700', fontSize: 18 },
  name: { fontSize: 16, marginTop: 8, marginBottom: 4 },
});
