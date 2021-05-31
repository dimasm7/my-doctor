import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { Button, Gap, Header, Input, Loading } from '../../components'
import { Fire } from '../../config'
import { colors, storeData, useForm } from '../../utils'

const Register = ({navigation}) => {
    const [form, setForm] = useForm({
        fullName: '',
        profession: '',
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState(false)

    const onContinue = () => {
        setLoading(true)
        Fire.auth().createUserWithEmailAndPassword(form.email, form.password)
            .then((userCredential) => {
                const user = userCredential.user;
                const data = {
                    uid: user.uid,
                    fullName: form.fullName,
                    profession: form.profession,
                    email: form.email
                }
                Fire.database()
                    .ref(`users/${user.uid}/`)
                    .set(data)
                    
                storeData('user', data)
                setForm('reset')
                setLoading(false)
                navigation.navigate('UploadPhoto', data)
            })
            .catch((error) => {
                var errorMessage = error.message;
                setLoading(false)
                showMessage({
                    message: errorMessage,
                    type:'error',
                    backgroundColor: colors.error,
                    color: colors.white
                })
            });
    }

    return (
        <>
            <View style={styles.page}>
                <Header title="Daftar Akun" onPress={() => navigation.goBack()}/>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <Input 
                            label="Full Name"
                            value={form.fullName}
                            onChangeText={value => setForm('fullName', value)}
                        />
                        <Gap height={24} />
                        <Input 
                            label="Pekerjaan" 
                            value={form.profession}
                            onChangeText={(value) => setForm('profession', value)}
                        />
                        <Gap height={24} />
                        <Input 
                            label="Email Address" 
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
                        <Gap height={40} />
                        <Button title="Continue" onPress={onContinue} />
                    </View>
                </ScrollView>
            </View>
            {loading && <Loading/>}
        </>
    )
}

export default Register

const styles = StyleSheet.create({
    page:{
        flex: 1,
        backgroundColor: colors.white
    },
    content:{
        padding: 40,
        paddingTop: 0
    }
})
