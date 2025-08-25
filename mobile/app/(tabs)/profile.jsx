import { View, Text, Alert, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native'
import { useState, useEffect} from 'react'
import { useRouter } from 'expo-router'
import { API_URL } from "../../constants/api";
import { useAuthStore } from '../../store/authStore'
import styles from "../../assets/styles/profile.styles";
import ProfileHeader from "../../components/ProfileHeader";
import LogoutButton from "../../components/LogoutButton";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { Image } from "expo-image";
import { sleep } from ".";
import Loader from "../../components/Loader";

export default function Profile() {
  const [somethings, setSomethings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteStatusId, setDeleteStatusId] = useState(null);
  const { token } = useAuthStore();
  const router = useRouter();

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_URL}/st/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch user ");

      setSomethings(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to load profile data. Pull down to refresh.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={14}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  const handleDeleteStatus = async (statusId) => {
    try {
      setDeleteStatusId(statusId);

      const response = await fetch(`${API_URL}/st/${statusId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete status");

      setSomethings(somethings.filter((status) => status._id !== statusId));
      Alert.alert("Success", "Status deleted successfully");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to delete status");
    } finally {
      setDeleteStatusId(null);
    }
  };

  const confirmDelete = (statusId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this status?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style:"destructive", onPress: () => handleDeleteStatus(statusId) },
      ]
    );
  };

    const renderStItem = ({ item }) => (
    <View style={styles.bookItem}>
      <Image source={item.image} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>{renderRatingStars(item.rating)}</View>
        <Text style={styles.bookCaption} numberOfLines={2}>
          {item.caption}
        </Text>
        <Text style={styles.bookDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item._id)}>
        {deleteStatusId === item._id ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
        )}
      </TouchableOpacity>
    </View>
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await sleep(500);
    await fetchData();
    setRefreshing(false);
  };

  if (isLoading && !refreshing) return <Loader />;

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <LogoutButton />

      {/* YOUR RECOMMENDATIONS */}
      <View style={styles.booksHeader}>
        <Text style={styles.booksTitle}>Your Recommendations </Text>
        <Text style={styles.booksCount}>{somethings.length} status</Text>
      </View>
      <FlatList
        data={somethings}
        renderItem={renderStItem}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.booksList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={50} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No recommendations yet</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
              <Text style={styles.addButtonText}>Add Your First Status</Text>
            </TouchableOpacity>
          </View>
        }
      />

    </View>
  )
}