import * as React from 'react';
import { View, Image, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { validateEmail } from '../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaskedTextInput } from 'react-native-mask-text';
import FontAwesomeIcon from '@expo/vector-icons/FontAwesome6';
import * as ImagePicker from 'expo-image-picker';
import { ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import Checkbox from 'expo-checkbox';

function Profile({navigation}) {
    const [storedUserData, setStoredUserData] = React.useState({
        firstName: '',
        lastName: '',
        mail: '',
        phone: '',
        imagePath: ''
    });

    const [name, onChangeName] = React.useState('');
    const [isNameValid, setIsNameValid] = React.useState(true);
    const [email, onChangeEmail] = React.useState('');
    const [isMailValid, setIsMailValid] = React.useState(true);
    const [nameErrorText, setNAmeErrorText] = React.useState('');
    const [lastNameErrorText, setLastNameErrorText] = React.useState('');
    const [phone, onChangePhone] = React.useState('');
    const [isPhoneValid, setIsPhoneValid] = React.useState(true);
    const [imagePath, setImagePath] = React.useState('');
    const [imageText, setImageText] = React.useState('');
    const [lastName, onChangeLastName] = React.useState('');
    const [isLastNameValid, setIsLastNameValid] = React.useState(true);

    const [preferences, setPreferences] = React.useState({
        orderStatus: false,
        passwordChanges: false,
        specialOffers: false,
        newsletter: false,
    });
    const [savedPreferences, setSavedPreferences] = React.useState({
        orderStatus: false,
        passwordChanges: false,
        specialOffers: false,
        newsletter: false,
    });

    const updateState = (key) => () =>
        setPreferences((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));


    const Avatar = ({ path, text }) => (
        <View style={styles.profileImage}>
            {
                path ?
                    <Image source={{ uri: path }} style={styles.profileImage} /> :
                    <Text>{text}</Text>
            }
        </View>
    )

    React.useEffect(() => {
        (async () => {
            try {
                let loadedUserData = await AsyncStorage.getItem("userData");
                if (loadedUserData != null) {
                    loadedUserData = JSON.parse(loadedUserData);
                    if (loadedUserData.firstName) handleNameEdit(loadedUserData.firstName);
                    if (loadedUserData.lastName) handleLastNameEdit(loadedUserData.lastName);
                    if (loadedUserData.mail) handleMailEdit(loadedUserData.mail);
                    if (loadedUserData.phone) handlePhoneEdit(loadedUserData.phone);
                    if (loadedUserData.imagePath) setImagePath(loadedUserData.imagePath);

                    setStoredUserData({
                        firstName: loadedUserData.firstName,
                        lastName: loadedUserData.lastName,
                        mail: loadedUserData.mail,
                        phone: loadedUserData.phone,
                        imagePath: loadedUserData.imagePath
                    });

                    // Setting the image
                    calculateImageText(loadedUserData.imagePath, loadedUserData.lastName, loadedUserData.firstName);

                    const loadedPref = await AsyncStorage.getItem("preferences");
                    setPreferences(loadedPref === null ? [] : JSON.parse(loadedPref));
                    setSavedPreferences(loadedPref === null ? [] : JSON.parse(loadedPref));
                }
            }
            catch (err) { console.log(err); }
        })();
    }, []);

    function calculateImageText(path, lName, fName) {
        if (path === '') {
            if (lName === '') {
                setImageText(fName.substring(0, 2));
            }
            else {
                setImageText(fName.substring(0, 1) + lName.substring(0, 1));
            }
        }
    }
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImagePath(result.assets[0].uri);
        }
    };

    const removeImage = () => {
        setImagePath('');
        calculateImageText('', lastName, name)
    }

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
    const handleLastNameEdit = (text) => {
        onChangeLastName(text);
        if (text.match(/^[A-Za-z]+$/)) {
            setIsLastNameValid(true);
            setLastNameErrorText('');
        }
        else {
            setIsLastNameValid(false);
            setLastNameErrorText('Please insert your last name (in letters)');
        }
    }
    const handleMailEdit = (text) => {
        onChangeEmail(text);
        if (validateEmail(text)) setIsMailValid(true);
        else setIsMailValid(false);
    }
    const handlePhoneEdit = (text) => {
        onChangePhone(text);
        if (text.length === 10) setIsPhoneValid(true);
        else setIsPhoneValid(false);
    }

    const discardChanges = () => {
        handleNameEdit(storedUserData.firstName);
        handleLastNameEdit(storedUserData.lastName);
        handlePhoneEdit(storedUserData.phone);
        handleMailEdit(storedUserData.mail);
        setImagePath(storedUserData.imagePath);
        calculateImageText(storedUserData.imagePath, storedUserData.lastName, storedUserData.firstName);
        setPreferences(savedPreferences);
        Toast.show({
            type: 'success',
            text1: 'Updates discarded',
            text2: 'Data updated you made were discarded'
        });
    }

    const saveChanges = async () => {
        try {
            Toast.show({
                type: 'info',
                text1: 'Updating',
                text2: 'Updating your information'
            });
            let userData = {
                firstName: name,
                lastName: lastName,
                mail: email,
                phone: phone,
                imagePath: imagePath
            };
            const savedPref = JSON.stringify(preferences)
            await AsyncStorage.setItem("userData", JSON.stringify(userData));
            await AsyncStorage.setItem("preferences", savedPref);
            setStoredUserData(userData);
            Toast.show({
                type: 'success',
                text1: 'Updated',
                text2: 'Data updated successfully 👋'
            });
        }
        catch (err) {
            Toast.show({
                type: 'error',
                text1: 'Not able to update',
                text2: 'Sorry there was an issue, please try again later'
            });
        }
    }
    const logout = async () => {
        try {
            await AsyncStorage.removeItem("userData");
            await AsyncStorage.removeItem("preferences");
            await AsyncStorage.removeItem("isOnboardingCompleted");
            Toast.show({
                type: 'success',
                text1: 'Logged Out',
                text2: 'Logged out successfully'
            });
            setInterval(() => {
                navigation.push('Onboarding');
            }, 1000);
        }
        catch (err) {
            Toast.show({
                type: 'error',
                text1: 'Not able to log out',
                text2: 'Sorry there was an issue, please try again later'
            });
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'position'}>

                    <View style={styles.navbar}>
                        <Pressable>
                            <FontAwesomeIcon
                                name="arrow-alt-circle-left"
                                size={40}
                                color="#495E57" />
                        </Pressable>
                        <Image
                            style={styles.logo}
                            source={require('../assets/Logo.png')}
                            resizeMode='contain'
                            accessible={true}
                            accessibilityLabel={'Little Lemon Logo'}
                        />
                        <Avatar path={storedUserData.imagePath} text={imageText} />
                    </View>
                    <View style={{ marginVertical: 20 }}>
                        <Text style={styles.text}>Personal Information</Text>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ fontSize: 16 }}>Avatar</Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: 10
                                }}>
                                <Avatar path={imagePath} text={imageText} />
                                <Pressable style={styles.button} onPress={pickImage}>
                                    <Text style={styles.buttonText}>Change</Text>
                                </Pressable>
                                <Pressable style={styles.buttonSecondary} onPress={removeImage}>
                                    <Text style={styles.buttonTextSecondary}>Remove</Text>
                                </Pressable>
                            </View>
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ fontSize: 16 }}>First Name</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder='Type your first name'
                                value={name}
                                onChangeText={text => handleNameEdit(text)}
                                maxLength={100}
                                keyboardType='default' />
                            <Text style={{ color: '#DC4C64' }}>{nameErrorText}</Text>
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ fontSize: 16 }}>Last Name</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder='Type your last name'
                                value={lastName}
                                onChangeText={text => handleLastNameEdit(text)}
                                maxLength={100}
                                keyboardType='default' />
                            <Text style={{ color: '#DC4C64' }}>{lastNameErrorText}</Text>
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ fontSize: 16 }}>Email</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder='Type your email'
                                value={email}
                                onChangeText={text => handleMailEdit(text)}
                                maxLength={50}
                                keyboardType='email-address' />
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ fontSize: 16 }}>Phone Number</Text>
                            <MaskedTextInput
                                style={styles.textInput}
                                placeholder='Type your phone number'
                                mask='(999) 999-9999'
                                value={phone}
                                onChangeText={(text, rawText) => handlePhoneEdit(rawText)}
                                keyboardType='number-pad' />
                        </View>
                    </View>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={styles.text}>Email Notifications</Text>
                        <Pressable style={{ flexDirection: 'row', alignItems: 'center' }} onPressIn={updateState('orderStatus')}>
                            <Checkbox
                                value={preferences.orderStatus}
                                onValueChange={updateState('orderStatus')}
                            />
                            <Text style={{ fontSize: 16, paddingHorizontal: 10 }}>Order statuses</Text>
                        </Pressable>
                        <Pressable style={{ flexDirection: 'row', alignItems: 'center' }} onPressIn={updateState('passwordChanges')}>
                            <Checkbox
                                value={preferences.passwordChanges}
                                onValueChange={updateState('passwordChanges')}
                            />
                            <Text style={{ fontSize: 16, paddingHorizontal: 10 }}>Password Changes</Text>
                        </Pressable>
                        <Pressable style={{ flexDirection: 'row', alignItems: 'center' }} onPressIn={updateState('specialOffers')}>
                            <Checkbox
                                value={preferences.specialOffers}
                                onValueChange={updateState('specialOffers')}
                            />
                            <Text style={{ fontSize: 16, paddingHorizontal: 10 }}>Special Offers</Text>
                        </Pressable>
                        <Pressable style={{ flexDirection: 'row', alignItems: 'center' }} onPressIn={updateState('newsletter')}>
                            <Checkbox
                                value={preferences.newsletter}
                                onValueChange={updateState('newsletter')}
                            />
                            <Text style={{ fontSize: 16, paddingHorizontal: 10 }}>Newsletter</Text>
                        </Pressable>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <Pressable
                            style={styles.buttonSecondary}
                            onPressIn={discardChanges}>
                            <Text style={styles.buttonTextSecondary}>Discard</Text>
                        </Pressable>
                        <Pressable
                            style={() => isNameValid && isMailValid && isPhoneValid && isLastNameValid ? styles.button : styles.buttonDisabled}
                            disabled={!isNameValid || !isMailValid || !isPhoneValid || !isLastNameValid}
                            onPressIn={saveChanges}>
                            <Text style={styles.buttonText}>Save</Text>
                        </Pressable>
                    </View>
                    <Pressable
                        style={styles.buttonLogout}
                        onPressIn={logout}>
                        <Text style={styles.buttonTextSecondary}>Log Out</Text>
                    </Pressable>
                </KeyboardAvoidingView>
            </ScrollView>
            <Toast />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 40,
        paddingHorizontal: 20,
        backgroundColor: 'white'
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: 'EDEFEE',
        padding: 10,
        borderBottomWidth: 0.2
    },
    logo: {
        width: 185,
        height: 40,
        alignSelf: 'center'
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 50,
        backgroundColor: '#EE9972',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    textInput: {
        marginTop: 10,
        padding: 10,
        fontSize: 14,
        borderRadius: 10,
        borderWidth: 2,
    },
    button: {
        backgroundColor: "#3e524b",
        borderRadius: 10,
    },
    buttonSecondary: {
        borderColor: "#3e524b",
        borderWidth: 1
    },
    buttonDisabled: {
        backgroundColor: "grey",
        borderRadius: 10,
    },
    buttonLogout: {
        backgroundColor: "#F4CE14",
        borderRadius: 10,
        marginVertical: 20,
    },
    buttonText: {
        fontSize: 18,
        padding: 40,
        paddingVertical: 10,
        textAlign: 'center',
        color: 'white',
    },
    buttonTextSecondary: {
        fontSize: 18,
        padding: 20,
        paddingVertical: 10,
        textAlign: 'center',
        color: '#333333',
    },
})

export default Profile;