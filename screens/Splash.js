import { View, Image, StyleSheet } from 'react-native';

function Splash() {
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/Logo.png')}
                resizeMode='contain'
                accessible={true}
                accessibilityLabel={'Little Lemon Logo'}
                style={styles.logo}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    },
    logo: {
        width: 185,
        height: 40,
        alignSelf: 'center'
    },
});

export default Splash;