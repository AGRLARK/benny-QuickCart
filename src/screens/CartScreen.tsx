import React, { useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useCartStore } from "../store/cartStore";

export default function CartScreen() {
  const { items, increaseQty, decreaseQty, removeFromCart, clearCart } =
    useCartStore();

  // Total items in cart
  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items]
  );

  // Total price of cart
  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.qty * (i.price ?? 0), 0),
    [items]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        🛒 Cart ({totalItems} items) | ₹{totalPrice}
      </Text>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id.toString()} 
        ListEmptyComponent={
          <Text style={styles.empty}>Your cart is empty 😔</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Item details */}
            <View>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>
                ₹{item.price ?? 0} × {item.qty} = ₹{item.qty * (item.price ?? 0)}
              </Text>
            </View>

            {/* Quantity controls */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => decreaseQty(item.id)}
              >
                <Text style={styles.qtyText}>−</Text>
              </TouchableOpacity>

              <Text style={styles.qtyCount}>{item.qty}</Text>

              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => increaseQty(item.id)}
              >
                <Text style={styles.qtyText}>＋</Text>
              </TouchableOpacity>
            </View>

            {/* Remove button */}
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => removeFromCart(item.id)}
            >
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Bottom Bar */}
      {items.length > 0 && (
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.clearBtn} onPress={clearCart}>
            <Text style={styles.clearText}>Clear Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.checkoutBtn}>
            <Text style={styles.checkoutText}>
              Pay ₹{totalPrice} checkout →
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#222",
  },
  empty: { marginTop: 30, textAlign: "center", fontSize: 16, color: "#666" },

  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemName: { fontSize: 16, fontWeight: "600", color: "#333" },
  itemPrice: { fontSize: 14, color: "#666", marginTop: 4 },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
  },
  qtyBtn: {
    backgroundColor: "#eee",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  qtyText: { fontSize: 18, fontWeight: "600", color: "#333" },
  qtyCount: { marginHorizontal: 8, fontSize: 16, fontWeight: "600" },

  removeBtn: { padding: 6 },
  removeText: { color: "red", fontSize: 13 },

  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderTopWidth: 0.5,
    borderTopColor: "#ddd",
    backgroundColor: "white",
  },
  clearBtn: {
    backgroundColor: "#d32f2f",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  clearText: { color: "white", fontWeight: "600" },

  checkoutBtn: {
    backgroundColor: "#0a62f8",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  checkoutText: { color: "white", fontWeight: "600" },
});
