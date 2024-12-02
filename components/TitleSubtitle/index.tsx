import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TitleSubtitleProps {
    title: string;
    subtitle: string;
    alignment?: 'center' | 'left';
}

const TitleSubtitle: React.FC<TitleSubtitleProps> = ({ title, subtitle, alignment = 'center' }) => {
    return (
        <View style={[styles.textContainer, alignment === 'center' ? styles.center : styles.left]}>
            {/* Título */}
            <Text style={[styles.title, alignment === 'center' ? styles.center : styles.left]}>
                {title}
            </Text>

            {/* Subtítulo */}
            <Text style={[styles.subtitle, alignment === 'center' ? styles.center : styles.left]}>
                {subtitle}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    textContainer: {
        alignItems: 'center',
        gap: 2,
        width: '100%'
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        color: '#fe0000',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#737373',
        lineHeight: 20,
        width: '75%'
    },
    center: {
        alignItems: 'center',
        textAlign: 'center',
    },
    left: {
        alignItems: 'flex-start',
        textAlign: 'left',
    },
});

export default TitleSubtitle;
