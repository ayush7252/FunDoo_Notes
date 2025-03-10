import { firebase } from '@react-native-firebase/app';  
import '@react-native-firebase/firestore';
import { getAuth } from '@react-native-firebase/auth';
import { initializeApp } from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY', 
  authDomain: 'fundonotes-79be7.firebaseapp.com', 
  projectId: 'fundonotes-79be7',
  storageBucket: 'fundonotes-79be7.appspot.com',
  messagingSenderId: '164221075327',
  appId: '1:164221075327:android:f7f7a33ba61512f359644a', 
};

if (!firebase.apps.length) {
  var app = firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); 
}


export const auth = getAuth(app);
export const firestore = firebase.firestore();
