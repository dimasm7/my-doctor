import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { colors, fonts } from '../../../utils'

const ProfileItem = ({label, desc}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.desc}>{desc}</Text>
        </View>
    )
}

export default ProfileItem

const styles = StyleSheet.create({
    container:{
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },
    label:{
        fontSize: 14,
        fontFamily: fonts.primary.normal,
        color: colors.text.secondary,
        marginBottom: 6
    },
    desc:{
        fontSize: 14,
        fontFamily: fonts.primary.normal,
        color: colors.text.primary
    },
})
