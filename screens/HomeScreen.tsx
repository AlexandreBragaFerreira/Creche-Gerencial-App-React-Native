import React from 'react';
import { SafeAreaView, View, Image, StyleSheet, Text } from 'react-native';
import TitleSubtitle from '../components/TitleSubtitle';
import Card from '../components/Card';


const HomeScreen = ({ navigation }: any) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            {/* Header com a imagem pequena e título */}
            <SafeAreaView style={styles.headerContainer}>
                <Image
                    source={require('../assets/brand_icon.png')}
                    style={styles.smallIcon}
                />
                <TitleSubtitle
                    title="Início"
                    subtitle="Gerencie todo o sistema de um só lugar"
                    alignment="left"
                />
            </SafeAreaView>

            <View style={styles.gridContainer}>
                <Card
                    icon={require('../assets/icons/user.png')}
                    title="Usuários"
                    subtitle="Gerenciar usuários" route={'ManageUsers'} navigation={navigation} />
                <Card
                    icon={require('../assets/icons/user.png')}
                    title="Agendamentos"
                    subtitle="Gerenciar agendamentos" route={'ManageAgendamentos'} navigation={navigation} />
                <Card
                    icon={require('../assets/icons/user.png')}
                    title="Turmas"
                    subtitle="Gerenciar turmas" route={'ManageClass'} navigation={navigation} />
                <Card
                    icon={require('../assets/icons/user.png')}
                    title="Crianças"
                    subtitle="Gerenciar crianças" route={'ManageChildren'} navigation={navigation} />
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'column',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        backgroundColor: '#ffffff',
        gap: 10,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 10,
    },
    smallIcon: {
        width: 26,
        height: 26,
        resizeMode: 'contain',
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        padding: 20,
    },
});

export default HomeScreen;
