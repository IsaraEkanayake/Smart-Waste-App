import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../../firebase';

/**
 * FindLocationScreen Component
 * Displays map with bin locations and navigation routes
 * 
 * @component
 * @follows Single Responsibility Principle - Handles location display and navigation
 * @follows Open/Closed Principle - Extensible for additional map features
 */
const FindLocationScreen = ({ navigation, route }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
    name: 'Welcome Kaduwela',
  });

  useEffect(() => {
    fetchBinsForCollection();
  }, []);

  /**
   * Fetch bins that need collection from Firebase
   */
  const fetchBinsForCollection = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'bins'), 
        where('status', 'in', ['full', 'scheduled'])
      );
      const querySnapshot = await getDocs(q);
      
      const binsData = [];
      querySnapshot.forEach((doc) => {
        binsData.push({ id: doc.id, ...doc.data() });
      });
      
      setBins(binsData);
    } catch (error) {
      console.error('Error fetching bins:', error);
      Alert.alert('Error', 'Failed to load bin locations');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generate route coordinates between current location and selected bin
   */
  const generateRouteCoordinates = (targetLocation) => {
    if (!targetLocation) return [];
    
    return [
      { latitude: currentLocation.latitude, longitude: currentLocation.longitude },
      { 
        latitude: (currentLocation.latitude + targetLocation.latitude) / 2,
        longitude: (currentLocation.longitude + targetLocation.longitude) / 2 
      },
      { latitude: targetLocation.latitude, longitude: targetLocation.longitude }
    ];
  };

  /**
   * LocationCard Component
   * Reusable card for displaying location information
   * @follows Single Responsibility Principle
   */
  const LocationCard = ({ location }) => (
    <TouchableOpacity 
      style={styles.locationCard}
      onPress={() => setSelectedLocation(location)}
    >
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{location.name}</Text>
        <Text style={styles.locationAddress}>{location.address}</Text>
        <View style={styles.weightBadge}>
          <Text style={styles.weightText}>Fill Level</Text>
          <Text style={styles.weightValue}>{location.fillLevel}%</Text>
        </View>
        <View style={[
          styles.statusBadge,
          location.status === 'full' ? styles.fullBadge : styles.scheduledBadge
        ]}>
          <Text style={styles.statusText}>
            {location.status === 'full' ? 'FULL' : 'SCHEDULED'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  /**
   * SearchBar Component
   * Handles location search functionality
   * @follows Single Responsibility Principle
   */
  const SearchBar = () => (
    <View style={styles.searchContainer}>
      <Ionicons name="search-outline" size={20} color="#999" />
      <TextInput
        style={styles.searchInput}
        placeholder="Search Location"
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Ionicons name="mic-outline" size={20} color="#999" />
    </View>
  );

  /**
   * CurrentLocationBanner Component
   * Displays the current location information
   * @follows Single Responsibility Principle
   */
  const CurrentLocationBanner = () => (
    <View style={styles.currentLocationBanner}>
      <View style={styles.locationRow}>
        <Ionicons name="location" size={18} color="#333" />
        <Text style={styles.currentLocationText}>
          {currentLocation.name}
        </Text>
      </View>
      <TouchableOpacity style={styles.myLocationButton}>
        <Ionicons name="navigate-circle-outline" size={24} color="#666" />
      </TouchableOpacity>
    </View>
  );

  /**
   * NextLocationsSection Component
   * Displays list of upcoming collection locations
   * @follows Single Responsibility Principle
   */
  const NextLocationsSection = () => (
    <View style={styles.nextLocationsContainer}>
      <Text style={styles.sectionTitle}>Bins Needing Collection ({bins.length})</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.locationsScrollView}
      >
        {bins.map((location) => (
          <LocationCard key={location.id} location={location} />
        ))}
      </ScrollView>
    </View>
  );

  const handleNextLocation = () => {
    if (!selectedLocation) {
      Alert.alert('Select Location', 'Please select a bin location first');
      return;
    }
    
    router.push({
      pathname: '/(tabs)/screens/collectwaste/LiveTrackingScreen',
      params: { 
        binId: selectedLocation.id,
        binName: selectedLocation.name,
        binLocation: selectedLocation.address
      }
    });
  };

  const handleScanQR = () => {
    router.push('/(tabs)/screens/collectwaste/ScanBinQRScreen');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Find Location</Text>
        <TouchableOpacity onPress={handleScanQR} style={styles.scanButton}>
          <Ionicons name="qr-code-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <SearchBar />
      </View>

      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {/* Current Location Marker */}
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Current Location"
          >
            <View style={styles.currentMarker}>
              <Ionicons name="location" size={30} color="#2196F3" />
            </View>
          </Marker>

          {/* Bin Location Markers */}
          {bins.map((location) => (
            <Marker
              key={location.id}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title={location.name}
              onPress={() => setSelectedLocation(location)}
            >
              <View style={[
                styles.binMarker,
                selectedLocation?.id === location.id && styles.selectedBinMarker
              ]}>
                <Ionicons 
                  name="trash" 
                  size={20} 
                  color={selectedLocation?.id === location.id ? "#FFFFFF" : "#4CAF50"} 
                />
              </View>
            </Marker>
          ))}

          {/* Route Polyline to selected location */}
          {selectedLocation && (
            <Polyline
              coordinates={generateRouteCoordinates(selectedLocation)}
              strokeColor="#FF5252"
              strokeWidth={3}
            />
          )}
        </MapView>

        {/* Map Overlays */}
        <CurrentLocationBanner />
      </View>

      {/* Next Locations Section */}
      <NextLocationsSection />

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.scanButtonLarge}
          onPress={handleScanQR}
          activeOpacity={0.8}
        >
          <Ionicons name="qr-code" size={24} color="#FFFFFF" />
          <Text style={styles.scanButtonText}>Scan QR Code</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.nextButton,
            !selectedLocation && styles.nextButtonDisabled
          ]}
          onPress={handleNextLocation}
          activeOpacity={0.8}
          disabled={!selectedLocation}
        >
          <Text style={styles.nextButtonText}>
            {selectedLocation ? 'Navigate to Bin' : 'Select a Bin'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 5,
  },
  scanButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  searchSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  currentMarker: {
    alignItems: 'center',
  },
  binMarker: {
    backgroundColor: '#E8F5E9',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  selectedBinMarker: {
    backgroundColor: '#4CAF50',
    transform: [{ scale: 1.2 }],
  },
  currentLocationBanner: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currentLocationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  myLocationButton: {
    padding: 5,
  },
  nextLocationsContainer: {
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  locationsScrollView: {
    paddingHorizontal: 20,
  },
  locationCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    marginRight: 15,
    width: 280,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  weightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    gap: 5,
    marginBottom: 8,
  },
  weightText: {
    fontSize: 11,
    color: '#666',
  },
  weightValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  fullBadge: {
    backgroundColor: '#FF5252',
  },
  scheduledBadge: {
    backgroundColor: '#FF9800',
  },
  statusText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  scanButtonLarge: {
    flex: 1,
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  nextButton: {
    flex: 2,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default FindLocationScreen;