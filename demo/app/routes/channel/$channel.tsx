import { RtcRole, RtcTokenBuilder, RtmRole, RtmTokenBuilder } from "agora-access-token";
import { useState } from 'react';
import { useLoaderData } from "@remix-run/react";
import { LoaderFunction, json } from "@remix-run/node";
import Videocall from '~/components/videocall.client'
import { Box, Heading, Button, Flex, ChakraProvider, Center } from "@chakra-ui/react";
import { Rnd } from "react-rnd";
import "react-resizable/css/styles.css";

export type loaderData = {
  rtcToken: string;
  rtmToken: string;
  appId: string;
  channel: string;
  username: number;
}

const style = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  // border: "solid 1px gray",
  borderRadius: '10px',
  background: "white",

} as const;

export const loader: LoaderFunction = async ({ params }) => {
  const { APP_ID, CERTIFICATE } = process.env as unknown as { APP_ID: string, CERTIFICATE: string }
  console.log(APP_ID, CERTIFICATE)
  const channel = params.channel as string
  const username = Date.now()
  const time = Math.floor(username / 1000) + 600
  const rtcToken = RtcTokenBuilder.buildTokenWithUid(APP_ID, CERTIFICATE, channel, 0, RtcRole.PUBLISHER, time)
  const rtmToken = RtmTokenBuilder.buildToken(APP_ID, CERTIFICATE, String(username), RtmRole.Rtm_User, time)
  const data: loaderData = { rtcToken, appId: APP_ID, channel, rtmToken, username }
  return json(data);
};

function BoxComponent() {
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const [baseSize, setBaseSize] = useState({
    width: 500,
    height: 400
  })
  const [position, setPosition] = useState({
    x: 500,
    y: 200,
  })


  const toggleBox = () => {
    setIsBoxOpen(!isBoxOpen);
  };

  const toggleFloating = () => {
    setIsFloating(!isFloating);

  };
  const handleCloseClick = () => {
    setIsBoxOpen(false);
  };


  const jsonData: loaderData = useLoaderData()
  const { rtcToken, rtmToken, appId, channel, username } = jsonData
  console.log(rtcToken,"RtC Token");
  console.log(rtmToken,"RTM TOken")
  return (
    <Flex
      direction={'row'}
      justify='center'
      w='1200px'
      h='800px'
    >
      <Flex direction={'row'}>
        <Heading pr='16px'>
          To Start call press this button!
        </Heading>
        <Button onClick={toggleBox}>Video Call</Button>
      </Flex>

      {isBoxOpen && (
        <Rnd
          style={style}
          position={isFloating ? position : {
            x: 50,
            y: 50
          }}
          size={isFloating ? baseSize : {
            width: '80%',
            height: '80%'
          }}
          minHeight='400px'
          minWidth='500px'
          enableResizing={isFloating ? {
            top: false,
            right: true,
            bottom: true,
            left: false,
            topRight: false,
            bottomRight: true,
            bottomLeft: false,
            topLeft: false
          }
            :
            false
          }
          disableDragging={isFloating ? false : true}
          onDragStop={(e, d) => { setPosition({ x: d.x, y: d.y }) }}
          onResize={(e, direction, ref, delta, position) => {
            setBaseSize({
              width: ref.offsetWidth,
              height: ref.offsetHeight,
            });
          }}
        >
          <Box
            height='100%'
            width='100%'
            p={4}
          >
            <Box mb={2} display="flex" justifyContent="space-between" className="handle">
              <Center>
                <Heading
                  fontSize='18px' >
                  Video Call on going
                </Heading>
              </Center>
              <Box>
                <Button mr='2' colorScheme='teal' onClick={toggleFloating}>
                  {isFloating ? 'Stop Float' : 'Float'}
                </Button>
                <Button colorScheme='red' onClick={handleCloseClick}>
                  Close
                </Button>
              </Box>
            </Box>
            <Videocall
              appId={appId}
              channel={channel}
              rtcToken={rtcToken}
              rtmToken={rtmToken}
              username={username}
            />
          </Box>
        </Rnd>
      )
      }
    </Flex >

  );
}



export default function Application() {
  return (
    <ChakraProvider>
      <Flex p={8}>
        <BoxComponent />
      </Flex>
    </ChakraProvider>
  );
}

