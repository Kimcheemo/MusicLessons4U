import { useState, useEffect } from 'react'
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Alert, AppState, StyleSheet, Image, Platform, View } from 'react-native';
import { supabase } from '@/lib/supabase'
import Auth from '@/components/Auth'
import Account from '@/components/Account'
import { Session } from '@supabase/supabase-js'
import { Button, Input } from '@rneui/themed'
import { useRouter } from 'expo-router';
import { getApiUrl } from '../src/lib/api'


export default function SignUp() {
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function signUpWithEmail() {
    console.log("Sign Up button pressed")

    setLoading(true)

    // If user object exists, insert into Students table
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    //options: {
    //  emailRedirectTo: Platform.select({
    //    web: "https://musiclessons4u.vercel.app/auth/callback",
    //    default: "musiclessons4u://auth/callback",
    //  }),
    //},
    })

    console.log("signUpData:", signUpData)
    console.log("signUpError:", signUpError)

    if (signUpError) throw new Error(signUpError.message)

    const userId = signUpData.user?.id
    if (!userId) throw new Error("No user ID returned from Supabase")

    console.log("userId:", userId)

    if (!userId) {
      Alert.alert("Error", "No user ID returned from Supabase")
      setLoading(false)
      return
    }

    // 2️⃣ Insert into Students table using anon key + RLS
      const { error: insertError } = await supabase.from('Students').insert([
        {
          user_id: userId,
          email_address: email,
          created_at: new Date(),
        },
      ])

      if (insertError) throw new Error(insertError.message)

      console.log("Student record created successfully")

    Alert.alert(
      "Success",
      "Please check your inbox for email verification before logging in."
    )

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