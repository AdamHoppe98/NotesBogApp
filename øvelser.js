import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { addDoc, onSnapshot } from 'firebase/firestore'
import * as FBApp from 'firebase/app'
import * as FBStore from 'firebase/firestore'

const app = FBApp.initializeApp({ projectId: 'kort-app' })
const db = FBStore.getFirestore(app)
const markersRef = FBStore.collection(db, 'markers')

const kbh = { latitude: 55.6761, longitude: 12.5683, latitudeDelta: 0.08, longitudeDelta: 0.08 }

export default function App() {
  const [markers, setMarkers] = useState([])

  function visMarkers(snap) {
    setMarkers(snap.docs.map((d) => d.data()))
  }

  async function langtTryk(e) {
    // gem en ny marker, hvor fingeren er
    const marker = e.nativeEvent.coordinate
    setMarkers([...markers,  marker ])
    await addDoc(markersRef, {marker})
    

  }

  // markers fra skyen på kortet, og langtTryk på kortet
    useEffect(() => {
        const unsub = onSnapshot(markersRef, snap => {
            setMarkers(snap.docs.map(d => ({ ...d.data() })));
        });
        return unsub;
    }, []);

  return (
    <View style={{ flex: 1 }}>
      <MapView testID="kort" style={{ flex: 1 }} initialRegion={kbh} onLongPress={langtTryk}>
                {
                    markers.map((m, i) => (
                        <Markers key={i} coordinate={m}/>
                    ))

                }
      </MapView>
    </View>
  )
}
