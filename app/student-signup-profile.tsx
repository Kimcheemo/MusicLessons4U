import { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Input, Button } from '@rneui/themed';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';

export default function StudentSignupProfile() {
  const router = useRouter();

  // State for each input field
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [instrument, setInstrument] = useState('');
  const [experience, setExperience] = useState('');
  const [loading, setLoading] = useState(false);

  const saveProfile = async () => {
    setLoading(true);

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      Alert.alert('Error', 'No logged-in user found');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('profiles').insert([
      {
        id: user.id, // link profile to auth user
        first_name: firstName,
        last_name: lastName,
        age,
        instrument,
        experience,
      },
    ]);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Profile saved!');
      router.push('/'); // navigate somewhere after saving
    }

    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Input label="First Name" value={firstName} onChangeText={setFirstName} placeholder="John" />
      <Input label="Last Name" value={lastName} onChangeText={setLastName} placeholder="Doe" />
      <Input label="Age" value={age} onChangeText={setAge} placeholder="18" keyboardType="numeric" />
      <Input label="Instrument" value={instrument} onChangeText={setInstrument} placeholder="Piano" />
      <Input label="Experience Level" value={experience} onChangeText={setExperience} placeholder="Beginner / Intermediate / Advanced" />
      <Button title="Save Profile" disabled={loading} onPress={saveProfile} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
});


// useEffect(() => {
//   const handleDeepLink = (event: Linking.EventType) => {
//     const url = event.url;
//     const { path } = Linking.parse(url);

//     if (path === "student-signup-profile") {
//       router.push("/student-signup-profile");
//     }
//   };

//   const subscription = Linking.addEventListener("url", handleDeepLink);

//   return () => subscription.remove();
// }, []);
