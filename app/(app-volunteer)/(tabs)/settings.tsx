import { View, Text, StyleSheet, Button, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { API_URL, useAuth } from '../../../context/auth'
import Colors from '../../../constants/Colors'
import { styles as settingStyles } from '../../(app-visually-impaired)/(tabs)/settings'
import { styles as appStyles } from '../../(app-visually-impaired)/(tabs)/start-a-call'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import User from '@/types/User'
import Spinner from 'react-native-loading-spinner-overlay'
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler'

const Settings = () => {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { authState, onSignOut } = useAuth()

  const [assignedUsers, setAssignedUsers] = useState<User[]>([])

  const redirectToPickLanguages = () => {
    router.push(`/(auth)/4-pick-languages?isVisuallyImpaired=0`)
  }

  const handleAddAssigneePrompt = () => {
    Alert.prompt(
      'Enter Friend Code',
      'Enter the friend code of the visually impaired user you want to assist. They can share their code from their settings tab',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Add',

          onPress: (friendCode) => {
            if (!friendCode) {
              Alert.alert('Error', 'Please enter a friend code')
              return
            }
            addAssignee(friendCode)
          },
        },
      ],
      'plain-text'
    )
  }

  const handleRemoveAssigneePrompt = (user: User) => {
    Alert.alert('Remove Assignee', `Are you sure you want to remove ${user.email}?`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Remove',
        onPress: () => {
          removeAssignee(user.id)
        },
      },
    ])
  }

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAssignedUsers()
  }, [])

  const fetchAssignedUsers = async () => {
    setLoading(true)
    var json
    try {
      const result = await fetch(`${API_URL}/api/user/get-designated`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authState?.jwtToken}`,
        },
      })

      json = await result.json()
      if (json['blind_users']) setAssignedUsers(json['blind_users'])
    } catch (e) {
      Alert.alert('Error', json.error)
    } finally {
      setLoading(false)
    }
  }

  const removeAssignee = async (id: string) => {
    setLoading(true)
    var json
    try {
      const result = await fetch(`${API_URL}/api/user/remove-designation`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authState?.jwtToken}`,
        },
        body: JSON.stringify({ blind_id: id }),
      })

      json = await result.json()
      fetchAssignedUsers()
    } catch (e) {
      Alert.alert('Error', json.error)
    }
  }

  const addAssignee = async (friendCode: string) => {
    setLoading(true)
    var json
    try {
      const result = await fetch(`${API_URL}/api/user/add-designation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authState?.jwtToken}`,
        },
        body: JSON.stringify({ friend_code: friendCode }),
      })

      json = await result.json()
      fetchAssignedUsers()
    } catch (e) {
      Alert.alert('Error', json.error)
    }
  }

  return (
    <GestureHandlerRootView style={[appStyles.container, { paddingTop: insets.top + 10 }]}>
      <Text style={styles.titleText}>Settings</Text>
      <View style={{ width: '100%', height: 1, backgroundColor: 'gray', marginTop: 10, marginBottom: 20 }} />
      <View style={styles.settingBox}>
        <View style={settingStyles.row}>
          <Text style={[styles.text, { marginBottom: 10 }]}>👤 Your Assignees</Text>
          <TouchableOpacity onPress={handleAddAssigneePrompt}>
            <Ionicons size={24} color={Colors.fontColor} name="add-outline" />
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator />
        ) : assignedUsers.length === 0 ? (
          <Text style={styles.subtext}>
            You can designate yourself to assist a visually impaired user. Once assigned, they can call you directly
          </Text>
        ) : (
          <FlatList
            data={assignedUsers}
            style={styles.assigneeList}
            renderItem={({ item }) => (
              <View style={settingStyles.row}>
                <Text style={[styles.text, { marginLeft: 5, color: 'lightgray' }]}>{item.email}</Text>
                <TouchableOpacity onPress={() => handleRemoveAssigneePrompt(item)}>
                  <Ionicons size={22} color={'red'} style={{ marginTop: 5 }} name="remove-circle-outline" />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
      <TouchableOpacity onPress={redirectToPickLanguages} style={styles.settingBox}>
        <View style={settingStyles.row}>
          <Text style={styles.text}>🌍 Change Languages</Text>
          <Ionicons size={22} color={Colors.fontColor} name="chevron-forward-outline" />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={onSignOut} style={styles.settingBox}>
        <View style={settingStyles.row}>
          <Text style={styles.text}>👋 Sign Out</Text>
          <Ionicons size={22} color={Colors.fontColor} name="chevron-forward-outline" />
        </View>
      </TouchableOpacity>
    </GestureHandlerRootView>
  )
}
const styles = StyleSheet.create({
  settingBox: {
    backgroundColor: Colors.backgroundLighter,
    borderRadius: 10,
    padding: 20,
    paddingVertical: 15,
    marginBottom: 15,
  },
  titleText: {
    color: Colors.fontColor,
    fontSize: 30,
    fontWeight: 'bold',
  },
  text: {
    color: Colors.fontColor,
    fontSize: 18,
  },
  subtext: {
    color: 'lightgray',
    fontSize: 16,
  },
  assigneeList: {
    maxHeight: 100,
  },
})

export default Settings
