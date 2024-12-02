import React from 'react';
import { SafeAreaView, View, Image, StyleSheet } from 'react-native';
import TitleSubtitle from '../components/TitleSubtitle';
import Button from '../components/Button';

const WelcomeScreen = ({ navigation }: any) => {
    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={styles.container}>

                {/* Imagem do ícone */}
                <Image
                    source={require('../assets/brand_icon.png')}
                    style={styles.icon}
                />


                <TitleSubtitle
                    title="Bem-vindo(a) ao Gerenciador de Agendamentos!"
                    subtitle="Faça login para acessar as ferramentas de gestão e manter tudo sob controle!"
                    alignment="center"
                />

                <Button
                    text="Começar"
                    onPress={() => navigation.navigate('LoginScreen')}
                    backgroundColor="#fe0000"
                    style={{ marginTop: 60 }}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        padding: 20,
    },
    icon: {
        width: '50%',
        aspectRatio: 1,
        height:'40%'
    },
    button: {
        width: '80%',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fe0000',
        borderRadius: 10,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontFamily: 'Inter',
        fontWeight: '700',
    },
});

export default WelcomeScreen;
