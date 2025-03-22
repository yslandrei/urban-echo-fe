import { View, Text, StyleSheet, TouchableOpacity, Button, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '../../constants/Colors'
import { styles as authStyles } from './1-welcome'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useLocalSearchParams } from 'expo-router'
import { useAuth } from '../../context/auth'

const languages = [
  { code: 'EN', label: 'English 🇬🇧' },
  { code: 'RO', label: 'Romanian 🇷🇴' },
  { code: 'HU', label: 'Hungarian 🇭🇺' },
  { code: 'ES', label: 'Spanish 🇪🇸' },
  { code: 'FR', label: 'French 🇫🇷' },
  { code: 'DE', label: 'German 🇩🇪' },
  { code: 'ZH', label: 'Chinese 🇨🇳' },
  { code: 'JA', label: 'Japanese 🇯🇵' },
  { code: 'HI', label: 'Hindi 🇮🇳' },
]

const PickLanguages = () => {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const { authState, onSetLanguages } = useAuth()

  const params = useLocalSearchParams()
  const isVisuallyImpaired = params.isVisuallyImpaired === '1'

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [selectedLanguageCodes, setSelectedLanguageCodes] = useState<string[]>([])

  useEffect(() => {
    const preselectedLanguageCodes = authState?.languages || []
    let preselectedLanguages = []
    for (const langCode of preselectedLanguageCodes) {
      const language = languages.find((l) => l.code === langCode)
      if (language) {
        preselectedLanguages.push(language.label)
      }
    }
    setSelectedLanguages(preselectedLanguages)
    setSelectedLanguageCodes(preselectedLanguageCodes)
  }, [])

  const addLanguage = (language: string, code: string) => {
    if (!selectedLanguageCodes.includes(code)) {
      setSelectedLanguages([...selectedLanguages, language])
      setSelectedLanguageCodes([...selectedLanguageCodes, code])
    }
  }

  const removeLanguage = (language: string, code: string) => {
    setSelectedLanguages(selectedLanguages.filter((lang) => lang !== language))
    setSelectedLanguageCodes(selectedLanguageCodes.filter((lang) => lang !== code))
  }

  const handleSetLanguages = () => {
    if (selectedLanguages.length === 0) {
      alert('Please select at least one language')
      return
    }
    onSetLanguages(selectedLanguageCodes)
  }

  return (
    <View style={[authStyles.mainContainer, { paddingTop: 10 }]}>
      <Text style={authStyles.headerText}>Pick languages</Text>
      <FlatList
        data={languages}
        style={styles.languageList}
        keyExtractor={(item) => item.code}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={
              index === 0
                ? [styles.languageItem, { borderTopStartRadius: 10, borderTopEndRadius: 10 }]
                : index === languages.length - 1
                ? [styles.languageItem, { borderBottomStartRadius: 10, borderBottomEndRadius: 10, marginBottom: 3 }]
                : styles.languageItem
            }
            onPress={() => addLanguage(item.label, item.code)}
          >
            <Text style={styles.languageText}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.selectedLanguagesContainer}>
        {selectedLanguages.map((lang) => (
          <TouchableOpacity
            key={lang}
            onPress={() => removeLanguage(lang, languages.find((l) => l.label === lang)?.code || '')}
          >
            <View style={styles.tag}>
              <Text style={styles.tagText}>{lang}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ flexGrow: 1 }}></View>
      <TouchableOpacity
        style={[
          authStyles.smallButton,
          { marginBottom: insets.bottom },
          isVisuallyImpaired && { height: '42%', justifyContent: 'center' },
        ]}
        onPress={() => handleSetLanguages()}
      >
        <Text style={isVisuallyImpaired ? authStyles.buttonText : authStyles.smallButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  selectedLanguagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    gap: 10,
  },
  tag: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  tagText: {
    color: Colors.fontColor,
    fontSize: 16,
  },
  removeTag: {
    color: Colors.fontColor,
    fontWeight: 'bold',
    fontSize: 20,
  },
  languageList: {
    backgroundColor: Colors.backgroundLighter,
    borderRadius: 10,
    flexGrow: 0,
    height: 210,
  },
  languageItem: {
    backgroundColor: Colors.backgroundLighter,
    padding: 15,
    alignItems: 'center',
  },
  languageText: {
    color: Colors.fontColor,
    fontSize: 18,
  },
})

export default PickLanguages
