import { Button, StyleSheet, TextInput } from 'react-native'
import { Text, View } from '@/components/Themed'
import { useSettings } from '@/hooks/useSettings'

export default function SettingsScreen() {
  const { settings, dispatch } = useSettings()

  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Codeforces Handle</Text>
        {settings.handle ? (
          <View style={{}}>
            <Text style={{}}>{settings.handle}</Text>
          </View>
        ) : (
          <TextInput style={styles.handleInput} placeholder="Handle" />
        )}
        <Button title="Update" style={{}} />
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
    fontSize: 12,
    color: 'grey',
    marginLeft: 4,
    marginBottom: 3,
  },
  handleInput: {
    fontSize: 12,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
})
