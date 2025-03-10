import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'

import notifee from '@notifee/react-native';

const NotificationDemo = () => {
    async function onDisplayNotification() {
        await notifee.requestPermission()
    
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
        });
        await notifee.displayNotification({
          title: 'Notification Title',
          body: 'Main body content of the notification',
          android: {
            channelId, 
            pressAction: {
              id: 'default',
            },
          },
        });
      }
  return (
    <View>
      <Text>NotificationDemo</Text>
      <Button title="Display Notification" onPress={() => onDisplayNotification()} />
    </View>
  )
}

export default NotificationDemo

const styles = StyleSheet.create({})