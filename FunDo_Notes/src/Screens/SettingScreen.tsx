import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Switch } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import Icon from 'react-native-vector-icons/MaterialIcons';

const SettingScreen = ({navigation}:any) => {
  const [addNewItemsBottom, setAddNewItemsBottom] = useState(true);
  const [moveTickedItemsBottom, setMoveTickedItemsBottom] = useState(false);
  const [DisplayRich, setDisplayRich] = useState(true)
  const [EnableSharing, setEnableSharing] = useState(true)
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [currentTimeType, setCurrentTimeType] = useState('');
  const [reminderTimes, setReminderTimes] = useState({
    Morning: '8:00 AM',
    Afternoon: '1:00 PM',
    Evening: '6:00 PM'
  });

  const handleTimeChange = (event, date) => {
    if (date) {
      const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setReminderTimes(prev => ({
        ...prev,
        [currentTimeType]: formattedTime
      }));
    }
    setTimePickerVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Main Heading */}
      <View style={styles.NavHeader}>
        <TouchableOpacity onPress={()=>navigation.toggleDrawer()}>
        <Icon name='menu' size={30} color={'black'} />
        </TouchableOpacity>
        <Text style={[styles.mainHeading , {marginLeft:20,marginTop:10,lineHeight:25}]}>Settings</Text>
      </View>

      {/* Display Options Section */}
      <Text style={styles.sectionHeading}>Display options</Text>
      
      <View style={styles.optionRow}>
        <Text>Add new items to bottom</Text>
        <Switch
          value={addNewItemsBottom}
          onValueChange={setAddNewItemsBottom}
        />
      </View>

      <View style={styles.optionRow}>
        <Text>Move ticked items to bottom</Text>
        <Switch
          value={moveTickedItemsBottom}
          onValueChange={setMoveTickedItemsBottom}
        />
      </View>
      <View style={styles.optionRow}>
        <Text>Display rich link previews</Text>
        <Switch
          value={DisplayRich}
          onValueChange={setDisplayRich}
        />
      </View>

      <TouchableOpacity style={styles.touchableText}>
        <Text>99</Text>
        <Text>System default</Text>
      </TouchableOpacity>

      {/* Reminder Defaults Section */}
      <Text style={styles.sectionHeading}>Reminder defaults</Text>

      <TouchableOpacity 
        style={styles.timeOption}
        onPress={() => {
          setCurrentTimeType('Morning');
          setTimePickerVisible(true);
        }}
      >
        <Text>Morning</Text>
        <Text>{reminderTimes.Morning}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.timeOption}
        onPress={() => {
          setCurrentTimeType('Afternoon');
          setTimePickerVisible(true);
        }}
      >
        <Text>Afternoon</Text>
        <Text>{reminderTimes.Afternoon}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.timeOption}
        onPress={() => {
          setCurrentTimeType('Evening');
          setTimePickerVisible(true);
        }}
      >
        <Text>Evening</Text>
        <Text>{reminderTimes.Evening}</Text>
      </TouchableOpacity>

      <Text style={styles.sectionHeading}>Reminder defaults</Text>
      <View style={styles.optionRow}>
        <Text>Enable sharing</Text>
        <Switch
          value={EnableSharing}
          onValueChange={setEnableSharing}
        />
      </View>


      {/* Time Picker Modal */}
      {isTimePickerVisible && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  NavHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  mainHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 13,
  },
  sectionHeading: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  touchableText: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  timeOption: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom:5,
  },
});