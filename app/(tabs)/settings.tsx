import { useState } from 'react'
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import { Text, View } from '@/components/Themed'
import { useSettings } from '@/hooks/useSettings'
import { FontAwesome } from '@expo/vector-icons'

export default function SettingsScreen() {
  const { settings, dispatch } = useSettings()
  const [handle, setHandle] = useState<string | undefined>(settings.handle)
  const [isEditMode, setIsEditMode] = useState<boolean>(
    !Boolean(settings.handle)
  )

  const onUpdateHandle = () => {
    if (handle) {
      dispatch({
        payload: { handle },
      })
      setIsEditMode(false)
    } else {
      alert('Handle is required!')
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Codeforces Handle</Text>
        {!isEditMode ? (
          <View style={styles.handleTextContainer}>
            <Text style={styles.handleText}>{settings.handle}</Text>
            <TouchableOpacity onPress={() => setIsEditMode(true)}>
              <FontAwesome name="edit" size={16} />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TextInput
              style={styles.handleInput}
              placeholder="Handle"
              onChangeText={setHandle}
              defaultValue={handle}
            />
            <View style={styles.buttonGroup}>
              <View style={styles.button}>
                <Button title="Update" onPress={onUpdateHandle} />
              </View>
              {settings.handle ? (
                <View style={styles.button}>
                  <Button
                    title="Cancel"
                    color={'red'}
                    onPress={() => {
                      setHandle(settings.handle)
                      setIsEditMode(false)
                    }}
                  />
                </View>
              ) : null}
            </View>
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  formGroup: {
    width: '90%',
    marginVertical: 5,
  },
  label: {
    fontSize: 14,
    color: 'grey',
    marginBottom: 10,
  },
  handleTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: 'black',
    padding: 5,
  },
  handleText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  handleInput: {
    fontSize: 12,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    borderRadius: 8,
    marginTop: 10,
    width: '48%',
  },
})
