import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { useGarbageHistory } from '../hooks/useGarbageHistory';
import { LoadingScreen } from '../components/LoadingScreen';
import { StatsSummary } from '../components/StatsSummary';
import { AllTimeStats } from '../components/AllTimeStats';
import { MonthFilter } from '../components/MonthFilter';
import { RecordsList } from '../components/RecordsList';
import { styles } from '../styles/styles';

export default function GarbageHistoryScreen() {
  const {
    loading,
    filterMonth,
    setFilterMonth,
    stats,
    uniqueMonths,
    filteredRecords
  } = useGarbageHistory();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Garbage Collection History</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* This Month Stats */}
          <StatsSummary stats={stats} />

          {/* All Time Stats */}
          <AllTimeStats stats={stats} />

          {/* Filter Section */}
          <MonthFilter 
            filterMonth={filterMonth}
            setFilterMonth={setFilterMonth}
            uniqueMonths={uniqueMonths}
          />

          {/* Records List */}
          <RecordsList 
            filterMonth={filterMonth}
            filteredRecords={filteredRecords}
          />

          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}