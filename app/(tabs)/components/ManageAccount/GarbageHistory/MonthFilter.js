import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Filter } from 'lucide-react-native';
import { styles } from '../styles/styles';

export const MonthFilter = ({ filterMonth, setFilterMonth, uniqueMonths }) => {
  return (
    <View style={styles.filterSection}>
      <View style={styles.filterHeader}>
        <Filter size={20} color="#6B7280" />
        <Text style={styles.filterTitle}>Filter by Month</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        <TouchableOpacity
          style={[styles.filterButton, filterMonth === 'All' && styles.filterButtonActive]}
          onPress={() => setFilterMonth('All')}
        >
          <Text style={[styles.filterButtonText, filterMonth === 'All' && styles.filterButtonTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        {uniqueMonths.map((month) => (
          <TouchableOpacity
            key={month}
            style={[styles.filterButton, filterMonth === month && styles.filterButtonActive]}
            onPress={() => setFilterMonth(month)}
          >
            <Text style={[styles.filterButtonText, filterMonth === month && styles.filterButtonTextActive]}>
              {month}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};