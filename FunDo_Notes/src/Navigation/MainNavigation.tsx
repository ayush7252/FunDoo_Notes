import React from 'react';
import {StatusBar} from 'react-native';

// navigation
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {CustomDrawerContent, CustomHeader} from '../Components/CustomDrawer';

// Screens
import HomeScreen from '../Screens/HomeScreen';
import RemindersScreen from '../Screens/RemindersScreen';
import CreateNewScreen from '../Screens/CreateNewScreen';
import ArchiveScreen from '../Screens/ArchiveScreen';
import DeleteScreen from '../Screens/DeleteScreen';
import HelpScreen from '../Screens/HelpScreen';
import SettingScreen from '../Screens/SettingScreen';
import ImageScreen from '../BtnScreens/ImageScreen';
import DrawingScreen from '../BtnScreens/DrawingScreen';
import ListScreen from '../BtnScreens/ListScreen';
import TextScreen from '../BtnScreens/TextScreen';
import LoginScreen from '../Screens/LoginScreen';
import SignupScreen from '../Screens/SignUpScreen';
import SplashScreen from '../Screens/SplashScreen';

const Drawer = createDrawerNavigator();

const MainNavigation = () => {
  return (
    <NavigationContainer>
      <StatusBar translucent backgroundColor="transparent" />
      <Drawer.Navigator
        initialRouteName="SplashScreen"
        drawerContent={props => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerType: 'front',
          overlayColor: 'transparent',
          drawerStyle: {
            width: 270,
            backgroundColor: '#fff',
          },
        }}>
        <Drawer.Screen name="Home" component={HomeScreen}  options={{headerShown:false}}/>
        <Drawer.Screen
          name="Reminders"
          component={RemindersScreen}
          options={{headerShown: true}}
        />
        <Drawer.Screen name="CreateNew" component={CreateNewScreen} />
        <Drawer.Screen
          name="Archive"
          component={ArchiveScreen}
          options={{headerShown: true}}
        />
        <Drawer.Screen
          name="Delete"
          component={DeleteScreen}
          options={{headerShown: true}}
        />
        <Drawer.Screen name="Setting" component={SettingScreen} />
        <Drawer.Screen name="Help" component={HelpScreen} options={{headerShown: true}} />
        <Drawer.Screen
          name="Image"
          component={ImageScreen}
          options={{
            headerShown: false,
            cardOverlayEnabled: true,
          }}
        />
        <Drawer.Screen
          name="DrawingScreen"
          component={DrawingScreen}
          options={{headerShown: false}}
        />
        <Drawer.Screen
          name="ListScreen"
          component={ListScreen}
          options={{headerShown: false}}
        />
        <Drawer.Screen
          name="TextScreen"
          component={TextScreen}
          options={{headerShown: false}}
        />
        <Drawer.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Drawer.Screen
          name="SignupScreen"
          component={SignupScreen}
          options={{headerShown: false}}
        />
        <Drawer.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{headerShown: false}}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigation;
