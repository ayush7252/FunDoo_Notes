import { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ListScreen = ({navigation}: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Mock data
  const listItems = [
    { id: '1', title: 'Grocery List', count: 5, color: '#FF6B6B' },
  ];

  const toggleSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId) 
        : [...prev, itemId]
    );
  };

  const ListItem = ({ item }: { item: typeof listItems[0] }) => (
    <TouchableOpacity 
      style={[
        styles.listItem, 
        selectedItems.includes(item.id) && styles.selectedItem
      ]}
      onPress={() => toggleSelection(item.id)}
    >
      <TouchableOpacity>
        <Icon name="drag-indicator" size={24} color="#666" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => toggleSelection(item.id)}>
        <Icon 
          name={selectedItems.includes(item.id) ? 'check-box' : 'check-box-outline-blank'} 
          size={24} 
          color={selectedItems.includes(item.id) ? '#666' : '#666'} 
        />
      </TouchableOpacity>
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemTitle}>{item.title}</Text>
      </View>
      <TouchableOpacity>
        <Icon name="add" size={24} color="#666" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Icon name="keep" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="add-alert" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="archive" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Title Input */}
      <View style={styles.titleInputContainer}>
        <TextInput
          placeholder="Title..."
          placeholderTextColor="#888"
          style={styles.titleInput}
        />
        <TouchableOpacity>
          <Icon name="more-vert" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={listItems}
        renderItem={({ item }) => <ListItem item={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <TouchableOpacity>
            <Icon name="add-box" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerIcon}>
            <Icon name="palette" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerIcon}>
            <Icon name="text-format" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <Text style={styles.footerText}>Footer Text</Text>
        <TouchableOpacity>
          <Icon name="more-vert" size={24} color="#333" />
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
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
    height: 80,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 20,
  },
  titleInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
  },
  titleInput: {
    flex: 1,
    fontSize: 25,
    lineHeight: 30,
    color: '#333',
    height: 40,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    gap: 16,
  },
  itemTextContainer: {
    flex: 1,
  },
  selectedItem: {

  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  itemCount: {
    fontSize: 14,
    fontWeight: '400',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerLeft: {
    flexDirection: 'row',
    gap: 10,
  },
  footerIcon: {
    marginLeft: 16,
  },
  footerText: {
    color: '#666',
  },
});

export default ListScreen;