import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet } from 'react-native';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (text) => {
    setQuery(text);
    // Filter results based on text
    const filteredResults = [
      { id: '1', name: 'User1' },
      { id: '2', name: 'User2' }
    ].filter(user => user.name.toLowerCase().includes(text.toLowerCase()));
    setResults(filteredResults);
  };

  const renderItem = ({ item }) => (
    <View style={styles.resultContainer}>
      <Text>{item.name}</Text>
    </View>
  );

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Search"
        placeholderTextColor='#000000'
        value={query}
        onChangeText={handleSearch}
      />
      <FlatList
        data={results}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  resultContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc'
  }
});

export default SearchScreen;
