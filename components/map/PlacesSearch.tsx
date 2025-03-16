import Colors from '@/constants/Colors'
import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useEffect, useState } from 'react'
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Region } from 'react-native-maps'

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_CLOUD_KEY || 'google-api-key'

interface PlacesSearchProps {
  initialRegion: Region
  setDestinationRegion: (region: Region | undefined) => void
}

const PlacesSearch: React.FC<PlacesSearchProps> = ({ initialRegion, setDestinationRegion }) => {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [chosenSearch, setChosenSearch] = useState('')

  const [results, setResults] = useState([])

  useEffect(() => {
    if (!search || search === chosenSearch) {
      return
    }

    const handler = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)

    return () => clearTimeout(handler)
  }, [search])

  useEffect(() => {
    if (!debouncedSearch) {
      return
    }

    if (debouncedSearch) {
      fetchGooglePlacesResulsts(debouncedSearch)
    }
  }, [debouncedSearch])

  const fetchGooglePlacesResulsts = async (search: string) => {
    const body = {
      input: search,
      locationBias: {
        circle: { center: { latitude: initialRegion.latitude, longitude: initialRegion.longitude }, radius: 10000 },
      },
    }
    const result = await fetch(`https://places.googleapis.com/v1/places:autocomplete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
      },
      body: JSON.stringify(body),
    })

    const json = await result.json()
    setResults(json.suggestions)
  }

  const fetchPlaceDetails = async (item: any) => {
    const placeId = item['placePrediction']['placeId']
    const result = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': 'location',
      },
    })
    const json = await result.json()
    setDestinationRegion({
      latitude: json['location']['latitude'],
      longitude: json['location']['longitude'],
      latitudeDelta: 0.003,
      longitudeDelta: 0.003,
    })
    setChosenSearch(item['placePrediction']['structuredFormat']['mainText']['text'])
    setSearch(item['placePrediction']['structuredFormat']['mainText']['text'])
    setResults([])
  }

  const clearSearch = () => {
    setSearch('')
    setResults([])
    setDestinationRegion(undefined)
  }

  return (
    <View
      style={{
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
      }}
    >
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Search for a place in the area"
          placeholderTextColor="gray"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Ionicons name="close-circle" size={25} color="gray" />
          </TouchableOpacity>
        )}
      </View>
      {results && results.length > 0 && (
        <>
          <View style={{ height: 1, width: '100%', backgroundColor: Colors.background }} />

          <FlatList
            style={styles.resultList}
            data={results}
            renderItem={({ item, index }) => (
              <TouchableOpacity style={styles.resultItem} onPress={() => fetchPlaceDetails(item)}>
                <Text style={styles.resultText}>{item['placePrediction']['structuredFormat']['mainText']['text']}</Text>
                <Text style={[styles.resultText, { fontSize: 12 }]}>
                  {item['placePrediction']['structuredFormat']['secondaryText']['text']}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item['placePrediction']['placeId']}
          />
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    flexGrow: 1,
    maxWidth: '89%',
    padding: 15,
    fontSize: 18,
    backgroundColor: Colors.backgroundLighter,
    color: 'white',
  },
  resultList: {
    backgroundColor: Colors.backgroundLighter,
    width: '100%',
    flexGrow: 0,
    height: 205,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
  },
  resultItem: {
    width: '100%',
    backgroundColor: Colors.backgroundLighter,
    padding: 15,
  },
  resultText: {
    color: Colors.fontColor,
    fontSize: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: Colors.backgroundLighter,
  },
  clearButton: {
    paddingHorizontal: 15,
  },
})

export default PlacesSearch
