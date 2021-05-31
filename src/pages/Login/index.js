import React from 'react'
import { ScrollView, StyleSheet, Text } from 'react-native'
import { useDispatch } from 'react-redux'
import { ILLogo } from '../../assets/illustration'
import { Button, Gap, Input, Link } from '../../components'
import { Fire } from '../../config'
import { colors, fonts, showError, storeData, useForm } from '../../utils'

const Login = ({navigation}) => {
    const [form, setForm] = useForm({email: '', password: ''})
    const dispatch = useDispatch()

    const login = () =>{
        dispatch({type: 'SET_LOADING', value: true})
        Fire.auth().signInWithEmailAndPassword(form.email, form.password)
        .then((res) => {
            Fire.database()
                .ref(`users/${res.user.uid}/`)
                .once('value')
                .then((resDB) => {
                    if(resDB.val()){
                        storeData('user', resDB.val())
                        dispatch({type: 'SET_LOADING', value: false})
                        navigation.replace('MainApp')
                    }
                })
            }).catch((err) => {
                dispatch({type: 'SET_LOADING', value: false})
                showError(err.message)
            })
    }

    return (
        <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
            <ILLogo />
            <Text style={styles.title}>Masuk dan mulai berkonsultasi</Text>
            <Input 
                label="Email Adrress"
                value={form.email}
                onChangeText={(value) => setForm('email', value)}
            />
            <Gap height={24} />
            <Input 
                label="Password" 
                value={form.password}
                onChangeText={(value) => setForm('password', value)}
                secureTextEntry
            />
            <Gap height={10} />
            <Link title="Forgot My Password" size={12}/>
            <Gap height={40} />
            <Button title="Sign In" onPress={login} />
            <Gap height={20} />
            <Link title="Create New Account" size={16} align="center" onPress={() => navigation.navigate('Register')}/>
        </ScrollView>
    )
}

export default Login

const styles = StyleSheet.create({
    page:{
        flex: 1,
        padding: 40,
        backgroundColor: colors.white
    },
    title:{
        fontSize: 20,
        fontFamily: fonts.primary[600],
        color: colors.text.primary,
        marginVertical: 40,
        maxWidth: 153
    }
})
