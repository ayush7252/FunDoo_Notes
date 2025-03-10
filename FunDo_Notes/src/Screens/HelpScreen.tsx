import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HelpScreen = () => {
  const faqData = [
    {
      id: '1',
      question: 'How to create a new note?',
      answer: 'Tap the + button at the bottom right corner to create a new note. You can add title, content, and set reminders.',
    },
    {
      id: '2',
      question: 'How to organize notes with labels?',
      answer: 'Long press any note to select it, then choose "Label" option to add or create new labels for better organization.',
    },
    {
      id: '3',
      question: 'Can I set reminders for notes?',
      answer: 'Yes! Select any note and tap the reminder icon to set date/time and location-based reminders.',
    },
    {
      id: '4',
      question: 'How to archive notes?',
      answer: 'Swipe left on a note or select multiple notes to archive them. Archived notes can be found in the Archive section.',
    },
    {
      id: '5',
      question: 'Where are deleted notes stored?',
      answer: 'Deleted notes go to the Trash folder and are automatically permanently deleted after 30 days.',
    },
  ];

  const renderFAQItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.faqItem}>
      <Icon name="help" size={24} color="#4c51bf" />
      <View style={styles.faqTextContainer}>
        <Text style={styles.question}>{item.question}</Text>
        <Text style={styles.answer}>{item.answer}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Help & Support</Text>
        <Text style={styles.subtitle}>Frequently Asked Questions</Text>
      </View>

      <FlatList
        data={faqData}
        renderItem={renderFAQItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.contactContainer}>
        <Text style={styles.contactTitle}>Need more help?</Text>
        <View style={styles.contactItem}>
          <Icon name="email" size={20} color="#666" />
          <Text style={styles.contactText}>ayushkumarsingh793@gmail.com</Text>
        </View>
        <View style={styles.contactItem}>
          <Icon name="phone" size={20} color="#666" />
          <Text style={styles.contactText}>+91 7307585258</Text>
        </View>
        <Text style={styles.hoursText}>Available 24/7</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
  },
  faqItem: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },
  faqTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 8,
  },
  answer: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 20,
  },
  listContent: {
    paddingBottom: 24,
  },
  contactContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 24,
    marginTop: 'auto',
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#4a5568',
    marginLeft: 12,
  },
  hoursText: {
    fontSize: 12,
    color: '#a0aec0',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default HelpScreen;