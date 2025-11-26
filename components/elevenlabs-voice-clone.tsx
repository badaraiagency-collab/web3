"use client";

import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Mic,
  MicOff,
  Upload,
  Play,
  Square,
  Loader2,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  Shield,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiService } from "@/lib/api";

interface VoiceCloneProps {
  onSuccess?: () => void;
}

interface VoiceCloneResponse {
  voice_id: string;
  name: string;
  type: string;
  status?: string;
  description?: string | null;
}

interface PvcCaptchaResponse {
  success: boolean;
  message: string;
  data: {
    voice_id: string;
    captcha_text: string;
  };
}

const VoiceClone: React.FC<VoiceCloneProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [recordingLevel, setRecordingLevel] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMicConnected, setIsMicConnected] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [currentTime, setCurrentTime] = useState(0);

  // Voice configuration inputs
  const [voiceName, setVoiceName] = useState("");
  const [voiceLanguage, setVoiceLanguage] = useState("en");
  const [voiceAccent, setVoiceAccent] = useState("neutral");
  const [voiceAge, setVoiceAge] = useState("middle_aged");
  const [voiceGender, setVoiceGender] = useState("neutral");
  const [voiceUseCase, setVoiceUseCase] = useState("personal");

  // Validation errors
  const [validationErrors, setValidationErrors] = useState<{
    voiceName?: string;
    voiceLanguage?: string;
    voiceAccent?: string;
    voiceAge?: string;
    voiceGender?: string;
    voiceUseCase?: string;
  }>({});

  // Results
  const [orderId, setOrderId] = useState<string | null>(null);
  const [verificationImage, setVerificationImage] = useState<string | null>(
    null
  );
  const [isVerified, setIsVerified] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string>("");

  // Custom verification states
  const [showVerificationStep, setShowVerificationStep] = useState(false);
  const [verificationAudioBlob, setVerificationAudioBlob] =
    useState<Blob | null>(null);
  const [isRecordingVerification, setIsRecordingVerification] = useState(false);
  const [verificationRecordingTime, setVerificationRecordingTime] = useState(0);
  
  // PVC Captcha
  const [pvcCaptchaText, setPvcCaptchaText] = useState<string | null>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState("pvc");

  // File upload states
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // IVC specific states
  const [ivcOrderId, setIvcOrderId] = useState<string | null>(null);
  const [ivcVerificationImage, setIvcVerificationImage] = useState<
    string | null
  >(null);
  const [ivcIsVerified, setIvcIsVerified] = useState(false);
  const [ivcVerificationStatus, setIvcVerificationStatus] =
    useState<string>("");
  const [showIvcVerificationStep, setShowIvcVerificationStep] = useState(false);
  const [ivcVerificationAudioBlob, setIvcVerificationAudioBlob] =
    useState<Blob | null>(null);
  const [isRecordingIvcVerification, setIsRecordingIvcVerification] =
    useState(false);
  const [ivcVerificationRecordingTime, setIvcVerificationRecordingTime] =
    useState(0);

  // Demo voice states
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [isGeneratingDemo, setIsGeneratingDemo] = useState(false);
  const [demoAudioUrl, setDemoAudioUrl] = useState<string | null>(null);
  const demoAudioRef = useRef<HTMLAudioElement | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    try {
      console.log("Starting recording...");

      // Check if MediaRecorder is supported
      if (!window.MediaRecorder) {
        throw new Error("MediaRecorder not supported in this browser");
      }

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("getUserMedia not supported in this browser");
      }

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 1,
        },
      });

      console.log("Microphone access granted, stream:", stream);
      streamRef.current = stream;
      setIsMicConnected(true);

      // Find best mime type
      let mimeType = "audio/webm;codecs=opus";
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        mimeType = "audio/webm;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/webm")) {
        mimeType = "audio/webm";
      } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
        mimeType = "audio/mp4";
      } else if (MediaRecorder.isTypeSupported("audio/wav")) {
        mimeType = "audio/wav";
      } else {
        mimeType = "audio/webm";
      }

      console.log("Using MIME type:", mimeType);

      // Create MediaRecorder
      let mediaRecorder;
      try {
        mediaRecorder = new MediaRecorder(stream, {
          mimeType: mimeType,
          audioBitsPerSecond: 128000,
        });
      } catch (error) {
        console.warn(
          "Failed to create MediaRecorder with mime type:",
          mimeType,
          "falling back to default"
        );
        mediaRecorder = new MediaRecorder(stream);
      }

      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        console.log("Data available:", event.data.size, "bytes");
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstart = () => {
        console.log("MediaRecorder started successfully");
      };

      mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        toast({
          title: "Recording Error",
          description: "An error occurred during recording",
          variant: "destructive",
        });
      };

      mediaRecorder.onstop = () => {
        console.log("MediaRecorder stopped, processing chunks...");

        const recordedBlob = new Blob(chunks, { type: mimeType });
        console.log(
          "Created blob:",
          recordedBlob.size,
          "bytes, type:",
          recordedBlob.type
        );

        setAudioBlob(recordedBlob);
        setAudioUrl(URL.createObjectURL(recordedBlob));

        // Stop all tracks and clean up
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => {
            track.stop();
            console.log("Stopped track:", track.kind);
          });
        }
        setIsMicConnected(false);
        setRecordingLevel(0);
      };

      // Start recording
      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);

      console.log("MediaRecorder.start() called");

      // Start timer
      let currentRecordingTime = 0;
      recordingIntervalRef.current = setInterval(() => {
        currentRecordingTime += 1;
        setRecordingTime(currentRecordingTime);

        console.log("currentRecordingTime:", currentRecordingTime);

        // Check for auto-stop at 1 minute (60 seconds) for IVC
        if (currentRecordingTime >= 60) {
          console.log(
            "Auto-stopping recording at",
            currentRecordingTime,
            "seconds (1 minute limit)"
          );
          stopRecording();
          clearInterval(recordingIntervalRef.current!);
          toast({
            title: "Recording Auto-Stopped",
            description: "Recording automatically stopped at 1 minute limit",
            duration: 3000,
          });
        }
      }, 1000);

      // Simple audio level simulation for visualization
      const levelInterval = setInterval(() => {
        if (isRecording) {
          const baseLevel = Math.random() * 50 + 20;
          setRecordingLevel(baseLevel);
        }
      }, 100);

      // Store the level interval reference
      (recordingIntervalRef as any).levelInterval = levelInterval;

      toast({
        title: "Recording started",
        description: "Speak clearly - click Stop when finished",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error starting recording:", error);

      let errorMessage = "Please allow microphone access and try again";
      let errorTitle = "Recording failed";

      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          errorTitle = "Microphone Access Denied";
          errorMessage =
            "Please allow microphone access in your browser settings and try again.";
        } else if (error.name === "NotFoundError") {
          errorTitle = "No Microphone Found";
          errorMessage = "Please connect a microphone and try again.";
        } else if (error.name === "NotSupportedError") {
          errorTitle = "Browser Not Supported";
          errorMessage =
            "MediaRecorder not supported in this browser. Please use Chrome, Firefox, or Safari.";
        } else if (error.name === "NotReadableError") {
          errorTitle = "Microphone Busy";
          errorMessage =
            "Microphone is being used by another application. Please close other apps and try again.";
        } else if (error.name === "AbortError") {
          errorTitle = "Recording Aborted";
          errorMessage = "Recording was aborted. Please try again.";
        } else {
          errorMessage = `Recording error: ${error.message}`;
        }
      }

      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });

      setIsRecording(false);
      setIsMicConnected(false);
      setRecordingLevel(0);
    }
  }, [toast]);

  const stopRecording = useCallback(() => {
    console.log(
      "stopRecording called, isRecording:",
      isRecording,
      "mediaRecorder:",
      !!mediaRecorderRef.current
    );

    console.log("recordingTime:", recordingTime);

    // Force stop the mediaRecorder regardless of isRecording state
    if (mediaRecorderRef.current) {
      console.log("Stopping mediaRecorder...");
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }

      // Clear the level interval as well
      if ((recordingIntervalRef as any).levelInterval) {
        clearInterval((recordingIntervalRef as any).levelInterval);
      }

      setIsMicConnected(false);
      setRecordingLevel(0);

      toast({
        title: "Recording stopped",
        description: `Recorded ${recordingTime} seconds of audio`,
        duration: 3000,
      });
    } else {
      console.log("No mediaRecorder found to stop");
    }
  }, [isRecording, recordingTime, toast]);

  const uploadToVoiceService = async () => {
    if (!audioBlob) {
      toast({
        title: "No audio to upload",
        description: "Please record audio first",
        variant: "destructive",
      });
      return;
    }

    // Validate minimum recording time for PVC (30 seconds)
    if (recordingTime < 30) {
      toast({
        title: "Recording Too Short",
        description: "PVC requires at least 30 seconds of audio. Please record more audio.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    // Validate form before upload
    if (!validateForm()) {
      toast({
        title: "Form Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      // Create FormData for PVC upload
      const formData = new FormData();
      
      // Convert blob to file
      const audioFile = new File([audioBlob], `voice_${Date.now()}.mp3`, {
        type: "audio/mp3",
      });
      
      formData.append("files", audioFile);
      formData.append("name", voiceName || `Voice Clone ${Date.now()}`);
      formData.append("type", "PVC");
      formData.append("language", voiceLanguage || "en");
      formData.append("remove_background_noise", "true");
      formData.append("description", `PVC voice clone - ${voiceAccent} accent, ${voiceAge} age, ${voiceGender} gender, ${voiceUseCase} use case`);

      console.log("Uploading PVC Voice Clone to backend...");

      // Call backend API
      const response = await apiService.uploadVoiceClone(formData, { 
        showToast: true,
        toastMessage: 'PVC voice uploaded successfully!'
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      console.log("Backend API response:", response);

      if (response.success) {
        const voiceId = response.data.voice_id;
        setOrderId(voiceId);

        // Save voice details to database
        try {
          await apiService.createClonedVoice({
            voice_name: voiceName || `Voice Clone ${Date.now()}`,
            voice_id: voiceId,
            language: voiceLanguage || "en",
            accent: voiceAccent,
            age: voiceAge,
            gender: voiceGender,
            use_case: voiceUseCase,
          }, {
            showToast: false  // Don't show toast for this internal operation
          });
          console.log("Voice details saved to database");
        } catch (dbError) {
          console.error("Error saving voice to database:", dbError);
          // Continue even if database save fails - voice is already cloned
        }

        // Call onSuccess callback to refresh voices list
        onSuccess?.();

        // Check if PVC requires verification
        if (response.data.status === "awaiting_verification") {
          // Get captcha text for verification
          try {
            const captchaResponse = await apiService.getPvcCaptcha(voiceId, { 
              showToast: true,
              toastMessage: 'Captcha text retrieved successfully'
            });
            
            if (captchaResponse.success) {
              setPvcCaptchaText(captchaResponse.data.captcha_text);
              setShowVerificationStep(true);
              setVerificationStatus("Please verify your voice by reading the captcha text");
            }
          } catch (captchaError) {
            console.error("Error fetching captcha:", captchaError);
            // Toast already shown by API service
          }
        } else {
          // No verification needed - mark as complete
          setIsVerified(true);
          setVerificationStatus("Voice clone created successfully");
          setShowVerificationStep(false);

          toast({
            title: "Voice Clone Complete!",
            description: `Voice ID: ${voiceId} - Ready to use`,
            duration: 5000,
          });

          console.log("Voice clone Voice ID (no verification required):", voiceId);
        }
      } else {
        throw new Error(response.message || "Upload failed");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      // Toast already shown by API cache manager
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const uploadToVoiceServiceIvc = async () => {
    if (!audioBlob) {
      toast({
        title: "No audio to upload",
        description: "Please record audio first",
        variant: "destructive",
      });
      return;
    }

    console.log("Audio blob:", audioBlob);

    // Check minimum recording duration for IVC
    if (recordingTime < 10) {
      toast({
        title: "Recording Too Short",
        description: "IVC requires at least 10 seconds of audio. Please record more.",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) {
      toast({
        title: "Form Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      // Create FormData for IVC upload
      const formData = new FormData();
      
      // Convert blob to file
      const audioFile = new File([audioBlob], `voice_${Date.now()}.mp3`, {
        type: "audio/mp3",
      });

      console.log("Audio file for IVC:", audioFile);

      formData.append("files", audioFile);
      formData.append("name", voiceName || `IVC Voice Clone ${Date.now()}`);
      formData.append("type", "IVC");
      formData.append("remove_background_noise", "true");
      formData.append("description", `IVC voice clone - ${voiceAccent} accent, ${voiceAge} age, ${voiceGender} gender, ${voiceUseCase} use case`);

      console.log("Uploading IVC Voice Clone to backend...");

      // Call backend API
      const response = await apiService.uploadVoiceClone(formData, { 
        showToast: true,
        toastMessage: 'IVC voice uploaded successfully!'
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      console.log("Backend IVC API response:", response);

      if (response.success) {
        const voiceId = response.data.voice_id;
        setIvcOrderId(voiceId);

        // Save voice details to database
        try {
          await apiService.createClonedVoice({
            voice_name: voiceName || `IVC Voice Clone ${Date.now()}`,
            voice_id: voiceId,
            language: voiceLanguage || "en",
            accent: voiceAccent,
            age: voiceAge,
            gender: voiceGender,
            use_case: voiceUseCase,
          }, {
            showToast: false  // Don't show toast for this internal operation
          });
          console.log("IVC voice details saved to database");
        } catch (dbError) {
          console.error("Error saving IVC voice to database:", dbError);
          // Continue even if database save fails - voice is already cloned
        }

        // Call onSuccess callback to refresh voices list
        onSuccess?.();

        setIvcIsVerified(true);
        setIvcVerificationStatus("IVC Voice uploaded successfully");
        setShowIvcVerificationStep(false);

        toast({
          title: "IVC Voice Clone Complete!",
          description: "Your instant voice clone is ready to use.",
          duration: 7000,
        });

        console.log("IVC Voice clone Voice ID:", voiceId);
      } else {
        throw new Error(response.message || "IVC upload failed");
      }
    } catch (error: any) {
      console.error("IVC Upload error:", error);
      // Toast already shown by API cache manager
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const startVerificationRecording = async () => {
    try {
      console.log("Starting verification recording...");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 1,
        },
      });

      streamRef.current = stream;
      setIsMicConnected(true);

      let mimeType = "audio/webm;codecs=opus";
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        mimeType = "audio/webm;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/webm")) {
        mimeType = "audio/webm";
      } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
        mimeType = "audio/mp4";
      } else if (MediaRecorder.isTypeSupported("audio/wav")) {
        mimeType = "audio/wav";
      } else {
        mimeType = "audio/webm";
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType,
        audioBitsPerSecond: 128000,
      });

      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const recordedBlob = new Blob(chunks, { type: mimeType });
        setVerificationAudioBlob(recordedBlob);

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => {
            track.stop();
          });
        }
        setIsMicConnected(false);
      };

      mediaRecorder.start(100);
      setIsRecordingVerification(true);
      setVerificationRecordingTime(0);

      // Start timer
      const interval = setInterval(() => {
        setVerificationRecordingTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= 10) {
            // 10 seconds for verification
            stopVerificationRecording();
            clearInterval(interval);
          }
          return newTime;
        });
      }, 1000);

      toast({
        title: "Verification Recording Started",
        description:
          "Please speak clearly for verification (auto-stops at 10s)",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error starting verification recording:", error);
      toast({
        title: "Recording Failed",
        description: "Please allow microphone access and try again",
        variant: "destructive",
      });
    }
  };

  const stopVerificationRecording = () => {
    if (mediaRecorderRef.current && isRecordingVerification) {
      mediaRecorderRef.current.stop();
      setIsRecordingVerification(false);
      setIsMicConnected(false);

      toast({
        title: "Verification Recording Complete",
        description: `Recorded ${verificationRecordingTime} seconds`,
        duration: 3000,
      });
    }
  };

  const startIvcVerificationRecording = async () => {
    try {
      console.log("Starting IVC verification recording...");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 1,
        },
      });

      streamRef.current = stream;
      setIsMicConnected(true);

      let mimeType = "audio/webm;codecs=opus";
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        mimeType = "audio/webm;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/webm")) {
        mimeType = "audio/webm";
      } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
        mimeType = "audio/mp4";
      } else if (MediaRecorder.isTypeSupported("audio/wav")) {
        mimeType = "audio/wav";
      } else {
        mimeType = "audio/webm";
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType,
        audioBitsPerSecond: 128000,
      });

      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const recordedBlob = new Blob(chunks, { type: mimeType });
        setIvcVerificationAudioBlob(recordedBlob);

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => {
            track.stop();
          });
        }
        setIsMicConnected(false);
      };

      mediaRecorder.start(100);
      setIsRecordingIvcVerification(true);
      setIvcVerificationRecordingTime(0);

      // Start timer - 20 seconds limit for IVC
      const interval = setInterval(() => {
        setIvcVerificationRecordingTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= 20) {
            // 20 seconds for IVC verification
            stopIvcVerificationRecording();
            clearInterval(interval);
          }
          return newTime;
        });
      }, 1000);

      toast({
        title: "IVC Verification Recording Started",
        description:
          "Please speak clearly for verification (auto-stops at 20s)",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error starting IVC verification recording:", error);
      toast({
        title: "Recording Failed",
        description: "Please allow microphone access and try again",
        variant: "destructive",
      });
    }
  };

  const stopIvcVerificationRecording = () => {
    if (mediaRecorderRef.current && isRecordingIvcVerification) {
      mediaRecorderRef.current.stop();
      setIsRecordingIvcVerification(false);
      setIsMicConnected(false);

      toast({
        title: "IVC Verification Recording Complete",
        description: `Recorded ${ivcVerificationRecordingTime} seconds`,
        duration: 3000,
      });
    }
  };

  const verifyIvcVoice = async () => {
    if (!ivcVerificationAudioBlob) {
      toast({
        title: "No Verification Audio",
        description: "Please record verification audio first",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);

    try {
      // Simple verification logic - compare audio duration and size
      const originalSize = audioBlob?.size || 0;
      const verificationSize = ivcVerificationAudioBlob.size;

      // Basic verification: check if verification audio is reasonable length (max 20s for IVC)
      const isReasonableLength =
        ivcVerificationRecordingTime >= 3 && ivcVerificationRecordingTime <= 20;
      const isReasonableSize =
        verificationSize > 10000 && verificationSize < 2000000;

      if (isReasonableLength && isReasonableSize) {
        setIvcIsVerified(true);
        setIvcVerificationStatus("IVC Voice verified successfully");
        setShowIvcVerificationStep(false);

        toast({
          title: "IVC Voice Verified Successfully!",
          description: `Voice ID: ${ivcOrderId} - IVC Voice clone is ready to use`,
          duration: 5000,
        });
      } else {
        throw new Error(
          "Verification failed - please record clear audio (max 20s)"
        );
      }
    } catch (error) {
      console.error("IVC Verification error:", error);
      toast({
        title: "IVC Verification Failed",
        description:
          error instanceof Error ? error.message : "Please try recording again",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const verifyVoice = async () => {
    if (!verificationAudioBlob) {
      toast({
        title: "No Verification Audio",
        description: "Please record verification audio first",
        variant: "destructive",
      });
      return;
    }

    if (!orderId || !pvcCaptchaText) {
      toast({
        title: "Missing Information",
        description: "Voice ID or captcha text is missing",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);

    try {
      // Create FormData for PVC verification
      const formData = new FormData();
      
      // Convert blob to file
      const verificationFile = new File([verificationAudioBlob], `verification_${Date.now()}.mp3`, {
        type: "audio/mp3",
      });
      
      formData.append("voice_id", orderId);
      formData.append("captcha_text", pvcCaptchaText);
      formData.append("verification_file", verificationFile);

      console.log("Submitting PVC verification to backend...");

      // Call backend API
      const response = await apiService.verifyPvc(formData, { 
        showToast: true,
        toastMessage: 'Voice verification submitted successfully!'
      });

      console.log("Verification response:", response);

      if (response.success) {
        setIsVerified(true);
        setVerificationStatus("Voice verified successfully - in fine-tuning queue");
        setShowVerificationStep(false);

        // Call onSuccess callback to refresh voices list
        onSuccess?.();

        // Log voice ID to console as requested
        console.log("Verified PVC voice clone Voice ID:", orderId);
      } else {
        throw new Error(response.message || "Verification failed");
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      // Toast already shown by API cache manager
    } finally {
      setIsVerifying(false);
    }
  };

  const playAudio = () => {
    if (audioUrl) {
      // If already playing, stop first
      if (currentAudio && !currentAudio.paused) {
        stopAudio();
        return;
      }

      const audio = new Audio(audioUrl);
      setCurrentAudio(audio);
      setIsPlaying(true);

      // Set current time if resuming
      if (currentTime > 0) {
        audio.currentTime = currentTime;
      }

      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
      };

      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        setCurrentAudio(null);
        setCurrentTime(0);
      };

      audio.onerror = () => {
        setIsPlaying(false);
        setCurrentAudio(null);
        setCurrentTime(0);
        toast({
          title: "Playback Error",
          description: "Could not play audio file",
          variant: "destructive",
        });
      };

      audio.play().catch((error) => {
        setIsPlaying(false);
        setCurrentAudio(null);
        setCurrentTime(0);
        console.error("Audio play error:", error);
        toast({
          title: "Playback Failed",
          description: "Could not start audio playback",
          variant: "destructive",
        });
      });
    }
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      setIsPlaying(false);
      setCurrentAudio(null);
      // Keep currentTime for resume functionality - don't reset it
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const playDemoVoice = async (voiceId: string) => {
    if (!voiceId) {
      toast({
        title: "No Voice ID",
        description: "Voice ID is missing. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // If already playing, stop it
    if (isDemoPlaying && demoAudioRef.current) {
      demoAudioRef.current.pause();
      setIsDemoPlaying(false);
      if (demoAudioUrl) {
        URL.revokeObjectURL(demoAudioUrl);
      }
      setDemoAudioUrl(null);
      demoAudioRef.current = null;
      return;
    }

    setIsGeneratingDemo(true);

    try {
      // Demo text that's short and engaging (under 10 seconds)
      const demoText = "Hello! This is a demo of your cloned voice. The quality is amazing!";
      
      console.log("=== Starting TTS Demo ===");
      console.log("Voice ID:", voiceId);
      console.log("Demo text:", demoText);
      
      const audioBlob = await apiService.textToSpeech(voiceId, demoText);
      
      console.log("Audio blob received:", audioBlob);
      console.log("Blob size:", audioBlob.size);
      console.log("Blob type:", audioBlob.type);
      
      // Create URL from blob
      const url = URL.createObjectURL(audioBlob);
      console.log("Audio URL created:", url);
      setDemoAudioUrl(url);

      // Create and play audio
      const audio = new Audio(url);
      demoAudioRef.current = audio;
      
      console.log("Audio element created");

      audio.onended = () => {
        console.log("Audio playback ended");
        setIsDemoPlaying(false);
        URL.revokeObjectURL(url);
        setDemoAudioUrl(null);
        demoAudioRef.current = null;
      };

      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        toast({
          title: "Playback Error",
          description: "Failed to play demo audio",
          variant: "destructive",
        });
        setIsDemoPlaying(false);
        URL.revokeObjectURL(url);
        setDemoAudioUrl(null);
        demoAudioRef.current = null;
      };

      console.log("Attempting to play audio...");
      await audio.play();
      console.log("Audio playing successfully");
      setIsDemoPlaying(true);

      toast({
        title: "Playing Demo",
        description: "Listening to your cloned voice...",
        duration: 3000,
      });
    } catch (error: any) {
      console.error("=== Demo voice error ===");
      console.error("Error details:", error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      toast({
        title: "Demo Failed",
        description: error.message || "Failed to generate demo audio",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsGeneratingDemo(false);
    }
  };

  // Validation functions
  const validateForm = () => {
    const errors: typeof validationErrors = {};

    if (!voiceName.trim()) {
      errors.voiceName = "Voice name is required";
    }

    if (!voiceLanguage) {
      errors.voiceLanguage = "Language is required";
    }

    if (!voiceAccent) {
      errors.voiceAccent = "Accent is required";
    }

    if (!voiceAge) {
      errors.voiceAge = "Age is required";
    }

    if (!voiceGender) {
      errors.voiceGender = "Gender is required";
    }

    if (!voiceUseCase) {
      errors.voiceUseCase = "Use case is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isFormValid = () => {
    return (
      voiceName.trim() &&
      voiceLanguage &&
      voiceAccent &&
      voiceAge &&
      voiceGender &&
      voiceUseCase
    );
  };

  const resetForm = () => {
    if (isRecording) {
      stopRecording();
    }

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setOrderId(null);
    setVerificationImage(null);
    setIsVerified(false);
    setVerificationStatus("");
    setIsDragOver(false);
    setRecordingLevel(0);
    setIsMicConnected(false);
    setUploadedFile(null);
    setIsPlaying(false);
    setCurrentAudio(null);
    setCurrentTime(0);

    // Reset voice configuration
    setVoiceName("");
    setVoiceLanguage("en");
    setVoiceAccent("neutral");
    setVoiceAge("middle_aged");
    setVoiceGender("neutral");
    setVoiceUseCase("personal");

    // Clear validation errors
    setValidationErrors({});
  };

  const resetIvcForm = () => {
    if (isRecording) {
      stopRecording();
    }

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setIvcOrderId(null);
    setIvcVerificationImage(null);
    setIvcIsVerified(false);
    setIvcVerificationStatus("");
    setIsDragOver(false);
    setRecordingLevel(0);
    setIsMicConnected(false);
    setUploadedFile(null);
    setIsPlaying(false);
    setCurrentAudio(null);
    setCurrentTime(0);

    // Reset voice configuration
    setVoiceName("");
    setVoiceLanguage("en");
    setVoiceAccent("neutral");
    setVoiceAge("middle_aged");
    setVoiceGender("neutral");
    setVoiceUseCase("personal");

    // Clear validation errors
    setValidationErrors({});
  };

  const handleTabChange = (newTab: string) => {
    // Reset data when switching tabs
    if (newTab === "pvc" && activeTab === "ivc") {
      resetIvcForm();
    } else if (newTab === "ivc" && activeTab === "pvc") {
      resetForm();
    }
    setActiveTab(newTab);
  };

  const handleFileUpload = (file: File) => {
    // Check file type
    const allowedTypes = [
      "audio/mp3",
      "audio/wav",
      "audio/m4a",
      "audio/webm",
      "audio/ogg",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload MP3, WAV, M4A, WebM, or OGG files only",
        variant: "destructive",
      });
      return;
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload files smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);

    // Convert file to blob for processing
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const blob = new Blob([arrayBuffer], { type: file.type });
      setAudioBlob(blob);

      // Create URL for playback
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      // Estimate duration (rough calculation)
      const estimatedDuration = Math.min(file.size / 32000, 30); // Rough estimate
      setRecordingTime(Math.round(estimatedDuration));

      toast({
        title: "File uploaded successfully",
        description: `${file.name} is ready for processing`,
        duration: 3000,
      });
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="space-y-8">
          {/* Enhanced Header Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 mb-4 shadow-lg">
              <Mic className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent font-heading">
              Voice Clone Studio
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Create professional AI voice clones with advanced synthesis
              technology. Choose between instant cloning or professional-grade
              voice synthesis.
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted/50 p-1 rounded-xl shadow-sm border">
                <TabsTrigger
                  value="pvc"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all duration-200"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    Professional PVC
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="ivc"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-medium transition-all duration-200"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Instant IVC
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="pvc" className="space-y-6">
              {/* PVC Description - Compact */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-700/50 shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5"></div>
                <div className="relative p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 font-heading">
                      Professional Voice Cloning (PVC)
                    </h3>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-3 leading-relaxed">
                    Advanced voice synthesis with comprehensive emotional range
                    and expression capture
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <span>Captures all expressions & emotions</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <span>Processing: 5-15 minutes</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <span>Best for commercial use</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Voice Configuration Form */}
              <Card className="card-hover shadow-xl border-0 bg-gradient-to-br from-background via-background to-muted/20">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20">
                      <ImageIcon className="h-5 w-5 text-primary" />
                    </div>
                    Voice Configuration
                  </CardTitle>
                  <CardDescription className="text-base">
                    Configure your voice clone settings before recording for
                    optimal results
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Voice Name */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="voice-name"
                        className="text-sm font-semibold text-foreground"
                      >
                        Voice Name *
                      </Label>
                      <Input
                        id="voice-name"
                        placeholder="Enter voice name"
                        value={voiceName}
                        onChange={(e) => setVoiceName(e.target.value)}
                        className={`h-11 transition-all duration-200 ${
                          validationErrors.voiceName
                            ? "border-red-500 focus:ring-red-500/20"
                            : "focus:ring-primary/20 hover:border-primary/50"
                        }`}
                      />
                      {validationErrors.voiceName && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <XCircle className="h-4 w-4" />
                          {validationErrors.voiceName}
                        </p>
                      )}
                    </div>

                    {/* Language */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="voice-language"
                        className="text-sm font-semibold text-foreground"
                      >
                        Language *
                      </Label>
                      <Select
                        value={voiceLanguage}
                        onValueChange={setVoiceLanguage}
                      >
                        <SelectTrigger
                          className={`h-11 transition-all duration-200 ${
                            validationErrors.voiceLanguage
                              ? "border-red-500 focus:ring-red-500/20"
                              : "focus:ring-primary/20 hover:border-primary/50"
                          }`}
                        >
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">🇺🇸 English</SelectItem>
                          <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                          <SelectItem value="fr">🇫🇷 French</SelectItem>
                          <SelectItem value="de">🇩🇪 German</SelectItem>
                          <SelectItem value="it">🇮🇹 Italian</SelectItem>
                          <SelectItem value="pt">🇵🇹 Portuguese</SelectItem>
                          <SelectItem value="ru">🇷🇺 Russian</SelectItem>
                          <SelectItem value="ja">🇯🇵 Japanese</SelectItem>
                          <SelectItem value="ko">🇰🇷 Korean</SelectItem>
                          <SelectItem value="zh">🇨🇳 Chinese</SelectItem>
                        </SelectContent>
                      </Select>
                      {validationErrors.voiceLanguage && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <XCircle className="h-4 w-4" />
                          {validationErrors.voiceLanguage}
                        </p>
                      )}
                    </div>

                    {/* Accent */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="voice-accent"
                        className="text-sm font-semibold text-foreground"
                      >
                        Accent *
                      </Label>
                      <Select
                        value={voiceAccent}
                        onValueChange={setVoiceAccent}
                      >
                        <SelectTrigger
                          className={`h-11 transition-all duration-200 ${
                            validationErrors.voiceAccent
                              ? "border-red-500 focus:ring-red-500/20"
                              : "focus:ring-primary/20 hover:border-primary/50"
                          }`}
                        >
                          <SelectValue placeholder="Select accent" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="neutral">🌍 Neutral</SelectItem>
                          <SelectItem value="american">🇺🇸 American</SelectItem>
                          <SelectItem value="british">🇬🇧 British</SelectItem>
                          <SelectItem value="australian">
                            🇦🇺 Australian
                          </SelectItem>
                          <SelectItem value="canadian">🇨🇦 Canadian</SelectItem>
                        </SelectContent>
                      </Select>
                      {validationErrors.voiceAccent && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <XCircle className="h-4 w-4" />
                          {validationErrors.voiceAccent}
                        </p>
                      )}
                    </div>

                    {/* Age */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="voice-age"
                        className="text-sm font-semibold text-foreground"
                      >
                        Age *
                      </Label>
                      <Select value={voiceAge} onValueChange={setVoiceAge}>
                        <SelectTrigger
                          className={`h-11 transition-all duration-200 ${
                            validationErrors.voiceAge
                              ? "border-red-500 focus:ring-red-500/20"
                              : "focus:ring-primary/20 hover:border-primary/50"
                          }`}
                        >
                          <SelectValue placeholder="Select age" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="young">👶 Young</SelectItem>
                          <SelectItem value="middle_aged">
                            👨 Middle Aged
                          </SelectItem>
                          <SelectItem value="old">👴 Old</SelectItem>
                        </SelectContent>
                      </Select>
                      {validationErrors.voiceAge && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <XCircle className="h-4 w-4" />
                          {validationErrors.voiceAge}
                        </p>
                      )}
                    </div>

                    {/* Gender */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="voice-gender"
                        className="text-sm font-semibold text-foreground"
                      >
                        Gender *
                      </Label>
                      <Select
                        value={voiceGender}
                        onValueChange={setVoiceGender}
                      >
                        <SelectTrigger
                          className={`h-11 transition-all duration-200 ${
                            validationErrors.voiceGender
                              ? "border-red-500 focus:ring-red-500/20"
                              : "focus:ring-primary/20 hover:border-primary/50"
                          }`}
                        >
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">👨 Male</SelectItem>
                          <SelectItem value="female">👩 Female</SelectItem>
                          <SelectItem value="neutral">⚧ Neutral</SelectItem>
                        </SelectContent>
                      </Select>
                      {validationErrors.voiceGender && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <XCircle className="h-4 w-4" />
                          {validationErrors.voiceGender}
                        </p>
                      )}
                    </div>

                    {/* Use Case */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="voice-use-case"
                        className="text-sm font-semibold text-foreground"
                      >
                        Use Case *
                      </Label>
                      <Select
                        value={voiceUseCase}
                        onValueChange={setVoiceUseCase}
                      >
                        <SelectTrigger
                          className={`h-11 transition-all duration-200 ${
                            validationErrors.voiceUseCase
                              ? "border-red-500 focus:ring-red-500/20"
                              : "focus:ring-primary/20 hover:border-primary/50"
                          }`}
                        >
                          <SelectValue placeholder="Select use case" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="personal">🏠 Personal</SelectItem>
                          <SelectItem value="commercial">
                            💼 Commercial
                          </SelectItem>
                          <SelectItem value="educational">
                            🎓 Educational
                          </SelectItem>
                          <SelectItem value="entertainment">
                            🎭 Entertainment
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {validationErrors.voiceUseCase && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <XCircle className="h-4 w-4" />
                          {validationErrors.voiceUseCase}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover shadow-xl border-0 bg-gradient-to-br from-background via-background to-muted/20">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/20">
                      <Mic className="h-5 w-5 text-green-600" />
                    </div>
                    Clone Your Voice Professionally
                  </CardTitle>
                  <CardDescription className="text-base">
                    Record clear speech (minimum 30 seconds, up to 30 minutes) or upload audio file for professional voice cloning
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Recording Controls */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Button
                      type="button"
                      onClick={isRecording ? stopRecording : startRecording}
                      variant={isRecording ? "destructive" : "default"}
                      size="lg"
                      disabled={isUploading || isVerifying}
                      className={`relative overflow-hidden h-14 px-8 text-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                        isRecording
                          ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl"
                          : "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl"
                      }`}
                    >
                      {isRecording ? (
                        <>
                          <Square className="h-5 w-5 mr-3" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="h-5 w-5 mr-3" />
                          Start Recording
                        </>
                      )}

                      {/* Recording pulse animation */}
                      {isRecording && (
                        <div className="absolute inset-0 bg-red-500 animate-pulse opacity-20"></div>
                      )}
                    </Button>

                      {audioUrl && (
                        <div className="space-y-4">
                          <Button
                            type="button"
                            onClick={playAudio}
                            variant="outline"
                            size="lg"
                            className="h-14 px-8 text-lg font-semibold border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:scale-105"
                          >
                          {isPlaying ? (
                            <>
                              <Square className="h-5 w-5 mr-3" />
                              Stop
                            </>
                          ) : (
                            <>
                              <Play className="h-5 w-5 mr-3" />
                              {currentTime > 0 ? "Resume" : "Play Audio"}
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Microphone Status */}
                  {isMicConnected && (
                    <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-xl shadow-sm">
                      <div className="flex items-center justify-center gap-3 mb-3">
                        <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
                        <span className="text-lg font-semibold text-green-800 dark:text-green-200">
                          Microphone Connected
                        </span>
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Ready to record your voice with high-quality audio
                        capture
                      </p>
                    </div>
                  )}

                  {/* Recording Status */}
                  {isRecording && (
                    <div className="text-center p-6 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-700 rounded-xl shadow-sm">
                      <div className="flex items-center justify-center gap-3 mb-3">
                        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
                        <span className="text-lg font-semibold text-red-800 dark:text-red-200">
                          Recording Active
                        </span>
                      </div>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        Speak clearly into your microphone for best results
                      </p>
                    </div>
                  )}

                  {/* Recording Visualization */}
                  {isRecording && (
                    <div className="text-center space-y-6 p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                      {/* Audio Level Visualization */}
                      <div className="flex items-center justify-center gap-1 mb-4">
                        {Array.from({ length: 20 }, (_, i) => (
                          <div
                            key={i}
                            className={`w-2 rounded-full transition-all duration-100 ${
                              i < recordingLevel / 12.8
                                ? "bg-gradient-to-t from-red-500 to-red-400"
                                : "bg-slate-300 dark:bg-slate-600"
                            }`}
                            style={{
                              height: `${Math.max(
                                12,
                                (recordingLevel / 12.8) * 3
                              )}px`,
                            }}
                          />
                        ))}
                      </div>

                      <div className="text-4xl font-mono text-red-600 dark:text-red-400 mb-3 font-bold">
                        {formatTime(recordingTime)}
                      </div>

                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        Recording in progress... (Max 30 minutes)
                      </div>

                      {/* Recording progress bar */}
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-4 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-1000 ease-out shadow-sm"
                          style={{
                            width: `${Math.min(
                              (recordingTime / 1800) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>

                      {recordingTime >= 1700 && (
                        <div className="text-sm text-orange-600 dark:text-orange-400 animate-pulse flex items-center justify-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          Recording will stop automatically at 30 minutes
                        </div>
                      )}
                    </div>
                  )}

                  {/* Audio Ready Status */}
                  {audioBlob && (
                    <div className="text-center p-8 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700 shadow-sm">
                      <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                          <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">
                          Audio Ready
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                          <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">
                            File Size
                          </p>
                          <p className="text-lg font-bold text-slate-700 dark:text-slate-300">
                            {Math.round(audioBlob.size / 1024)} KB
                          </p>
                        </div>
                        <div className="text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                          <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">
                            Format
                          </p>
                          <p className="text-lg font-bold text-slate-700 dark:text-slate-300">
                            {audioBlob.type || "Unknown"}
                          </p>
                        </div>
                        {recordingTime > 0 && (
                          <div className="text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">
                              Duration
                            </p>
                            <p className="text-lg font-mono font-bold text-slate-700 dark:text-slate-300">
                              {formatTime(recordingTime)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Upload Button */}
                  {audioBlob && !orderId && (
                    <div className="space-y-4">
                      {recordingTime < 30 && (
                        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-300 dark:border-orange-700 rounded-lg">
                          <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                            <XCircle className="h-5 w-5" />
                            <p className="text-sm font-semibold">
                              PVC requires at least 30 seconds of audio. Current: {recordingTime}s
                            </p>
                          </div>
                          <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                            Please record {30 - recordingTime} more seconds
                          </p>
                        </div>
                      )}
                      
                      {!isFormValid() && recordingTime >= 30 && (
                        <p className="text-sm text-orange-600 dark:text-orange-400 text-center">
                          Please fill in all voice configuration fields above to enable cloning
                        </p>
                      )}
                      
                      <Button
                        type="button"
                        onClick={uploadToVoiceService}
                        disabled={isUploading || !isFormValid() || recordingTime < 30}
                        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                            Cloning Voice...
                          </>
                        ) : (
                          <>
                            <Upload className="h-5 w-5 mr-3" />
                            Clone Professional Voice
                          </>
                        )}
                      </Button>
                      
                      <Button
                        type="button"
                        onClick={resetForm}
                        variant="outline"
                        disabled={isUploading}
                        className="w-full h-12 text-base font-semibold border-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all duration-300"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reset & Start Over
                      </Button>
                    </div>
                  )}

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="space-y-4">
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                        <Progress value={uploadProgress} className="h-3" />
                      </div>
                      <p className="text-center text-sm text-slate-600 dark:text-slate-400 font-medium">
                        Uploading... {uploadProgress}%
                      </p>
                    </div>
                  )}

                  {/* File Upload Section */}
                  {!audioBlob && !isRecording && (
                    <div
                      className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer group ${
                        isDragOver
                          ? "border-primary bg-primary/5 scale-105 shadow-lg"
                          : "border-slate-300 dark:border-slate-600 hover:border-primary/50 hover:bg-primary/5 hover:scale-[1.02]"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() =>
                        document.getElementById("pvc-file-upload")?.click()
                      }
                    >
                      <div className="flex flex-col items-center space-y-4">
                        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 group-hover:from-primary/10 group-hover:to-primary/20 transition-all duration-300">
                          <Upload className="h-8 w-8 text-slate-400 group-hover:text-primary transition-colors duration-300" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-xl font-semibold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors duration-300">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            MP3, WAV, M4A, WebM, OGG up to 5MB
                          </p>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="audio/mp3,audio/wav,audio/m4a,audio/webm,audio/ogg"
                        onChange={handleFileInput}
                        className="hidden"
                        id="pvc-file-upload"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Results Section */}
              {(orderId || verificationImage) && (
                <Card className="card-hover shadow-xl border-0 bg-gradient-to-br from-background via-background to-muted/20">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/10 to-green-600/20">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                      </div>
                      Voice Clone Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {orderId && (
                      <div className="p-8 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                            <CheckCircle className="h-5 w-5 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200">
                            Voice Uploaded Successfully
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                              Voice ID
                            </p>
                            <p className="text-lg font-mono font-bold text-slate-700 dark:text-slate-300">
                              {orderId}
                            </p>
                          </div>
                          <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                              Status
                            </p>
                            <p className="text-lg font-bold text-slate-700 dark:text-slate-300">
                              {verificationStatus || "Processing..."}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Custom Verification Step */}
                    {showVerificationStep && (
                      <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                            <Shield className="h-5 w-5 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200">
                            Voice Verification Required
                          </h3>
                        </div>

                        {pvcCaptchaText && (
                          <div className="mb-6 p-6 bg-white dark:bg-slate-800 rounded-xl border-2 border-blue-300 dark:border-blue-600 shadow-sm">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 font-semibold">
                              Please read the following text clearly:
                            </p>
                            <p className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                              "{pvcCaptchaText}"
                            </p>
                          </div>
                        )}

                        <div className="space-y-6">
                          <p className="text-center text-slate-600 dark:text-slate-400">
                            Record yourself reading the text above clearly
                          </p>

                          {!isRecordingVerification &&
                            !verificationAudioBlob && (
                              <Button
                                type="button"
                                onClick={startVerificationRecording}
                                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
                              >
                                <Mic className="mr-3 h-5 w-5" />
                                Start Verification Recording
                              </Button>
                            )}

                          {isRecordingVerification && (
                            <div className="space-y-4">
                              <div className="flex items-center justify-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="text-lg font-semibold text-red-700 dark:text-red-300">
                                  Recording verification...{" "}
                                  {verificationRecordingTime}s
                                </span>
                              </div>
                              <Button
                                type="button"
                                onClick={stopVerificationRecording}
                                variant="destructive"
                                className="w-full h-12 text-lg font-semibold"
                              >
                                <Square className="mr-3 h-5 w-5" />
                                Stop Recording
                              </Button>
                            </div>
                          )}

                          {verificationAudioBlob &&
                            !isRecordingVerification && (
                              <div className="space-y-4">
                                <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                  <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle className="h-5 w-5" />
                                    <span className="font-semibold">
                                      Verification audio recorded (
                                      {verificationRecordingTime}s)
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  onClick={verifyVoice}
                                  disabled={isVerifying}
                                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                  {isVerifying ? (
                                    <>
                                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                      Verifying...
                                    </>
                                  ) : (
                                    <>
                                      <Shield className="mr-3 h-5 w-5" />
                                      Verify Voice
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}
                        </div>
                      </div>
                    )}

                    {/* Final Success */}
                    {isVerified && orderId && (
                      <div className="p-8 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                            <CheckCircle className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">
                            Voice Clone Ready!
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                              Voice ID
                            </p>
                            <p className="text-lg font-mono font-bold text-slate-700 dark:text-slate-300">
                              {orderId}
                            </p>
                          </div>
                          <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                              Status
                            </p>
                            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                              Verified and ready to use
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-center gap-2 p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-emerald-600" />
                          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                            Voice ID has been logged to console
                          </span>
                        </div>
                        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                          <Button
                            type="button"
                            onClick={() => playDemoVoice(orderId)}
                            disabled={isGeneratingDemo}
                            size="lg"
                            className="h-12 px-8 text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            {isGeneratingDemo ? (
                              <>
                                <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                                Generating Demo...
                              </>
                            ) : isDemoPlaying ? (
                              <>
                                <Square className="h-5 w-5 mr-3" />
                                Stop Demo
                              </>
                            ) : (
                              <>
                                <Play className="h-5 w-5 mr-3" />
                                Play Demo Voice
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        onClick={resetForm}
                        variant="outline"
                        className="flex-1 h-12 text-lg font-semibold border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                      >
                        Start Over
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="ivc" className="space-y-6">
              {/* IVC Description - Compact */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-700/50 shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5"></div>
                <div className="relative p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shadow-sm">
                      <Mic className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-green-900 dark:text-green-100 font-heading">
                      Instant Voice Cloning (IVC)
                    </h3>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-3 leading-relaxed">
                    Rapid voice synthesis for immediate cloning without exact
                    mimicry requirements
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span>Instant processing & results</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span>May not achieve exact mimicry</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span>Perfect for personal use & demos</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Voice Configuration Form */}
              <Card className="card-hover shadow-xl border-0 bg-gradient-to-br from-background via-background to-muted/20">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20">
                      <ImageIcon className="h-5 w-5 text-primary" />
                    </div>
                    Voice Configuration
                  </CardTitle>
                  <CardDescription className="text-base">
                    Configure your IVC voice clone settings before recording
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Voice Name */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="ivc-voice-name"
                        className="text-sm font-semibold text-foreground"
                      >
                        Voice Name *
                      </Label>
                      <Input
                        id="ivc-voice-name"
                        placeholder="Enter voice name"
                        value={voiceName}
                        onChange={(e) => setVoiceName(e.target.value)}
                        className={`h-11 transition-all duration-200 ${
                          validationErrors.voiceName
                            ? "border-red-500 focus:ring-red-500/20"
                            : "focus:ring-primary/20 hover:border-primary/50"
                        }`}
                      />
                      {validationErrors.voiceName && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <XCircle className="h-4 w-4" />
                          {validationErrors.voiceName}
                        </p>
                      )}
                    </div>

                    {/* Language */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="ivc-voice-language"
                        className="text-sm font-semibold text-foreground"
                      >
                        Language *
                      </Label>
                      <Select
                        value={voiceLanguage}
                        onValueChange={setVoiceLanguage}
                      >
                        <SelectTrigger
                          className={`h-11 transition-all duration-200 ${
                            validationErrors.voiceLanguage
                              ? "border-red-500 focus:ring-red-500/20"
                              : "focus:ring-primary/20 hover:border-primary/50"
                          }`}
                        >
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">🇺🇸 English</SelectItem>
                          <SelectItem value="es">🇪🇸 Spanish</SelectItem>
                          <SelectItem value="fr">🇫🇷 French</SelectItem>
                          <SelectItem value="de">🇩🇪 German</SelectItem>
                          <SelectItem value="it">🇮🇹 Italian</SelectItem>
                          <SelectItem value="pt">🇵🇹 Portuguese</SelectItem>
                          <SelectItem value="ru">🇷🇺 Russian</SelectItem>
                          <SelectItem value="ja">🇯🇵 Japanese</SelectItem>
                          <SelectItem value="ko">🇰🇷 Korean</SelectItem>
                          <SelectItem value="zh">🇨🇳 Chinese</SelectItem>
                        </SelectContent>
                      </Select>
                      {validationErrors.voiceLanguage && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <XCircle className="h-4 w-4" />
                          {validationErrors.voiceLanguage}
                        </p>
                      )}
                    </div>

                    {/* Accent */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="ivc-voice-accent"
                        className="text-sm font-semibold text-foreground"
                      >
                        Accent *
                      </Label>
                      <Select
                        value={voiceAccent}
                        onValueChange={setVoiceAccent}
                      >
                        <SelectTrigger
                          className={`h-11 transition-all duration-200 ${
                            validationErrors.voiceAccent
                              ? "border-red-500 focus:ring-red-500/20"
                              : "focus:ring-primary/20 hover:border-primary/50"
                          }`}
                        >
                          <SelectValue placeholder="Select accent" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="neutral">🌍 Neutral</SelectItem>
                          <SelectItem value="american">🇺🇸 American</SelectItem>
                          <SelectItem value="british">🇬🇧 British</SelectItem>
                          <SelectItem value="australian">
                            🇦🇺 Australian
                          </SelectItem>
                          <SelectItem value="canadian">🇨🇦 Canadian</SelectItem>
                        </SelectContent>
                      </Select>
                      {validationErrors.voiceAccent && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <XCircle className="h-4 w-4" />
                          {validationErrors.voiceAccent}
                        </p>
                      )}
                    </div>

                    {/* Age */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="ivc-voice-age"
                        className="text-sm font-semibold text-foreground"
                      >
                        Age *
                      </Label>
                      <Select value={voiceAge} onValueChange={setVoiceAge}>
                        <SelectTrigger
                          className={`h-11 transition-all duration-200 ${
                            validationErrors.voiceAge
                              ? "border-red-500 focus:ring-red-500/20"
                              : "focus:ring-primary/20 hover:border-primary/50"
                          }`}
                        >
                          <SelectValue placeholder="Select age" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="young">👶 Young</SelectItem>
                          <SelectItem value="middle_aged">
                            👨 Middle Aged
                          </SelectItem>
                          <SelectItem value="old">👴 Old</SelectItem>
                        </SelectContent>
                      </Select>
                      {validationErrors.voiceAge && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <XCircle className="h-4 w-4" />
                          {validationErrors.voiceAge}
                        </p>
                      )}
                    </div>

                    {/* Gender */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="ivc-voice-gender"
                        className="text-sm font-semibold text-foreground"
                      >
                        Gender *
                      </Label>
                      <Select
                        value={voiceGender}
                        onValueChange={setVoiceGender}
                      >
                        <SelectTrigger
                          className={`h-11 transition-all duration-200 ${
                            validationErrors.voiceGender
                              ? "border-red-500 focus:ring-red-500/20"
                              : "focus:ring-primary/20 hover:border-primary/50"
                          }`}
                        >
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">👨 Male</SelectItem>
                          <SelectItem value="female">👩 Female</SelectItem>
                          <SelectItem value="neutral">⚧ Neutral</SelectItem>
                        </SelectContent>
                      </Select>
                      {validationErrors.voiceGender && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <XCircle className="h-4 w-4" />
                          {validationErrors.voiceGender}
                        </p>
                      )}
                    </div>

                    {/* Use Case */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="ivc-voice-use-case"
                        className="text-sm font-semibold text-foreground"
                      >
                        Use Case *
                      </Label>
                      <Select
                        value={voiceUseCase}
                        onValueChange={setVoiceUseCase}
                      >
                        <SelectTrigger
                          className={`h-11 transition-all duration-200 ${
                            validationErrors.voiceUseCase
                              ? "border-red-500 focus:ring-red-500/20"
                              : "focus:ring-primary/20 hover:border-primary/50"
                          }`}
                        >
                          <SelectValue placeholder="Select use case" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="personal">🏠 Personal</SelectItem>
                          <SelectItem value="commercial">
                            💼 Commercial
                          </SelectItem>
                          <SelectItem value="educational">
                            🎓 Educational
                          </SelectItem>
                          <SelectItem value="entertainment">
                            🎭 Entertainment
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {validationErrors.voiceUseCase && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <XCircle className="h-4 w-4" />
                          {validationErrors.voiceUseCase}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover shadow-xl border-0 bg-gradient-to-br from-background via-background to-muted/20">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/20">
                      <Mic className="h-5 w-5 text-green-600" />
                    </div>
                    Clone Your Voice Instantly
                  </CardTitle>
                  <CardDescription className="text-base">
                    Record clear speech or upload an audio file for instant voice cloning (minimum 10 seconds, max 1 minute)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Recording Controls - Only show if not uploaded successfully */}
                  {!ivcIsVerified && (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                      <Button
                        type="button"
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={isUploading || isVerifying}
                        variant={isRecording ? "destructive" : "default"}
                        size="lg"
                        className={`relative overflow-hidden h-14 px-8 text-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                          isRecording
                            ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl"
                            : "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl"
                        }`}
                      >
                        {isRecording ? (
                          <>
                            <Square className="h-5 w-5 mr-3" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="h-5 w-5 mr-3" />
                            Start Recording
                          </>
                        )}

                        {/* Recording pulse animation */}
                        {isRecording && (
                          <div className="absolute inset-0 bg-red-500 animate-pulse opacity-20"></div>
                        )}
                      </Button>

                      {audioUrl && (
                        <div className="space-y-4">
                          <Button
                            type="button"
                            onClick={playAudio}
                            disabled={isRecording || isUploading || isVerifying}
                            variant="outline"
                            size="lg"
                            className="h-14 px-8 text-lg font-semibold border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:scale-105"
                          >
                            {isPlaying ? (
                              <>
                                <Square className="h-5 w-5 mr-3" />
                                Stop
                              </>
                            ) : (
                              <>
                                <Play className="h-5 w-5 mr-3" />
                                {currentTime > 0 ? "Resume" : "Play Audio"}
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Recording Status */}
                  {isRecording && (
                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">
                          Recording... {recordingTime}s
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full transition-all duration-100"
                          style={{ width: `${(recordingTime / 60) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Progress: {Math.round((recordingTime / 60) * 100)}% of
                        60s limit
                      </div>
                    </div>
                  )}

                  {/* Success State - Show after successful upload */}
                  {ivcIsVerified && ivcOrderId && (
                    <div className="text-center p-8 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700 shadow-sm">
                      <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                          <CheckCircle className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">
                          Voice Clone Added Successfully!
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                            Voice ID
                          </p>
                          <p className="text-lg font-mono font-bold text-slate-700 dark:text-slate-300">
                            {ivcOrderId}
                          </p>
                        </div>
                        <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                            Status
                          </p>
                          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                            Ready to use
                          </p>
                        </div>
                      </div>
                      <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                          type="button"
                          onClick={() => playDemoVoice(ivcOrderId)}
                          disabled={isGeneratingDemo}
                          size="lg"
                          className="h-12 px-8 text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          {isGeneratingDemo ? (
                            <>
                              <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                              Generating Demo...
                            </>
                          ) : isDemoPlaying ? (
                            <>
                              <Square className="h-5 w-5 mr-3" />
                              Stop Demo
                            </>
                          ) : (
                            <>
                              <Play className="h-5 w-5 mr-3" />
                              Play Demo Voice
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          onClick={() => {
                            resetIvcForm();
                          }}
                          variant="outline"
                          size="lg"
                          className="h-12 px-8 text-lg font-semibold border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                        >
                          Create Another Voice Clone
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Upload Section - Only show if not uploaded successfully */}
                  {audioBlob && !isRecording && !ivcIsVerified && (
                    <div className="space-y-6">
                      {/* Warning for insufficient recording time */}
                      {recordingTime < 10 && (
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-xl">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-400 dark:bg-yellow-600 flex items-center justify-center">
                              <span className="text-white font-bold text-sm">⚠</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                                Recording Too Short
                              </h4>
                              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                IVC requires at least 10 seconds of audio. You have recorded {recordingTime} second{recordingTime !== 1 ? 's' : ''}. 
                                Please record {10 - recordingTime} more second{(10 - recordingTime) !== 1 ? 's' : ''}.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="text-center p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                        <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                          Audio recorded: {recordingTime} seconds
                        </p>
                        
                        {!isFormValid() && recordingTime >= 10 && (
                          <p className="text-sm text-orange-600 dark:text-orange-400">
                            Please fill in all voice configuration fields above to enable cloning
                          </p>
                        )}
                        
                        <Button
                          type="button"
                          onClick={uploadToVoiceServiceIvc}
                          disabled={
                            isUploading || isVerifying || !isFormValid() || recordingTime < 10
                          }
                          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                              Cloning Voice...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-3 h-5 w-5" />
                              Clone Voice Instantly
                            </>
                          )}
                        </Button>
                        
                        <Button
                          type="button"
                          onClick={resetIvcForm}
                          variant="outline"
                          disabled={isUploading}
                          className="w-full h-12 text-base font-semibold border-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all duration-300"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reset & Start Over
                        </Button>
                      </div>

                      {isUploading && (
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm font-medium">
                            <span className="text-slate-600 dark:text-slate-400">
                              Upload Progress
                            </span>
                            <span className="text-slate-700 dark:text-slate-300">
                              {uploadProgress}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                            <Progress value={uploadProgress} className="h-3" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* File Upload Section - Only show if not uploaded successfully */}
                  {!audioBlob && !isRecording && !ivcIsVerified && (
                    <div
                      className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer group ${
                        isDragOver
                          ? "border-primary bg-primary/5 scale-105 shadow-lg"
                          : "border-slate-300 dark:border-slate-600 hover:border-primary/50 hover:bg-primary/5 hover:scale-[1.02]"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() =>
                        document.getElementById("ivc-file-upload")?.click()
                      }
                    >
                      <div className="flex flex-col items-center space-y-4">
                        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 group-hover:from-primary/10 group-hover:to-primary/20 transition-all duration-300">
                          <Upload className="h-8 w-8 text-slate-400 group-hover:text-primary transition-colors duration-300" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-xl font-semibold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors duration-300">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            MP3, WAV, M4A, WebM, OGG up to 5MB
                          </p>
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="audio/mp3,audio/wav,audio/m4a,audio/webm,audio/ogg"
                        onChange={handleFileInput}
                        className="hidden"
                        id="ivc-file-upload"
                      />
                    </div>
                  )}

                  {/* Microphone Status */}
                  {isMicConnected && (
                    <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-green-800">
                          Microphone Connected
                        </span>
                      </div>
                      <p className="text-xs text-green-600">
                        Ready to record your voice
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* IVC Results Section */}
              {(ivcOrderId || ivcVerificationImage) && (
                <Card>
                  <CardHeader>
                    <CardTitle>IVC Voice Clone Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {ivcOrderId && (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <h3 className="font-semibold text-green-800 dark:text-green-200">
                            IVC Voice Uploaded Successfully
                          </h3>
                        </div>
                        <div className="mt-2 space-y-1 text-sm text-green-700 dark:text-green-300">
                          <p>
                            <strong>Voice ID:</strong> {ivcOrderId}
                          </p>
                          <p>
                            <strong>Status:</strong> Uploaded and ready to use
                          </p>
                        </div>
                      </div>
                    )}

                    {/* IVC Final Success */}
                    {ivcIsVerified && ivcOrderId && (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <h3 className="font-semibold text-green-800 dark:text-green-200">
                            IVC Voice Clone Complete!
                          </h3>
                        </div>
                        <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
                          <p>
                            <strong>Voice ID:</strong> {ivcOrderId}
                          </p>
                          <p>
                            <strong>Status:</strong> Uploaded and ready to use
                          </p>
                          <p className="text-xs">
                            Your IVC voice clone has been added successfully!
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default VoiceClone;
