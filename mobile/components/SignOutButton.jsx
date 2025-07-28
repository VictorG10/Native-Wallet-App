import { styles } from "@/assets/styles/home.style";
import { COLORS } from "@/constants/color";
import { useClerk } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { Alert, Text, TouchableOpacity } from "react-native";

export const SignOutButton = () => {
  const { signOut } = useClerk();
  const handleSignOut = async () => {
    Alert.alert("Logout", "Are you sure want to logout", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: signOut },
    ]);
  };
  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
      {/* <Text>Sign out</Text> */}
      <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
    </TouchableOpacity>
  );
};
