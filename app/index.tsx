import { useState, useEffect } from 'react'
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Alert, AppState, StyleSheet, Image, Platform, View, Modal, TextInput } from 'react-native';
import { supabase } from '@/lib/supabase'
import Auth from '@/components/Auth'
import Account from '@/components/Account'
import { Session } from '@supabase/supabase-js'
import { Button, Input } from '@rneui/themed'
import { router, useRouter } from 'expo-router';

export default function EnterScreen() {

  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState("");

  const handleCheckCode = () => {
    if (code === "1234") { // 🔑 replace with your real code
      setShowModal(false);
      router.push("/sign-up");
    } else {
      alert("Invalid code. Please try again.");
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Title */}
      <View style={styles.titleContainer}>
        <ThemedText type="title">MusicLessons4U</ThemedText>
      </View>

      {/* Buttons */}
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button 
          title="Sign in" 
          onPress={() => router.push("/sign-in")} 
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button 
          title="Sign up" 
          onPress={() => setShowModal(true)} 
        />
      </View>

      {/* Modal popup */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText type="defaultSemiBold">
              Enter signup code
            </ThemedText>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={code}
              onChangeText={setCode}
              placeholder="Enter code"
            />
            <Button title="Submit" onPress={handleCheckCode} />
            <Button
              title="Cancel"
              type="clear"
              onPress={() => setShowModal(false)}
            />
          </View>
        </View>
      </Modal>

    </ThemedView>
  )
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
   modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    width: "100%",
    marginVertical: 12,
  },
})