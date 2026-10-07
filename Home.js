import { StyleSheet, Text, View, TextInput, Pressable, FlatList, ScrollView, Button, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { app, database, storage } from './firebase.js'
import { addDoc, collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import MapView, { Marker } from 'react-native-maps'

export default function Home({ navigation }) {
    const [notes, setNotes] = useState([]);
    const [text, setText] = useState("");
    const [imagePath, setImagePath] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [marker, setMarker] = useState(null);

    const copenhagenRegion = { latitude: 55.7, longitude: 12.55, latitudeDelta: 0.5, longitudeDelta: 0.5 }

    const deleteNote = async (id) => {
        await deleteDoc(doc(database, "notes", id))
    }


    useEffect(() => {
        const unsub = onSnapshot(collection(database, "notes"), snap => {
            setNotes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return unsub;
    }, []);

    const addNote = async (text) => {
        if (!text.trim()) return;
        const docRef = await addDoc(collection(database, "notes"), {
            text: text.trim(),
            marker: marker
        });
        await uploadBillede(docRef.id)
        setText('');
        setMarker(null)

    }

    const hentBillede = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true
        });
        if (!result.canceled) {
            setImagePath(result.assets[0].uri);
        }


    }

    const uploadBillede = async (id) => {
        const res = await fetch(imagePath);
        const blob = await res.blob();
        const storageRef = ref(storage, `${id}.jpeg`)
        uploadBytes(storageRef, blob).then(snapshot => {
            setImagePath(null)
        }).catch(e => {
            alert("Error i upload" + e)
        })
    }

    const downloadBillede = async () => {
        getDownloadURL(ref(storage, "Sunset.jpeg"))
            .then(url => {
                setImagePath(url)
            }).catch(e => {
                alert("fejl i billede hentning" + e)
            })
    }

    function markerOnPress(e) {
        setMarker(e.nativeEvent.coordinate)
    }


    return (
        <View style={styles.container}>
            <View>

                <TextInput
                    placeholder='tilføj en note'
                    onChangeText={setText}
                    value={text}
                    style={styles.input}
                />
                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        pressed && styles.buttonPressed
                    ]}
                    onPress={() => setShowMap(!showMap)}
                >
                    <Text style={styles.buttonText} >Vælg sted</Text>
                </Pressable>
                {
                    showMap &&
                    <MapView
                        style={styles.map}
                        region={copenhagenRegion}
                        onLongPress={markerOnPress}
                    >
                        {
                            marker && <Marker coordinate={marker} />
                        }
                    </MapView>
                }

                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        pressed && styles.buttonPressed
                    ]}
                    onPress={hentBillede}
                    >
                    <Text style={styles.buttonText} >Vælg billed</Text>
                </Pressable>
                    {imagePath && (
                        <Image style={styles.image} source={{ uri: imagePath }} />
                    )}

                <Pressable
                    onPress={() => addNote(text)}
                    style={({ pressed }) => [
                        styles.button,
                        pressed && styles.buttonPressed,
                        !text.trim() && styles.buttonDisabled,
                        !marker && styles.buttonDisabled,
                        !imagePath && styles.buttonDisabled,
                    ]}
                >
                    <Text style={styles.buttonText}>Tilføj note</Text>
                </Pressable>
            </View>


            <FlatList
                data={notes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.note}>
                        <Pressable
                            style={styles.noteText}
                            onPress={() => navigation.navigate('Note', item)}
                        >
                            <Text>{item.text}</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => deleteNote(item.id)}
                            hitSlop={8}
                            style={styles.deleteButton}
                        >
                            <Text style={styles.deleteText}>Slet</Text>
                        </Pressable>
                    </View>
                )}
            />

        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f5',
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        marginBottom: 12,
        marginTop: 40,
    },
    button: {
        backgroundColor: '#2f6feb',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10
    },
    pickButtonPressed: {
        backgroundColor: '#eef2fb',
    },
    pickButtonText: {
        color: '#2f6feb',
        fontSize: 15,
        fontWeight: '600',
    },
    buttonPressed: {
        backgroundColor: '#2555b8',
    },
    buttonDisabled: {
        backgroundColor: '#b9c4d6',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 8,
        backgroundColor: '#eee',
        marginBottom: 8,
        alignSelf: "center"
    },
    pickRow: {
        flexDirection: 'row',
        marginBottom: 16,
        marginTop: 20,
        gap: 8,
    },
    pickButton: {
        flex: 1,   // each button takes an equal third
    },
    list: {
        flex: 1,
        marginTop: 30,
    },
    note: {
        fontSize: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 14,
        marginBottom: 8,
    },
    note: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 14,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    noteText: {
        flex: 1,          // pushes the button to the right edge
    },
    deleteButton: {
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    deleteText: {
        color: '#c0392b',
        fontWeight: '600',
    },
    map: {
        width: "90%",
        height: "50%",
        margin: "15",
        alignItems: "center",
        borderRadius: "7%",
        overflow: "hidden"
    }
});