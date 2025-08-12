import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet, Image, Platform } from 'react-native';

export default function Login() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText type="title">Login Screen</ThemedText>
      {/* Your login form goes here */}
    </ThemedView>
  );
}