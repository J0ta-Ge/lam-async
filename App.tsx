import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Pressable, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

type Stream = {
  id: string;
  titulo: string;
}

export default function App() {

  const [stream, setStream] = useState<Stream[]>([]);
  const [anotacao, setAnotacao] = useState('');

  useEffect(() =>{
    carregarStreams();
  }, []);

  const salvarStreams = async (newStreams: Stream[]) => {
    try {
      await AsyncStorage.setItem('@streams', JSON.stringify(newStreams));
    } catch (error) {
      console.log('Erro ao salvar streams', error)
    }
  };

  const carregarStreams = async () => {
    try {
      const stored = await AsyncStorage.getItem('@streams');
      if (stored) {
        setStream(JSON.parse(stored) as Stream[])
      }
    } catch (error) {
      console.log('Erro ao carregar streams', error)
    }
  };

  const excluirStream = async () => {
    await AsyncStorage.removeItem('@streams');
    setStream([]);
  }

  const adicionarStream = () => {
    if(anotacao.trim().length > 0){
      const newStreams: Stream[] = [
        ...stream,
        { id: Date.now().toString(), titulo: anotacao }
      ];
      setStream(newStreams);
      salvarStreams(newStreams);
      setAnotacao('');
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      padding: 10,
      marginTop: 50,
      marginBottom: 20,
      backgroundColor: '#fff',
    },
    temaContainer: {
      flexDirection: 'row',
      alignContent: 'center',
      margin: 10,
    },
    temaText: {
      fontSize: 15,
      marginRight: 20,
      color: '#000',
    },
    temaInput: {
      fontSize: 15,
      marginRight: 20,
      backgroundColor: 'yellow',
      width: '50%',
      color: '#000',
    },
    temaTitle: {
      fontSize: 25,
      color: '#000',
    },
    entrada: {
      borderWidth: 1,
      borderColor: '#333',
      backgroundColor: '#aaa',
      color: '#000',
      padding: 10,
      marginBottom: 10,
    },
    nota : {
      fontSize: 16,
      padding: 6,
      borderBottomColor: '#ccc',
      borderBottomWidth: 1,
      color: '#000',
    },
    data: {
      fontSize: 12,
      color: '#555',
    },
    botao: {
      backgroundColor: 'yellow',
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
      marginBottom: 40,
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.temaTitle}>Anotações Gerais</Text>
      <TextInput
        style={styles.entrada}
        placeholder='Digite sua anotação'
        placeholderTextColor={"#000"}
        value={anotacao}
        onChangeText={setAnotacao}
      />
      <Button
        title='Adicionar nota'
        onPress={adicionarStream}
      />

      <FlatList
        data={stream}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.nota}>
              {item.id}
            </Text>
            <Text style={styles.data}>
              {item.titulo}
            </Text>
          </View>
        )}
      />

      <Pressable 
        onPress={excluirStream}
        style={styles.botao}>
        <Text>Apagar Notas</Text>
      </Pressable>

    </View>
  );
}
