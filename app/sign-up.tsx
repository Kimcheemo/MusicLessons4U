import { useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native';
import { supabase } from '@/lib/supabase'
import { Button, Input } from '@rneui/themed'
import { useRouter } from 'expo-router';

export default function SignUp() {
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)   // true: network request starts, false: once request finishes or fails
  const router = useRouter()

  async function signUpWithEmail() {
    console.log("Sign Up button pressed")
    setLoading(true)

    // Make sure fields are filled
    if (!email || !password) {
      Alert.alert("Missing Info", "Please enter both email and password.");
      setLoading(false);
      return;
    }

    // Use Supabase Auth to sign up for an account
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,   // Password is securely stored in Auth tables
    })

    //console.log("signUpData:", signUpData)
    //console.log("signUpError:", signUpError)

    // Supabase catches invalid email addresses
    if (signUpError) {
      const msg = signUpError.message.toLowerCase();

      if (msg.includes("is invalid") || msg.includes("invalid")) {
        Alert.alert("Invalid Email", "Please enter a valid email address.");
      } else {
        Alert.alert("Sign-Up Error", signUpError.message);
      }

      setLoading(false);
      return;
    }

    // Newly created User ID from Supabase after a successful sign-up
    const userId = signUpData.user?.id
    console.log("userId:", userId)

    if (!userId) {
      Alert.alert("Error", "No user ID returned from Supabase");
      setLoading(false);
      return;
    }

    Alert.alert(
      "Success",
      "Please check your inbox for email verification before logging in."
    )

    // Here user should go to their email to verify account. 
    // Email should contain a link that opens a page saying, "You account has been verified. Please login to continue."

    setLoading(false)
    router.replace("/sign-in")
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button title="Sign up" disabled={loading} onPress={signUpWithEmail} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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
})