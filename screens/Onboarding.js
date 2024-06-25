import * as React from 'react';
import { View, Image, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { validateEmail } from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import styles from '../assets/styles';

function Onboarding({ navigation }) {
    const [name, onChangeName] = React.useState('');
    const [email, onChangeEmail] = React.useState('');
    const [isNameValid, setIsNameValid] = React.useState(false);
    const [isMailValid, setIsMailValid] = React.useState(false);
    const [nameErrorText, setNAmeErrorText] = React.useState('');

    const handleNameEdit = (text) => {
        onChangeName(text);
        if (text.match(/^[A-Za-z]+$/)) {
            setIsNameValid(true);
            setNAmeErrorText('');
        }
        else {
            setIsNameValid(false);
            setNAmeErrorText('Please insert your first name (in letters)');
        }
    }
    const handleMailEdit = (text) => {
        onChangeEmail(text);
        if (validateEmail(text)) setIsMailValid(true);
        else setIsMailValid(false);
    }
    const handleSubscribeRequest = () => {
        try {
            let userData = { firstName: name, lastName: '', mail: email, phone: '', imagePath: '' };
            AsyncStorage.setItem("userData", JSON.stringify(userData));
            AsyncStorage.setItem("isOnboardingCompleted", 'true');
            let preferences = {
                orderStatus: true,
                passwordChanges: true,
                specialOffers: true,
                newsletter: true,
            };
            AsyncStorage.setItem("preferences", JSON.stringify(preferences));
            Toast.show({
                type: 'success',
                text1: 'Logging in',
                text2: 'Thanks for signing up 👋'
            });
            let wentToNewTab = false;
            setInterval(() => {
                if (!wentToNewTab) {
                    navigation.push('Home');
                    wentToNewTab = true
                }
            }, 1000);
        }
        catch (err) {
            Toast.show({
                type: 'error',
                text1: 'Not able to log in',
                text2: 'Sorry there was an issue, please try again later'
            });
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'position'}>
            <Image
                style={styles.logo}
                source={require('../assets/Logo.png')}
                resizeMode='contain'
                accessible={true}
                accessibilityLabel={'Little Lemon Logo'}
            />
            <View style={{ marginVertical: 20 }}>
                <Text style={styles.sectionTitle}>Let us get to know you</Text>
            </View>
            <View style={{ marginVertical: 40 }}>
                <Text style={{ fontSize: 20 }}>First Name</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder='Type your first name'
                    value={name}
                    onChangeText={text => handleNameEdit(text)}
                    maxLength={100}
                    keyboardType='default' />
                <Text style={{ color: '#DC4C64' }}>{nameErrorText}</Text>
                <View style={{ marginTop: 40 }}>
                    <Text style={{ fontSize: 20 }}>Email</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder='Type your email'
                        value={email}
                        onChangeText={text => handleMailEdit(text)}
                        maxLength={50}
                        keyboardType='email-address' />
                </View>
            </View>
            <Pressable
                style={() => isNameValid && isMailValid ? styles.buttonPrimary : styles.buttonDisabled}
                disabled={!isNameValid || !isMailValid}
                onPressIn={handleSubscribeRequest}>
                <Text style={styles.buttonText}>Next</Text>
            </Pressable>
            <Toast />
        </KeyboardAvoidingView>
    )
}

export default Onboarding;