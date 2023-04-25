import AgoraUIKit, { layout } from 'agora-react-uikit';
import { loaderData } from '~/routes/channel/$channel';
import {  Flex } from '@chakra-ui/react';

export default function Videocall(props: loaderData) {
    const { appId, channel, rtcToken, rtmToken, username } = props
    return (
        <Flex w='100%' height='90%'>
            <AgoraUIKit
                rtcProps={{ appId, channel, token: rtcToken, layout: layout.grid }}
                rtmProps={{ token: rtmToken, uid: String(username), displayUsername: true, username: 'User' + String(username).slice(-3) }}
            />
        </Flex>
    )
}