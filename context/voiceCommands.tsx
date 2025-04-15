import { useFocusEffect } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import * as Speech from 'expo-speech'
import Voice from '@react-native-voice/voice'

interface UseVoiceCommandsOptions {
  isVisuallyImpaired: boolean
  preface: string
  commands: Record<string, () => void>
}

const useVoiceCommands = ({ isVisuallyImpaired, preface, commands }: UseVoiceCommandsOptions) => {
  const commandsRef = useRef(commands)
  const isMountedRef = useRef(true)
  const speechInProgressRef = useRef(false)
  const originalSpeechResultsRef = useRef<(result: any) => void>()

  useEffect(() => {
    commandsRef.current = commands
  }, [commands])

  const cleanup = useCallback(async () => {
    await Speech.stop()
    await Voice.stop()
    await Voice.destroy()
    speechInProgressRef.current = false
  }, [])

  useFocusEffect(
    useCallback(() => {
      if (!isVisuallyImpaired) return
      isMountedRef.current = true

      const timeoutId = setTimeout(() => {
        if (isMountedRef.current) {
          playPrefaceAndVoiceCommands()
          Voice.onSpeechResults = onSpeechResults
          originalSpeechResultsRef.current = onSpeechResults // Store original handler
        }
      }, 500)

      return () => {
        isMountedRef.current = false
        clearTimeout(timeoutId)
        cleanup()
      }
    }, [])
  )

  useEffect(() => {
    return () => {
      isMountedRef.current = false
      cleanup()
    }
  }, [cleanup])

  const onSpeechResults = (result: any) => {
    if (!isMountedRef.current) return

    const spokenText = result.value?.[0]?.toLowerCase()
    if (!spokenText) return

    console.log(spokenText)

    if (spokenText.includes('repeat voice commands') || spokenText.includes('repeat voice command')) {
      cleanup()
        .then(() => isMountedRef.current && playVoiceCommands())
        .catch((e) => console.log('Error in repeat commands', e))
      return
    }

    let commandExecuted = false
    Object.entries(commandsRef.current).forEach(([command, action]) => {
      if (spokenText.includes(command.toLowerCase())) {
        action()
        Voice.stop()
        commandExecuted = true
      }
    })

    if (commandExecuted) {
      //   cleanup()
    }
  }

  const startVoiceRecognition = async () => {
    if (!isMountedRef.current) return

    try {
      await Voice.start('en-US')
    } catch (e) {
      console.error('Error starting speech recognition', e)
    }
  }

  const playPrefaceAndVoiceCommands = () => {
    if (!isMountedRef.current) return

    speechInProgressRef.current = true
    Speech.speak(
      `${preface}. Available voice commands: ${Object.keys(commandsRef.current).join('. ')}. Repeat voice commands`,
      {
        voice: 'com.apple.ttsbundle.Samantha-compact',
        rate: 1.0,
        onDone: () => {
          speechInProgressRef.current = false
          isMountedRef.current &&
            setTimeout(() => {
              startVoiceRecognition()
            }, 300)
        },
        onStopped: () => {
          speechInProgressRef.current = false
        },
        onError: () => {
          speechInProgressRef.current = false
        },
      }
    )
  }

  const playVoiceCommands = () => {
    if (!isMountedRef.current) return

    speechInProgressRef.current = true
    Speech.speak(`Available voice commands: ${Object.keys(commandsRef.current).join('. ')}. Repeat voice commands`, {
      voice: 'com.apple.ttsbundle.Samantha-compact',
      onDone: () => {
        speechInProgressRef.current = false
        isMountedRef.current && startVoiceRecognition()
      },
      onStopped: () => {
        speechInProgressRef.current = false
      },
      onError: () => {
        speechInProgressRef.current = false
      },
    })
  }

  const onEnterEmail = (setEmail: React.Dispatch<React.SetStateAction<string>>) => {
    if (!isMountedRef.current) return

    cleanup().then(() => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

      Voice.onSpeechResults = (result: any) => {
        if (!isMountedRef.current) return

        const spokenText = result.value?.[0]?.toLowerCase().trim().replace(' ', '')
        if (!spokenText) return
        console.log(spokenText)
        if (spokenText.includes('restart')) {
          cleanup().then(() => onEnterEmail(setEmail))
          return
        }

        if (emailRegex.test(spokenText)) {
          Voice.stop()
          setEmail(spokenText)
          if (speechInProgressRef.current) return

          speechInProgressRef.current = true
          setTimeout(() => {
            Speech.speak('Email set to: ' + spokenText, {
              voice: 'com.apple.ttsbundle.Samantha-compact',
              onDone: () => {
                speechInProgressRef.current = false
                // Restore original handler
                if (originalSpeechResultsRef.current) {
                  Voice.onSpeechResults = originalSpeechResultsRef.current
                  cleanup().then(() => playVoiceCommands())
                }
              },
            })
          }, 500)
        }
      }

      speechInProgressRef.current = true
      Speech.speak('Please spell out your email address letter by letter. You can reset by saying restart', {
        voice: 'com.apple.ttsbundle.Samantha-compact',
        onDone: () => {
          speechInProgressRef.current = false
          isMountedRef.current && startVoiceRecognition()
        },
        onError: (error) => {
          console.log('Error in email prompt:', error)
          speechInProgressRef.current = false
        },
      })
    })
  }

  const onEnterPassword = (
    setPass1: React.Dispatch<React.SetStateAction<string>>,
    setPass2: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (!isMountedRef.current) return

    cleanup().then(() => {
      Voice.onSpeechResults = (result: any) => {
        if (!isMountedRef.current) return

        const spokenText = result.value?.[0]?.toLowerCase().trim()
        if (!spokenText) return
        console.log(spokenText)

        if (spokenText.includes('restart')) {
          cleanup().then(() => onEnterPassword(setPass1, setPass2))
          return
        }

        if (spokenText.includes('stop')) {
          const password = spokenText.replace('stop', '').trim().replace(' ', '')
          if (password.length > 0) {
            Voice.stop()
            setPass1(password)
            setPass2(password)
            if (speechInProgressRef.current) return

            speechInProgressRef.current = true
            setTimeout(() => {
              Speech.speak('Password set to ' + password, {
                voice: 'com.apple.ttsbundle.Samantha-compact',
                onDone: () => {
                  speechInProgressRef.current = false
                  if (originalSpeechResultsRef.current) {
                    Voice.onSpeechResults = originalSpeechResultsRef.current
                    cleanup().then(() => playVoiceCommands())
                  }
                },
              })
            }, 500)
          }
          return
        }
      }

      speechInProgressRef.current = true
      Speech.speak(
        'Please say your password or spell it out letter by letter. You can reset by saying restart and finish by saying stop',
        {
          voice: 'com.apple.ttsbundle.Samantha-compact',
          onDone: () => {
            speechInProgressRef.current = false
            isMountedRef.current && startVoiceRecognition()
          },
          onError: (error) => {
            console.log('Error in password prompt:', error)
            speechInProgressRef.current = false
          },
        }
      )
    })
  }

  const onEnterLanguages = (
    languages: {
      code: string
      label: string
    }[],
    setSelectedLanguages: React.Dispatch<React.SetStateAction<string[]>>,
    setSelectedLanguageCodes: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (!isMountedRef.current) return

    cleanup().then(() => {
      Voice.onSpeechResults = (result: any) => {
        if (!isMountedRef.current) return

        const spokenText = result.value?.[0]?.toLowerCase().trim()
        if (!spokenText) return
        console.log(spokenText)

        if (spokenText.includes('restart')) {
          cleanup().then(() => onEnterLanguages(languages, setSelectedLanguages, setSelectedLanguageCodes))
          return
        }

        if (spokenText.includes('stop')) {
          const processedLanguages: string[] = spokenText.replace('stop', '').trim().split(' ')
          let selectedLanguages: string[] = []
          let selectedLanguageCodes: string[] = []
          for (const processedLang of processedLanguages) {
            const language = languages.find((l) => l.label.toLowerCase().includes(processedLang))
            if (language) {
              selectedLanguages.push(language.label)
              selectedLanguageCodes.push(language.code)
            }
          }
          setSelectedLanguages(selectedLanguages)
          setSelectedLanguageCodes(selectedLanguageCodes)
          if (languages.length > 0) {
            Voice.stop()
            console.log(languages)
            if (speechInProgressRef.current) return

            speechInProgressRef.current = true
            setTimeout(() => {
              Speech.speak('Languages set to ' + processedLanguages.join('.'), {
                voice: 'com.apple.ttsbundle.Samantha-compact',
                onDone: () => {
                  speechInProgressRef.current = false
                  if (originalSpeechResultsRef.current) {
                    Voice.onSpeechResults = originalSpeechResultsRef.current
                    cleanup().then(() => playVoiceCommands())
                  }
                },
              })
            }, 500)
          }
          return
        }
      }

      speechInProgressRef.current = true
      Speech.speak(
        'Please say the languages you are comfortable getting helped in. You can reset them by saying restart and finish by saying stop',
        {
          voice: 'com.apple.ttsbundle.Samantha-compact',
          onDone: () => {
            speechInProgressRef.current = false
            isMountedRef.current && startVoiceRecognition()
          },
          onError: (error) => {
            console.log('Error in language prompt:', error)
            speechInProgressRef.current = false
          },
        }
      )
    })
  }

  return { playVoiceCommands, onEnterEmail, onEnterPassword, onEnterLanguages, speechInProgressRef }
}

export { useVoiceCommands }
