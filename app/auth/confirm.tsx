import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function ConfirmEmailScreen() {
  const { token_hash, type } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const confirmEmail = async () => {
      if (type === 'email' && typeof token_hash === 'string') {
        const { error } = await supabase.auth.verifyOtp({
          type: 'email',
          token_hash,
        });

        if (error) {
          console.error('Email confirmation failed:', error.message);
        } else {
          console.log('Email confirmed!');
          router.replace('/sign-in'); // or wherever you want to redirect
        }
      }
    };

    confirmEmail();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator />
      <Text>Confirming your email...</Text>
    </View>
  );
}