
import * as React from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useSelector } from "react-redux";
import { RootState } from "../Storage/Redux/store";

/**
 * @typedef {import("../../Interfaces").userModel} userModel
 * @typedef {import("react-redux").DefaultRootState} RootState
 */

/**
 * @param {number} len
 * @returns {string}
 */
function randomID(len) {
  let result = '';
  var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

/**
 * @param {string} [url]
 * @returns {URLSearchParams}
 */
export function getUrlParams(url = window.location.href) {
  let urlStr = url.split('?')[1];
  return new URLSearchParams(urlStr);
}

/**
 * @returns {JSX.Element}
 */
export default function VideoCall() {
  /** @type {userModel} */
  const userData = useSelector(
    /** @param {RootState} state */
    (state) => state.userAuthStore
  );

  /** @type {string} */
  const roomID = getUrlParams().get('roomID') || randomID(5);

  /**
   * @param {HTMLElement} element
   * @returns {Promise<void>}
   */
  let myMeeting = async (element) => {
    if (!userData || !userData.fullName) return;

    // generate Kit Token
    const appID = 2027333321;
    const serverSecret = "18f5251a4d2b5c2ca4c7b306f0d25c03";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomID,
      randomID(5),
      userData.fullName
    );

    // Create instance object from Kit Token.
    const zp = ZegoUIKitPrebuilt.create(kitToken);

    // start the call
    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: 'Personal link',
          url:
            window.location.protocol +
            '//' +
            window.location.host +
            window.location.pathname +
            '?roomID=' +
            roomID,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].

      },
    });
  };

  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  );
}
