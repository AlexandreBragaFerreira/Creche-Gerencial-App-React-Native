import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface ButtonProps {
    text: string;
    onPress: () => void;
    backgroundColor?: string;
    style?: ViewStyle;
}

const Button: React.FC<ButtonProps> = ({ text, onPress, backgroundColor = '#fe0000', style }) => {
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor }, style]}
            onPress={onPress}
        >
            <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 20,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontFamily: 'Inter',
        fontWeight: '700',
    },
});

export default Button;
