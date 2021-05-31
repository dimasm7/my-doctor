import React from 'react'
import { useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { IconAddPhoto, IconRemovePhoto, ILNullPhoto } from '../../assets'
import { Button, Gap, Header, Link } from '../../components'
import { colors, fonts, storeData } from '../../utils'
import * as ImagePicker from "react-native-image-picker"
import { showMessage } from 'react-native-flash-message'
import { Fire } from '../../config'

const UploadPhoto = ({navigation, route}) => {
    const [hasPhoto, setHasPhoto] = useState(false);
    const [photo, setPhoto] = useState(ILNullPhoto);
    const {uid, fullName, profession} = route.params;
    const [photoForDB, setPhotoForDB] = useState('')

    const getImage = () => {
        ImagePicker.launchImageLibrary({
            quality: 0.5,
            maxHeight: 200,
            maxWidth: 200
        }, (response) => {
            console.log(response)
            if(response.didCancel || response.error){
                return showMessage({
                    message: 'Batal memilih photo',
                    type: 'default',
                    backgroundColor: colors.error,
                    color: colors.white
                })
            }
            const source = {uri: response.uri}
            setPhotoForDB(response.uri)
            
            setPhoto(source)
            setHasPhoto(true)
        });
    }
    
    const uploadAndContinue = () => {
        Fire.database()
            .ref(`users/${uid}/`)
            .update({photo: photoForDB})

        const data = route.params
        data.photo = photoForDB
        storeData('user', data)
        navigation.reset({index: 1, routes:[{name: 'MainApp'}] })
    }

    return (
        <View style={styles.page}>
            <Header title="Upload Photo" onPress={() => navigation.goBack()} />
            <View style={styles.content}>
                <View style={styles.profile}>
                    <TouchableOpacity style={styles.avatarWrapper} onPress={getImage} >
                        <Image source={photo} style={styles.avatar} />
                        {hasPhoto && <IconRemovePhoto style={styles.addPhoto} />}
                        {!hasPhoto && <IconAddPhoto style={styles.addPhoto} />}
                    </TouchableOpacity>
                    <Text style={styles.name}>{fullName}</Text>
                    <Text style={styles.profession}>{profession}</Text>
                </View>
                <View>
                    <Button 
                        disable={!hasPhoto} 
                        title="Upload and Continue" 
                        onPress={uploadAndContinue}
                    />
                    <Gap height={30} />
                    <Link title="Skip for this" align="center" size={16} onPress={() => navigation.reset({index: 1, routes:[{name: 'MainApp'}] })} />
                </View>
            </View>
        </View>
    )
}

export default UploadPhoto

const styles = StyleSheet.create({
    page:{
        flex: 1,
        backgroundColor: colors.white
    },
    content:{
        paddingHorizontal: 40,
        flex: 1,
        justifyContent: 'space-between',
        paddingBottom: 64,
    },
    profile:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatarWrapper:{
        width: 130,
        height: 130,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 130 / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar:{
        width: 110,
        height: 110,
        borderRadius: 110 / 2
    },
    addPhoto:{
        position: 'absolute',
        bottom: 8,
        right: 6
    },
    name:{
        fontSize: 24,
        fontFamily: fonts.primary[600],
        color: colors.text.primary,
    },
    profession:{
        fontSize: 18,
        fontFamily: fonts.primary.normal,
        color: colors.text.secondary,
        marginTop: 4
    }
})
