import { View, Text, Alert } from "react-native"
import { Button, Input } from "@rneui/themed"
import { useRouter } from "expo-router"
import { useState } from "react"
import { supabase } from '@/lib/supabase'

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function signInWithEmail() {
    setLoading(true)

    const { data: sessionData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (loginError) {
      Alert.alert(loginError.message)
      return
    }

    if (!sessionData?.user) {
      Alert.alert("Unexpected error: no user found")
      return
    }

    const userId = sessionData.user.id

    // Check if the user already has a profile in Students table
    const { data: studentData, error: studentError } = await supabase
      .from('Students')
      .select('id')
      .eq('id', userId)
      .single()

    if (studentError && studentError.code !== 'PGRST116') { // PGRST116 = no rows
      Alert.alert(studentError.message)
      return
    }

    if (!studentData) {
      // First-time login → go to profile setup
      router.replace('/student-signup-profile')
    } else {
      // Existing user → go to main app
      router.replace('/(tabs)/home')
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
