import { StyleSheet, Text, View, TextInput, Pressable, FlatList, ScrollView, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { addDoc, collection, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { app, database, storage } from './firebase.js'
import MapView, { Marker } from 'react-native-maps'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export default function NoteComponent({ route, navigation }) {
    const [note, setNote] = useState(route.params.text ?? '');
    const [marker, setMarker] = useState(route.params.marker ?? null);
    const [region, setRegion] = useState({ latitude: marker.latitude, longitude: marker.longitude, latitudeDelta: 0.5, longitudeDelta: 0.5 })
    const [imagePath, setImagePath] = useState(null);

    useEffect(() => {
        downloadBillede(route.params.id);
    }, [])

    const save = async () => {
        await updateDoc(
            doc(database, "notes", route.params.id), {
            text: note
        })
        navigation.goBack()
    }

    const downloadBillede = async (id) => {
        getDownloadURL(ref(storage, `${id}.jpeg`))
            .then(url => {
                setImagePath(url)
            }).catch(e => {
                alert("fejl i billede hentning" + e)
            })

    }

    return (
        <View>
            <TextInput style={styles.note} value={note} onChangeText={setNote} ></TextInput>
            <Pressable style={styles.button} onPress={save}>
                <Text style={styles.buttonText}>Edit titel</Text>
            </Pressable>
            <MapView
                region={region}
                style={styles.map}
            >
                <Marker
                    coordinate={marker}
                />
            </MapView>
            {imagePath && (
                <Image style={styles.image} source={{ uri: imagePath }} />
            )}
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
    },
    button: {
        backgroundColor: '#2f6feb',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 10,
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
    list: {
        flex: 1,
        marginTop: 24,
    },
    note: {
        fontSize: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 14,
        marginBottom: 8,
        marginTop: 100,
        marginHorizontal: 10
    },
    map: {
        width: "90%",
        height: "40%",
        margin: "15",
        alignItems: "center",
        borderRadius: "7%",
        overflow: "hidden"
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 8,
        backgroundColor: '#eee',
        marginBottom: 8,
        alignSelf: "center"
    },
});