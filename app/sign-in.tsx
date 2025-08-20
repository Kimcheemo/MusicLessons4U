import { View, Text, Alert } from "react-native"
import { Button, Input } from "@rneui/themed"
import { useRouter } from "expo-router"
import { useState } from "react"
import { supabase } from '@/lib/supabase'

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function signInWithEmail() {
    setLoading(true);

    // Use Supabase Auth to sign in w/ stored password
    const { data: sessionData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      Alert.alert(loginError.message);
      setLoading(false);
      return;
    }

    if (!sessionData?.user) {
      Alert.alert("Unexpected error: no user found")
      setLoading(false);
      return;
    }

    // Extracts authenticated user's ID from the session object returned by Supabase after a successful login
    const userId = sessionData.user.id;

    // Check if the user already has a record in the Students table
    // Looks for a Student entry where user_id matches the Auth user ID
    const { data: studentData, error: studentError } = await supabase
      .from('Students')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()

    // console.log("Student record:", studentData);
    // console.log("userId:", userId);
    // console.log("studentData:", studentData);
    // console.log("studentError:", studentError);

    if (studentError && studentError.code !== 'PGRST116') { // PGRST116 = no rows
      Alert.alert(studentError.message);
      setLoading(false);
      return;
    }

    setLoading(false);

    if (!studentData) {
      // First-time login → go to profile setup
      router.replace('/student-signup-profile');
    } else {
      // Existing user → go to main app
      router.replace('/(tabs)/home');
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Sign In</Text>

      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <Input
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button
        title={loading ? "Signing in..." : "Login"}
        disabled={loading}
        onPress={signInWithEmail} // call the function here
      />
    </View>
  )
}
