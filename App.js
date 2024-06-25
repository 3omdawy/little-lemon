import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import OnboardingScreen from './screens/Onboarding';
import Profile from './screens/Profile';
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Splash from './screens/Splash';
import Home from './screens/Home';

const Stack = createStackNavigator();

export default function App() {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const loadedPref = await AsyncStorage.getItem("isOnboardingCompleted");
        setIsOnboardingCompleted(loadedPref === null ? false : true);
      }
      catch (err) { console.log(err); }
      finally { setIsLoading(false); }
    })();
  }, []);

  return (
    isLoading ? <Splash /> : (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
        >
          {isOnboardingCompleted ? (
            <>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            </>) : (
            <>
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
              <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen name="Home" component={Home} />
            </>)
          }
        </Stack.Navigator>
      </NavigationContainer>)
  );
}