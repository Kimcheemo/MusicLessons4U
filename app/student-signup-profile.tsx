import { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, TextInput } from 'react-native';
import { Input, Button } from '@rneui/themed';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import SpinnerDatePicker from '@/components/SpinnerDatePicker';


export default function StudentSignupProfile() {
  const router = useRouter();
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // State for each input field
  const [firstName, setFirstName] = useState(''); //required
  const [lastName, setLastName] = useState(''); //required
  const [DOB, setDOB] = useState<Date | null>(null); //optional
  const [phoneNum, setPhoneNum] = useState(null); //optional
  const [prefContact, setPrefContact] = useState(null); //optional
  const [emergencyContact, setEmergencyContact] = useState(null); //optional
  const [parentGuardian, setParentGuardian] = useState(null); //optional

  // next page will be for profile stuff: instrument, bio, photo

  const [loading, setLoading] = useState(false);

  useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    console.log("Session on mount:", data?.session);
  });
}, []);

  const handleSubmit = async () => {

    setLoading(true);

    try {
        const { data, error } = await supabase.auth.getSession();
        const user = data?.session?.user;

        if (!user) {
        Alert.alert('Error', 'User not authenticated.');
        return;
        }

        const userId = user.id;
        const email = user.email;

        const studentData = {
            user_id: user.id,
            first_name: firstName,
            last_name: lastName,
            email_address: user.email,
            date_of_birth: DOB,
            phone_num: phoneNum,
            pref_contact: prefContact,
            emergency_contact: emergencyContact,
            parent_guardians: parentGuardian,
        };

        const { error: insertError } = await supabase
            .from('Students')
            .insert(studentData);

        if (insertError) {
            console.error('Insert failed:', insertError.message);
            Alert.alert('Error', 'Failed to save profile.');
        } else {
            console.log('Student record created successfully!');
            router.push('/success'); // or wherever you want to go next
        }
    } finally {
        setLoading(false);
    }

  };


  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 120 }} keyboardShouldPersistTaps="handled" >
      <View style={{ padding: 16 }}>
        <Input label="First Name" value={firstName} onChangeText={setFirstName} placeholder="John" />
        <Input label="Last Name" value={lastName} onChangeText={setLastName} placeholder="Doe" />
        <SpinnerDatePicker label="Date of Birth (optional)" value={DOB} onChange={setDOB} maximumDate={new Date()} />
        <Input label="Phone Number" value={phoneNum} onChangeText={setPhoneNum} keyboardType="phone-pad" placeholder="Optional" maxLength={15} />
        <Input label="Emergency Contact" value={emergencyContact} onChangeText={setEmergencyContact} keyboardType="phone-pad" placeholder="Optional" maxLength={15} />
        <Input label="Parent Guardian (if applicable)" value={parentGuardian} onChangeText={setParentGuardian} placeholder="Optional" />
        <Button title="Next" disabled={loading} onPress={handleSubmit} />
      </View>
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
