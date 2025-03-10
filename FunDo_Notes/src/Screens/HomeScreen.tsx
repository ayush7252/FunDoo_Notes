import React, {useEffect, useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {firestore} from '../Firebase/Api';
import AddButton from '../Components/AddButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import notifee ,{TimestampTrigger, TriggerType}from '@notifee/react-native';

interface Note {
  id: string;
  title: string;
  note: string;
  createdAt: Date;
  notification: boolean;
  archived: boolean;
  reminderDate?: Date;
  reminderLocation?: 'home' | 'office';
}

interface ReminderModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (date: Date, location: string) => void;
}
// reminderModal
const ReminderModal = ({ visible, onClose, onSave }: ReminderModalProps) => {
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState<'home' | 'office' | ''>('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (true) {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(date.getHours());
      newDate.setMinutes(date.getMinutes());
      setDate(newDate);
    }
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (true) {
      setShowTimePicker(false);
    }
    if (selectedDate) {
      const newDate = new Date(date);
      newDate.setHours(selectedDate.getHours());
      newDate.setMinutes(selectedDate.getMinutes());
      setDate(newDate);
    }
  };

  const handleSave = async () => {
    if (location) {
      try {
        await notifee.requestPermission();
        const trigger : TimestampTrigger = {
          type: TriggerType.TIMESTAMP,
          timestamp: new Date(date).getTime(),
        }
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
        });
        await notifee.createTriggerNotification(
          {
            title: 'Reminder Alert!',
            body: `Time for your ${location} reminder`,
            android: {
              channelId,
              pressAction: {
                id: 'default',
              },
            },
          }, trigger
        );
        onSave(date, location);
        onClose();
      } catch (error) {
        Alert.alert('Error', 'Failed to set reminder. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Please select a location');
    }
  };
  

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Set Reminder</Text>

          <View style={styles.datetimeContainer}>
            <TouchableOpacity
              style={styles.dateTimeInput}
              onPress={() => setShowDatePicker(true)}>
              <Icon name="calendar-today" size={20} color="#666" />
              <Text style={styles.dateTimeText}>
                {date.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateTimeInput}
              onPress={() => setShowTimePicker(true)}>
              <Icon name="access-time" size={20} color="#666" />
              <Text style={styles.dateTimeText}>
                {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
          </View>

          {(showDatePicker) && (
            <DateTimePicker
              value={date}
              mode="date"
              display={'default'}
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          {(showTimePicker) && (
            <DateTimePicker
              value={date}
              mode="time"
              display={'default'}
              onChange={handleTimeChange}
            />
          )}

          <View style={styles.locationContainer}>
            <TouchableOpacity
              style={[
                styles.locationButton,
                location === 'home' && styles.selectedLocation,
              ]}
              onPress={() => setLocation('home')}>
              <Text>🏠 Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.locationButton,
                location === 'office' && styles.selectedLocation,
              ]}
              onPress={() => setLocation('office')}>
              <Text>🏢 Office</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Save Reminder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const HomeScreen = ({navigation}: any) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGridView, setIsGridView] = useState(false); 
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  // reminder
  const [showReminderModal, setShowReminderModal] = useState(false);

  // to filter notes based on search query
  const filteredNotes = useMemo(() => {
    if (!searchQuery) return notes; 

    return notes.filter((note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [notes, searchQuery]);

  useEffect(() => {
    const unsubscribe = firestore
      .collection('notes')
      .where('archived', '==', false)
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const notesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Note[];
        setNotes(notesData);
      });

    return () => unsubscribe();
  }, []);

  // Toggle between grid and list view
  const toggleViewMode = () => {
    setIsGridView(prev => !prev);
  };

  const handleArchiveNotes = async () => {
    if (selectedNoteIds.length === 0) return;

    try {
      const batch = firestore.batch();

      selectedNoteIds.forEach(noteId => {
        const noteRef = firestore.collection('notes').doc(noteId);
        batch.update(noteRef, {
          archived: true,
          archivedAt: new Date(),
        });
      });

      await batch.commit();
      setSelectedNoteIds([]);
      Alert.alert('Success', 'Notes archived successfully');
    } catch (error) {
      console.error('Error archiving notes:', error);
      Alert.alert('Error', 'Could not archive notes');
    }
  };

  const handleDeleteNotes = async () => {
    if (selectedNoteIds.length === 0) return;

    try {
      const batch = firestore.batch();
      const notesRefs = selectedNoteIds.map(id =>
        firestore.collection('notes').doc(id),
      );
      await Promise.all(
        notesRefs.map(async noteRef => {
          const noteDoc = await noteRef.get();
          if (noteDoc.exists) {
            const deletedNoteRef = firestore
              .collection('deleted_notes')
              .doc(noteRef.id);
            batch.set(deletedNoteRef, {
              ...noteDoc.data(),
              deletedAt: new Date(),
            });
            batch.delete(noteRef);
          }
        }),
      );

      await batch.commit();
      setSelectedNoteIds([]);
    } catch (error) {
      console.error('Error deleting notes:', error);
      Alert.alert('Error', 'Could not delete notes');
    }
  };

  // Render each note item
  const renderNoteItem = ({item}: {item: Note}) => (
    <TouchableOpacity
      style={[
        styles.noteCard,
        isGridView ? styles.gridCard : styles.listCard,
        selectedNoteIds.includes(item.id) && styles.selectedNote,
      ]}
      onLongPress={() => {
        setSelectedNoteIds(prev =>
          prev.includes(item.id)
            ? prev.filter(id => id !== item.id)
            : [...prev, item.id],
        );
      }}>
      {selectedNoteIds.includes(item.id) && (
        <Icon
          name="check-box"
          size={24}
          color="#2196f3"
          style={styles.checkbox}
        />
      )}
      <Text style={styles.noteTitle}>{item.title}</Text>
      <Text style={styles.noteContent}>{item.note}</Text>
    </TouchableOpacity>
  );
  // Reminder
  const handleSetReminder = async (date: Date, location: 'home' | 'office') => {
    try {
      const batch = firestore.batch();

      selectedNoteIds.forEach(noteId => {
        const noteRef = firestore.collection('notes').doc(noteId);
        batch.update(noteRef, {
          notification: true,
          reminderDate: date,
          reminderLocation: location,
        });
      });

      await batch.commit();
      setSelectedNoteIds([]);
      Alert.alert('Success', 'Reminders set successfully');
    } catch (error) {
      console.error('Error setting reminders:', error);
      Alert.alert('Error', 'Could not set reminders');
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {/* Selection Header */}
      {selectedNoteIds.length > 0 && (
        <View style={styles.selectionHeader}>
          <TouchableOpacity onPress={() => setSelectedNoteIds([])}>
            <Icon name="close" size={24} color="grey" />
          </TouchableOpacity>

          <Text style={styles.selectionCount}>
            {selectedNoteIds.length} selected
          </Text>

          <View style={styles.selectionIcons}>
            <TouchableOpacity
              onPress={() => setShowReminderModal(true)}
              style={styles.deleteButton}>
              <Icon name="notifications" size={24} color="grey" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleArchiveNotes}
              style={styles.deleteButton}>
              <Icon name="archive" size={24} color="grey" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDeleteNotes}
              style={styles.deleteButton}>
              <Icon name="delete" size={24} color="grey" />
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* Main Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.toggleDrawer()}
            style={styles.iconContainer}>
            <Icon name="menu" size={30} color="#828282" />
          </TouchableOpacity>

          <TextInput
            placeholder="Search your notes"
            placeholderTextColor={'#828282'}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <View style={styles.headerIcons}>
            {/* Toggle View Button */}
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={toggleViewMode}>
              <Icon
                name={isGridView ? 'view-agenda' : 'dashboard'} 
                size={26}
                color="#828282"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer}>
              <Icon name="account-circle" size={30} color="#828282" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* Content Area */}
      {notes.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Icon name="lightbulb-outline" size={100} color={'#fcbf49'} />
          <Text style={styles.emptyStateText}>Notes you add appear here</Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotes}
          renderItem={renderNoteItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          numColumns={isGridView ? 2 : 1} 
          key={isGridView ? 'grid' : 'list'} 
        />
      )}
      {/* RreminderModal */}
      {showReminderModal && (
        <ReminderModal
          visible={showReminderModal}
          onClose={() => setShowReminderModal(false)}
          onSave={(date, location) =>
            handleSetReminder(date, location as 'home' | 'office')
          }
        />
      )}
      {/* Add Button */}
      <View style={styles.addButtonContainer}>
        <AddButton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
  },
  iconContainer: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 16,
    fontSize: 16,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -100,
  },
  emptyStateText: {
    fontSize: 15,
    color: 'grey',
    marginTop: 16,
  },
  noteCard: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    margin: 8,
    borderRadius: 8,
    elevation: 2,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 20,
  },
  noteContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  addButtonContainer: {
    position: 'absolute',
    right: -2,
    bottom: -5,
  },
  listCard: {
    width: '96%',
    padding: 20,
    margin: 8,
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#f0f0f0',
    padding: 20,
    margin: 4,
    borderRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  selectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: -30,
    marginTop: 45,
  },
  selectionIcons: {
    flexDirection: 'row',
    gap: 20,
  },
  deleteButton: {
    paddingHorizontal: 1,
  },
  selectedNote: {
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#2196f3',
  },
  checkbox: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  selectionCount: {
    color: '#2196f3',
    fontWeight: 'bold',
    marginHorizontal: 16,
  },
  deleteButtonText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },

  // Reminder
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    padding: 25,
    borderRadius: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  locationButton: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedLocation: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  cancelButton: {
    padding: 10,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#2196f3',
    padding: 10,
    borderRadius: 5,
  },
  saveText: {
    color: 'white',
  },
  datetimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  dateTimeInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateTimeText: {
    marginLeft: 10,
    color: '#333',
  },
});

export default HomeScreen;
