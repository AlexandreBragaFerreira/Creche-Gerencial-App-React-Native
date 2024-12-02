import React from 'react';
import { TextInput, Text, View, StyleSheet, KeyboardTypeOptions } from 'react-native';

interface InputFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    placeholder: string;
    keyboardType: KeyboardTypeOptions | undefined;
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    value,
    onChangeText,
    secureTextEntry = false,
    placeholder,
    keyboardType
}) => {
    return (
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{label}</Text>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={value}
                keyboardType={keyboardType}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        width: '100%',
        marginBottom: 5,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#000',
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        color: 'black',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
    },
});

export default InputField;
