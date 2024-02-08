import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Keyboard,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore'
import { FIRESTONE_DB } from '../../firebaseConfig'
import { Ionicons, Entypo, Feather } from '@expo/vector-icons/'

export interface Todo {
  title: string
  done: boolean
  id: string
}

export default function List({ navigation }: any) {
  const [todos, setTodos] = useState<any[]>([])
  const [todo, setTodo] = useState('')

  useEffect(() => {
    const todoRef = collection(FIRESTONE_DB, 'todos')
    const subscriber = onSnapshot(todoRef, {
      next: snapshot => {
        const todos: any[] = []
        snapshot.docs.forEach(doc => {
          // console.log(doc.data())
          todos.push({
            id: doc.id,
            ...doc.data(),
          } as Todo)
        })
        setTodos(todos)
      },
    })
    return () => subscriber()
  }, [])

  const AddTodo = async () => {
    const doc = await addDoc(collection(FIRESTONE_DB, 'todos'), {
      title: todo,
      done: false,
    })
    setTodo('')
    Keyboard.dismiss()
    // console.log('file list todo', doc)
  }
  const renderTodo = ({ item }: any) => {
    const ref = doc(FIRESTONE_DB, `todos/${item.id}`)
    const toggleDone = async () => {
      await updateDoc(ref, { done: !item.done })
    }
    const deleteItem = async () => {
      await deleteDoc(ref)
    }

    return (
      <View style={styles.todoContainer}>
        <TouchableOpacity onPress={toggleDone} style={styles.todo}>
          {item.done && (
            <Feather name="check-circle" size={32} color={'green'} />
          )}
          {!item.done && <Entypo name="circle" size={32} color="#000" />}
          <Text
            style={[
              styles.todoText,
              {
                color: item.done ? 'gray' : 'black',
                textDecorationLine: item.done ? 'line-through' : 'none',
                textDecorationColor: item.done ? 'red' : 'black',
              },
            ]}
          >
            {item.title}
          </Text>
        </TouchableOpacity>
        <Feather name="trash-2" size={23} color={'red'} onPress={deleteItem} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Add new todo"
          onChangeText={(text: string) => setTodo(text)}
          value={todo}
        />
        <Button title="Add Todo" onPress={AddTodo} disabled={todo === ''} />
      </View>

      {todos.length > 0 && (
        <View style={styles.todos}>
          <FlatList
            data={todos}
            renderItem={renderTodo}
            keyExtractor={(todo: Todo) => todo.id}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  form: {
    marginVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
  todoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
  },
  todoText: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  todos: {
    marginVertical: 20,
  },
  todo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
