import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import { Alert } from "react-native";

export default function AuthCallback() {
  const router = useRouter();

  const handleRedirect = async (url?: string) => {
    try {
      const redirectUrl = url || (await Linking.getInitialURL());
      if (!redirectUrl) return;

      // @ts-ignore
      const { data, error } = await supabase.auth.getSessionFromUrl({
        storeSession: true,
        url: redirectUrl,
      });

      if (error) {
        Alert.alert("Error", error.message);
        return;
      }

      router.replace("/student-signup-profile");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  useEffect(() => {
    handleRedirect(); // cold start
    const subscription = Linking.addEventListener('url', (event) => {
      handleRedirect(event.url); // app already open
    });
    return () => subscription.remove();
  }, []);

  return null;
}
