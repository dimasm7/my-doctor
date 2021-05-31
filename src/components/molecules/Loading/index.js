import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { colors, fonts } from '../../../utils'

const Loading = () => {
    return (
        <View style={styles.wrapper}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.text}>Loading...</Text>
        </View>
    )
}

export default Loading

const styles = StyleSheet.create({
    wrapper:{
        height: '100%',
        width: '100%',
        backgroundColor: colors.loadingBackground,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text:{
        fontSize: 18,
        fontFamily: fonts.primary[600],
        color: colors.text.primary,
        marginTop: 16
    }
})
