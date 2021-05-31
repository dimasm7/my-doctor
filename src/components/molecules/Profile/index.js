import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { IconRemovePhoto } from '../../../assets'
import { colors, fonts } from '../../../utils'

const Profile = ({name, desc, isRemove, photo, onPress}) => {
    return (
        <View style={styles.container}>
            {!isRemove && (
                <View style={styles.borderProfile}>
                    <Image source={photo} style={styles.avatar} />
                </View>
            )}
            {isRemove && (
                <TouchableOpacity style={styles.borderProfile} onPress={onPress}>
                    <Image source={photo} style={styles.avatar} />
                    <IconRemovePhoto style={styles.removePhoto} />
                </TouchableOpacity>
            )}

            {name && (
                <>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.profession}>{desc}</Text>
                </>
            )}
        </View>
    )
}

export default Profile

const styles = StyleSheet.create({
    container:{
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar:{
        width: 110,
        height: 110,
        borderRadius: 110 / 2
    },
    removePhoto:{
        position: 'absolute',
        bottom: 8,
        right: 8
    },
    borderProfile:{
        width: 130,
        height: 130,
        borderRadius: 130 / 2,
        borderWidth: 1,
        borderColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center'
    },
    name:{
        fontSize: 20,
        fontFamily: fonts.primary[600],
        color: colors.text.primary,
        marginTop: 16
    },
    profession:{
        fontSize: 16,
        fontFamily: fonts.primary[600],
        color: colors.text.secondary,
        marginTop: 2
    }
})
