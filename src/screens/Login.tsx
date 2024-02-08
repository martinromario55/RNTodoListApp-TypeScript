import { View, Text, StyleSheet, TextInput, Button } from 'react-native'
import React, { useState } from 'react'
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const auth = getAuth()

  const signUp = async () => {
    const newUser = await createUserWithEmailAndPassword(auth, email, password)
  }

  const signIn = async () => {
    const user = await signInWithEmailAndPassword(auth, email, password)
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text: string) => setEmail(text)}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        textContentType="password"
        onChangeText={(text: string) => setPassword(text)}
        value={password}
        secureTextEntry={true}
      />
      <Button
        onPress={signUp}
        title="Create Account"
        disabled={(email && password) === ''}
      />
      <Button
        onPress={signIn}
        title="Sign In"
        disabled={(email && password) === ''}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
    marginVertical: 50,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
  button: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 4,
    color: 'blue',
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
})
