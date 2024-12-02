import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface CardProps {
    icon: any;
    title: string;
    subtitle: string;
    route: string;
    navigation: any;
}

const Card: React.FC<CardProps> = ({ icon, title, subtitle, route, navigation }) => {    

    const handleCardPress = () => {
        navigation.navigate(route);
    };

    return (
        <TouchableOpacity onPress={handleCardPress} style={styles.cardContainer}>
            <View style={styles.iconContainer}>
                <Image source={icon} style={styles.smallIcon} />
            </View>
            <View>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardSubtitle}>{subtitle}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#fe0000',
        borderRadius: 15,
        padding: 20,
        marginBottom: 10,
        width: '48%',
        height: 200,
        justifyContent: 'space-between',
    },
    iconContainer: {
        width: 50,
        height: 50,
        backgroundColor: '#dd0000',
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    smallIcon: {
        width: 26,
        height: 26,
        resizeMode: 'contain',
        tintColor: '#fff',
    },
    cardTitle: {
        fontSize: 18,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    cardSubtitle: {
        fontSize: 12,
        color: '#cccccc',
    },
});

export default Card;
