import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ListRenderItemInfo,
} from "react-native";
import { useCartStore } from "../store/cartStore";
import { useNavigation } from "@react-navigation/native";

const TOTAL = 5000;
const PAGE_SIZE = 60;
const ITEM_HEIGHT = 90;

type Item = { id: number; name: string; price: number };

export default function HomeScreen() {
  const allItems = useMemo(() => {
    return Array.from({ length: TOTAL }).map((_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      price: ((i % 100) + 1) * 5,
    })) as Item[];
  }, []);

  const [page, setPage] = useState(1);
  const visibleData = useMemo(
    () => allItems.slice(0, page * PAGE_SIZE),
    [allItems, page]
  );

  const { addToCart, increaseQty, decreaseQty, items, totalCount } =
    useCartStore();

  const navigation = useNavigation();

  const loadMore = () => {
    if (page * PAGE_SIZE < TOTAL) {
      setPage((p) => p + 1);
    }
  };

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Item>) => {
      const inCart = items.find((i) => i.id === item.id);

      return (
        <View style={styles.card}>
          <View>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.price}>₹ {item.price}</Text>
          </View>

          {!inCart ? (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => addToCart(item)}
            >
              <Text style={styles.addText}>+ Add</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.qtyBox}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => decreaseQty(item.id)}
              >
                <Text style={styles.qtyText}>-</Text>
              </TouchableOpacity>

              <Text style={styles.qtyCount}>{inCart.qty}</Text>

              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => increaseQty(item.id)}
              >
                <Text style={styles.qtyText}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
    },
    [items, addToCart, increaseQty, decreaseQty]
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={visibleData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={9}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        removeClippedSubviews
        contentContainerStyle={{ padding: 10 }}
      />

      {/* Floating "Go to Cart" Button */}
      {totalCount() > 0 && (
        <TouchableOpacity
          style={styles.cartFloating}
          onPress={() => navigation.navigate("Cart" as never)}
        >
          <Text style={styles.cartText}>🛒 Go to Cart ({totalCount()})</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: ITEM_HEIGHT,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  itemName: { fontSize: 16, fontWeight: "600", color: "#333" },
  price: { fontSize: 14, color: "#666", marginTop: 4 },
  addBtn: {
    backgroundColor: "#0a62f8",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  addText: { color: "#fff", fontWeight: "600" },
  qtyBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 6,
  },
  qtyBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  qtyText: { fontSize: 18, fontWeight: "700", color: "#0a62f8" },
  qtyCount: { fontSize: 16, fontWeight: "600", marginHorizontal: 6 },
  cartFloating: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#0a62f8",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  cartText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
