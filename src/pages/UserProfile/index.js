import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ILNullPhoto } from '../../assets'
import { Gap, Header, List, Profile } from '../../components'
import { Fire } from '../../config'
import { colors, getData, showError } from '../../utils'

const UserProfile = ({navigation}) => {
    const [profile, setProfile] = useState({
        fullName: '',
        profession: '',
        photo: ILNullPhoto
    })
    useEffect(() => {
        getData('user').then((res) => {
            const data = res
            if(res.photo){
                data.photo = {uri: res.photo}
            } else{
                data.photo = ILNullPhoto
            }
            setProfile(res)
        })
    }, [])

    const signOut = () => {
        Fire.auth().signOut().then((res) => {
            AsyncStorage.multiRemove(['user']).then(() => {
                navigation.reset({index: 0, routes: [{name: 'GetStarted'}]})
            })
        }).catch((err) => {
            showError(err.message)
        })
    }
    return (
        <View style={styles.page}>
            <Header title="Profile" onPress={() => navigation.goBack()}/>
            <Gap height={10}/>
            {profile.fullName.length > 0 && <Profile name={profile.fullName} desc={profile.profession} photo={profile.photo}/>}
            <Gap height={14}/>
            <List 
                name="Edit Profile" 
                desc="Last Update Yesterday" 
                type="next" 
                icon="edit-profile"
                onPress={() => navigation.navigate('UpdateProfile')}
            />
            <List name="Language" desc="Last Update Yesterday" type="next" icon="language"/>
            <List name="Give Us Rate" desc="Last Update Yesterday" type="next" icon="rate"/>
            <List name="Sign Out" desc="Last Update Yesterday" type="next" icon="help" onPress={signOut}/>
        </View>
    )
}

export default UserProfile

const styles = StyleSheet.create({
    page:{
        flex: 1,
        backgroundColor: colors.white
    }
})
