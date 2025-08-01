import { styles } from "@/assets/styles/home.style";
import BalanceCard from "@/components/BalanceCard";
import NoTransaction from "@/components/NoTransaction";
import PageLoader from "@/components/PageLoader";
import { SignOutButton } from "@/components/SignOutButton";
import TransactionCard from "@/components/TransactionCard";
import { useTransactions } from "@/hooks/useTransactions";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Page() {
  const { user } = useUser();
  const [refreshing, setRefreshing] = useState(false);

  const { transactions, summary, isLoading, loadData, deleteTransaction } =
    useTransactions(user.id);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  // console.log("userId", user.id);
  console.log("transaction:", transactions);
  // console.log("summary:", summary);

  if (isLoading && !refreshing) return <PageLoader />;

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Transactions",
      "Are you sure you want to delete this transactions?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteTransaction(id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          {/* Header Left */}
          <View style={styles.headerLeft}>
            <Image
              style={styles.headerLogo}
              source={require("../../assets/images/logo.png")}
              resizeMode="contain"
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.usernameText}>
                {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
              </Text>
            </View>
          </View>

          {/* Header Right */}
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/create")}
            >
              <Ionicons name="add" size={20} color={"#fff"} />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>

        <BalanceCard summary={summary} />

        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>
      </View>

      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        renderItem={({ item }) => (
          <TransactionCard item={item} onDelete={handleDelete} />
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<NoTransaction />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}
