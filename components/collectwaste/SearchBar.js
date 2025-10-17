export const SearchBar = ({ searchQuery, setSearchQuery }) => (
  <View style={styles.searchContainer}>
    <Ionicons name="search-outline" size={20} color="#999" />
    <TextInput
      style={styles.searchInput}
      placeholder="Search Location"
      value={searchQuery}
      onChangeText={setSearchQuery}
    />
  </View>
);