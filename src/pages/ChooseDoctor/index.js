import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { DummyDoctor9 } from '../../assets'
import { Header, List } from '../../components'
import { Fire } from '../../config'
import { colors, showError } from '../../utils'

const ChooseDoctor = ({navigation, route}) => {
    const itemCategory = route.params
    const [listDoctor, setListDoctor] = useState([])

    useEffect(() => {
        callDoctorByCategory(itemCategory.category)
    }, [])
    const callDoctorByCategory = (category) => {
        Fire.database().ref('doctors/').orderByChild('category').equalTo(category)
        .once('value').then((res) => {
            if(res.val()){
                const oldData = res.val()
                const data = []
                Object.keys(oldData).map((key) => {
                    data.push({
                        id: key,
                        data: oldData[key]
                    })
                    setListDoctor(data)
                })
            }
        }).catch((err) => {
            showError(err.message)
        })
    }
    return (
        <View style={styles.page}>
            <Header title={`Pilih ${itemCategory.category}`} type="dark" onPress={() => navigation.goBack()} />
            {listDoctor.map((doctor) => {
                return (
                    <List 
                        key={doctor.id}
                        type="next" 
                        profile={{uri: doctor.data.photo}} 
                        name={doctor.data.fullName} 
                        desc={doctor.data.gender} 
                        onPress={() => navigation.navigate('DoctorProfile', doctor)}
                    />
                )
            })}
        </View>
    )
}

export default ChooseDoctor

const styles = StyleSheet.create({
    page:{
        flex: 1,
        backgroundColor: colors.white
    }
})
