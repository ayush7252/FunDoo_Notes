import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import { firestore } from '../Firebase/Api';
import { auth } from '../Firebase/Api';
import { ActivityIndicator } from 'react-native';


export const CustomDrawerContent = props=> {
  const [ActiveScreen, setActiveScreen] = useState('Home')
  const [Labels, setLabels] = useState([])
  const [logoutLoading, setLogoutLoading] = useState(false);

  // for logout button
  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await auth.signOut();
      props.navigation.navigate('LoginScreen');
    } catch (error) {
      Alert.alert('Logout Failed', 'Unable to logout. Please try again.');
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleScreenSelect = (screen : any) => {
    setActiveScreen(screen);
    props.navigation.navigate(screen); 
  };

  // For labels
  const fetchLabels = () => {
    const unsubscribe = firestore
      .collection('labels')
      .onSnapshot(
        snapshot => {
          const data = snapshot.docs.map(doc => ({
            id: doc.id, 
            ...doc.data(), 
          }));
          setLabels(data); 
        }
      );
    return unsubscribe;
  };
  useEffect(() => {
    const unsubscribe = fetchLabels(); 
    return () => unsubscribe();
  }, []);
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}>
      <View style={styles.drawerHeader}>
        <Text style={[styles.headerText]}>
          <Text style={{color:'blue'}}>F</Text>
          <Text style={{color:'red'}}>u</Text>
          <Text style={{color:'#fcbf49'}}>n</Text>
          <Text style={{color:'blue'}}>D</Text>
          <Text style={{color:'green'}}>o</Text>
          <Text style={{color:'red'}}>o</Text>
          <Text> </Text>
          Notes
          </Text>
      </View>
      <DrawerItem
        label="Notes"
        icon={({color, size}) => <Icon name="lightbulb-outline" size={size} color={color} />}
        onPress={() => handleScreenSelect('Home')}
        style={[styles.drawerItem, ActiveScreen === 'Home' && styles.selectedItem]}
      />

      <DrawerItem
        label="Reminders"
        icon={({color, size}) => (
          <Icon name="notifications" size={size} color={color} />
        )}
        onPress={() => handleScreenSelect('Reminders')}
        style={[styles.drawerItem, ActiveScreen === 'Reminders' && styles.selectedItem]}
      />
      <View style={styles.divideLine}></View>
      <Text>LABELS</Text>
      {Labels.map((item) => (
        <DrawerItem
          label={item.name} 
          icon={({ color, size }) => <Icon name="label-outline" size={size} color={color} />}
          onPress={() => handleScreenSelect(item.name)} 
          style={[styles.drawerItem, ActiveScreen === item.name && styles.selectedItem]}
        />
      ))}
      <DrawerItem
        label="Create new label"
        icon={({color, size}) => (
          <Icon name="add" size={size} color={color} />
        )}
        onPress={() => handleScreenSelect('CreateNew')}
        style={[styles.drawerItem, ActiveScreen === 'CreateNew' && styles.selectedItem]}
      />
      <View style={styles.divideLine}></View>
      <DrawerItem
        label="Archive"
        icon={({color, size}) => (
          <Icon name="archive" size={size} color={color} />
        )}
        onPress={() => handleScreenSelect('Archive')}
        style={[styles.drawerItem, ActiveScreen === 'Archive' && styles.selectedItem]}
      />
      <DrawerItem
        label="Deleted"
        icon={({color, size}) => (
          <Icon name="delete" size={size} color={color} />
        )}
        onPress={() => handleScreenSelect('Delete')}
        style={[styles.drawerItem, ActiveScreen === 'Delete' && styles.selectedItem]} 
      />
      <View style={styles.divideLine}></View>
      <DrawerItem
        label="Settings"
        icon={({color, size}) => (
          <Icon name="settings" size={size} color={color} />
        )}
        onPress={() => handleScreenSelect('Setting')}
        style={[styles.drawerItem, ActiveScreen === 'Setting' && styles.selectedItem]}
      />
      <DrawerItem
        label="Help & Feedback"
        icon={({color, size}) => (
          <Icon name="help" size={size} color={color} />
        )}
        onPress={() => handleScreenSelect('Help')}
        style={[styles.drawerItem, ActiveScreen === 'Help' && styles.selectedItem]}
      />

<View style={styles.footer}>
        <TouchableOpacity
          onPress={handleLogout}
          disabled={logoutLoading}
          style={styles.logoutButton}
        >
          {logoutLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Icon name="exit-to-app" size={20} color="white" />
              <Text style={styles.logoutText}>Logout</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Add more drawer items as needed */}
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  drawerItem: {
    marginTop:3
  },
  selectedItem: {
    backgroundColor: '#a2d2ff',
    height: 48,
  },
  divideLine: {
    borderBottomWidth:1,
    borderColor:'lightgrey',
    marginBottom:6,
    marginLeft:45,
    marginTop:3
  },
  footer: {
    marginTop: 'auto', // This pushes the footer to bottom
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    justifyContent: 'center',
    gap: 8,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});


const headerStyles = StyleSheet.create({
  container: {},
  header: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    margin: 15,
    borderWidth: 1,
    borderRadius: 50,
    marginTop: 50,
  },
  input: {
    flex: 1,
    paddingLeft:10,
    fontSize: 16,
  },
  iconContainer: {},
  
});
