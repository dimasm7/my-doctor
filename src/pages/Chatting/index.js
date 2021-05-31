import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { ChatItem, Header, InputChat } from '../../components'
import { Fire } from '../../config'
import { colors, fonts, getChatTime, getDateChat, getData, showError } from '../../utils'

const Chatting = ({navigation, route}) => {
    const dispatch = useDispatch()
    const dataDoctor = route.params
    const [chatContent, setChatContent] = useState('') 
    const [user, setUser] = useState('') 
    const [chatData, setChatData] = useState([]) 

    useEffect(() => {
        getDataUserFormLocal()
        getDataChating()
    }, [])
    
    const getDataUserFormLocal = () => {
        getData('user').then((res) => {
            setUser(res);
        })
    }

    const getDataChating = () => {
        const chatId = `${user.uid}_${dataDoctor.data.uid}`;
        const url = `chatting/${chatId}/allChat/`;
        // ref().on() -> untuk dipanggail berulang shg bisa tau jika ada perubahan diFirebase
        // ref().once() -> untuk dipanggail sekali
        Fire.database().ref(url).on('value', (snapshot) => {
            const dataSnapshot = snapshot.val()
            if(dataSnapshot){
                const allDataChat = []
                Object.keys(dataSnapshot).map((key) => {
                    const dataChat = dataSnapshot[key]
                    const newDataChat = []

                    Object.keys(dataChat).map((keyChat) => {
                        newDataChat.push({
                            id: keyChat,
                            data: dataChat[keyChat]
                        })
                    })

                    allDataChat.push({
                        id: key,
                        data: newDataChat
                    })
                })
                setChatData(allDataChat)
            }
        })
    }

    const chatSend = () => {
        const today = new Date();
        const chatId = `${user.uid}_${dataDoctor.data.uid}`;
        const url = `chatting/${chatId}/allChat/${getDateChat(today)}`;
        const urlMessageUser = `message/${user.uid}/${chatId}`
        const urlMessageDoctor = `message/${dataDoctor.data.uid}/${chatId}`
        const data = {
            sendBy: user.uid,
            chatDate: today.getTime(),
            chatTime: getChatTime(today),
            chatContent: chatContent
        }
        const dataHostoryChatForUser = {
            lastContentChat: chatContent,
            lastChatDate: today.getTime(),
            uidPartner: dataDoctor.data.uid
        }
        const dataHostoryChatForDoctor = {
            lastContentChat: chatContent,
            lastChatDate: today.getTime(),
            uidPartner: user.uid
        }

        dispatch({type: 'SET_LOADING', value: true})
        Fire.database().ref(url).push(data).then((res) => {
            setChatContent('');

            Fire.database().ref(urlMessageUser)
                .set(dataHostoryChatForUser)

            Fire.database().ref(urlMessageDoctor)
                .set(dataHostoryChatForDoctor)

            dispatch({type: 'SET_LOADING', value: false})
        }).catch((err) => {
            showError(err.message)
            dispatch({type: 'SET_LOADING', value: false})
        })

    }

    return (
        <View style={styles.page}>
            <Header 
                type="dark-profile" 
                title={dataDoctor.data.fullName}
                photo={{uri: dataDoctor.data.photo}}
                desc={dataDoctor.data.profession} 
                onPress={() => navigation.goBack()}
            />
            <View style={styles.content}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {chatData.map((chat) => {
                        return (
                            <View key={chat.id}>
                                <Text style={styles.chatDate}>{chat.id}</Text>
                                {chat.data.map((itemChat) => {
                                    const isMe = itemChat.data.sendBy === user.uid
                                    return (
                                        <ChatItem 
                                            key={itemChat.id}
                                            isMe={isMe}
                                            text={itemChat.data.chatContent}
                                            date={itemChat.data.chatTime}
                                            photo={isMe ? null : {uri: dataDoctor.data.photo}}
                                        />
                                    )
                                })}
                            </View>
                        )
                    })}
                </ScrollView>
            </View>
            <InputChat 
                value={chatContent}
                onChangeText={(value) => setChatContent(value)} onButtonPress={chatSend} />
        </View>
    )
}

export default Chatting

const styles = StyleSheet.create({
    page:{
        backgroundColor: colors.white,
        flex: 1
    },
    content:{flex: 1},
    chatDate:{
        fontSize: 11,
        fontFamily: fonts.primary.normal,
        color: colors.text.secondary,
        marginVertical: 20,
        textAlign: 'center'
    }
})
