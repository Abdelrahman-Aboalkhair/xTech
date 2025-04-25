import { useState, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";

interface WebRTCCallProps {
  chatId: string;
  socket: Socket | null;
}

export const useWebRTCCall = ({ chatId, socket }: WebRTCCallProps) => {
  const [callStatus, setCallStatus] = useState<
    "idle" | "calling" | "in-call" | "ended"
  >("idle");
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startCall = async () => {
    if (!socket) return;

    try {
      setCallStatus("calling");
      localStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      remoteStreamRef.current = new MediaStream();

      peerConnectionRef.current = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      localStreamRef.current.getTracks().forEach((track) => {
        peerConnectionRef.current?.addTrack(track, localStreamRef.current!);
      });

      peerConnectionRef.current.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStreamRef.current?.addTrack(track);
        });
      };

      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("iceCandidate", {
            chatId,
            candidate: event.candidate,
            to: null,
          });
        }
      };

      peerConnectionRef.current.onconnectionstatechange = () => {
        if (peerConnectionRef.current?.connectionState === "connected") {
          setCallStatus("in-call");
        }
      };

      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      socket.emit("callOffer", { chatId, offer });
    } catch (error) {
      console.error("Failed to start call:", error);
      endCall();
    }
  };

  const answerCall = async (offer: RTCSessionDescriptionInit, from: string) => {
    if (!socket) return;

    try {
      setCallStatus("calling");
      localStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      remoteStreamRef.current = new MediaStream();

      peerConnectionRef.current = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      localStreamRef.current.getTracks().forEach((track) => {
        peerConnectionRef.current?.addTrack(track, localStreamRef.current!);
      });

      peerConnectionRef.current.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStreamRef.current?.addTrack(track);
        });
      };

      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("iceCandidate", {
            chatId,
            candidate: event.candidate,
            to: from,
          });
        }
      };

      peerConnectionRef.current.onconnectionstatechange = () => {
        if (peerConnectionRef.current?.connectionState === "connected") {
          setCallStatus("in-call");
        }
      };

      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      socket.emit("callAnswer", { chatId, answer, to: from });
    } catch (error) {
      console.error("Failed to answer call:", error);
      endCall();
    }
  };

  const endCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (remoteStreamRef.current) {
      remoteStreamRef.current = null;
    }
    if (socket) {
      socket.emit("endCall", { chatId });
    }
    setCallStatus("ended");
    setTimeout(() => setCallStatus("idle"), 1000);
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("callOffer", ({ offer, from }) => {
      if (callStatus === "idle") {
        answerCall(offer, from);
      }
    });

    socket.on("callAnswer", ({ answer }) => {
      if (peerConnectionRef.current && callStatus === "calling") {
        peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      }
    });

    socket.on("iceCandidate", ({ candidate }) => {
      if (peerConnectionRef.current && candidate) {
        peerConnectionRef.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      }
    });

    socket.on("callEnded", () => {
      endCall();
    });

    return () => {
      socket.off("callOffer");
      socket.off("callAnswer");
      socket.off("iceCandidate");
      socket.off("callEnded");
    };
  }, [socket, callStatus]);

  useEffect(() => {
    if (audioRef.current && remoteStreamRef.current) {
      audioRef.current.srcObject = remoteStreamRef.current;
    }
  }, [remoteStreamRef.current]);

  return { callStatus, startCall, endCall, audioRef };
};
