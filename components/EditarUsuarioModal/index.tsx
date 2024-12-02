import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../hooks/useApi';
import InputField from '../InputField';
import { AtualizarUsuarioDto, UsuarioDto } from '../../types/services/usuarios';

interface EditUsuarioModalProps {
  isVisible: boolean;
  onClose: () => void;
  selectedUsuario: UsuarioDto | null;
}

const EditUsuarioModal: React.FC<EditUsuarioModalProps> = ({
  isVisible,
  onClose,
  selectedUsuario,
}) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cargo, setCargo] = useState('');
  const [ativo, setAtivo] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedUsuario) {
      setNome(selectedUsuario.nome);
      setEmail(selectedUsuario.email);
      setCargo(selectedUsuario.cargo);
      setAtivo(selectedUsuario.ativo);
    }
  }, [selectedUsuario]);

  const handleSaveUsuario = async () => {
    if (!nome || !email || !cargo || !selectedUsuario) return;

    const updatedUsuario: AtualizarUsuarioDto = {
      id: selectedUsuario.id,
      nome,
      email,
      cargo,
      ativo,
    };

    try {
      setLoading(true);
      // Atualizar o usuário
      await axios.put(`/api/Usuario/${selectedUsuario.id}`, updatedUsuario, {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem('@authToken')}`,
        },
      });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Editar Usuário</Text>
          <InputField
            label="Nome"
            value={nome}
            onChangeText={setNome}
            placeholder="Nome"
            keyboardType="default"
          />
          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
          />
          <InputField
            label="Cargo"
            value={cargo}
            onChangeText={setCargo}
            placeholder="Cargo"
            keyboardType="default"
          />
          <View style={styles.toggleContainer}>
            <Text style={styles.label}>Ativo</Text>
            <TouchableOpacity
              style={[styles.toggleButton, ativo ? styles.active : styles.inactive]}
              onPress={() => setAtivo(!ativo)}
            >
              <Text style={styles.toggleButtonText}>{ativo ? 'Ativo' : 'Inativo'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity style={styles.modalButton} onPress={handleSaveUsuario} disabled={loading}>
              <Text style={styles.modalButtonText}>{loading ? 'Salvando...' : 'Salvar'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#900500' }]} onPress={onClose}>
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  toggleButton: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  active: {
    backgroundColor: '#fe0000',
  },
  inactive: {
    backgroundColor: '#900500',
  },
  toggleButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  modalButton: {
    backgroundColor: '#fe0000',
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default EditUsuarioModal;
