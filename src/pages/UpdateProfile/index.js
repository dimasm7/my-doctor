import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import * as ImagePicker from 'react-native-image-picker'
import { useDispatch } from 'react-redux'
import { ILNullPhoto } from '../../assets'
import { Button, Gap, Header, Input, Profile } from '../../components'
import { Fire } from '../../config'
import { colors, getData, showError, showSuccess, storeData } from '../../utils'

const UpdateProfile = ({navigation}) => {
    const [profile, setProfile] = useState({
        fullName: '',
        profession: '',
        email: '',
    })

    const [photo, setPhoto] = useState(ILNullPhoto)
    const [photoForDB, setPhotoForDB] = useState(photo)
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()

    useEffect(() => {
        getData('user').then((res) => {
            const data = res
            if(res.photo) setPhoto({uri: res.photo})
            setProfile(data)
        }).catch((err) => {
            showError(err.message)
        })
    }, [])

    
    const update = () => {
        dispatch({type: 'SET_LOADING', value: true})
        if(password.length > 0) {
            if(password.length < 6) {
                dispatch({type: 'SET_LOADING', value: false})
                showError('Password kurang dari 6 karakter')
            } else {
                updatePassword()
            }
        } else {
            updateProfileData()
        }
    }

    const updatePassword = () => {
        Fire.auth().onAuthStateChanged((user) => {
            if(user){
                user.updatePassword(password)
                .then((res) => {
                    updateProfileData()
                })
                .catch((err) => {
                    dispatch({type: 'SET_LOADING', value: false})
                    return showError(err.message)
                })
            }
        })
    }

    const updateProfileData = () => {
        const data = profile;
        data.photo = photoForDB;

        Fire.database().ref(`users/${profile.uid}/`)
            .update(data)
            .then(() => {
                storeData('user', data)
                dispatch({type: 'SET_LOADING', value: false})
                navigation.replace('MainApp')
            }).catch((err) => {
                dispatch({type: 'SET_LOADING', value: false})
                showError(err.message)
            })
    }
    
    const changeText = (key, value) => {
        setProfile({
            ...profile,
            [key]: value,
        });
    }

    const updateImage = () => {
        ImagePicker.launchImageLibrary({
            quality: 0.5,
            maxHeight: 200,
            maxWidth: 200
        }, (response) => {
            if(response.didCancel || response.error){
                return showError('Batal memilih photo')
            }
            const source = {uri: response.uri}
            if(response.uri == 4){
                showError('Gagal pilih photo')
            } else {
                setPhotoForDB(response.uri)
                setPhoto(source)
            }
        });
    }

    return (
        <View style={styles.page}>
            <Header title="Edit Profile" onPress={() => navigation.goBack()} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <Profile isRemove photo={photo} onPress={updateImage} />
                    <Gap height={26} />
                    <Input label="Full Name" value={profile.fullName} onChangeText={(value) => changeText('fullName', value)} />
                    <Gap height={24} />
                    <Input label="Pekerjaan" value={profile.profession} onChangeText={(value) => changeText('profession', value)} />
                    <Gap height={24} />
                    <Input label="Email" value={profile.email} disable />
                    <Gap height={24} />
                    <Input label="Password" secureTextEntry value={password} onChangeText={(value) => setPassword(value)} />
                    <Gap height={40} />
                    <Button title="Save Profile" onPress={update} />
                </View>
            </ScrollView>
        </View>
    )
}

export default UpdateProfile

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
