import { useState, useEffect, useRef, useCallback } from 'react'

interface UseWebSocketOptions {
  url: string
  onMessage?: (data: any) => void
  onOpen?: () => void
  onClose?: (event: CloseEvent) => void
  onError?: (error: Event) => void
  reconnectInterval?: number
  maxReconnectAttempts?: number
}

interface UseWebSocketReturn {
  isConnected: boolean
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error'
  sendMessage: (data: any) => void
  connect: () => void
  disconnect: () => void
  lastMessage: any
}

export function useWebSocket({
  url,
  onMessage,
  onOpen,
  onClose,
  onError,
  reconnectInterval = 3000,
  maxReconnectAttempts = 5
}: UseWebSocketOptions): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected')
  const [lastMessage, setLastMessage] = useState<any>(null)
  
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    setConnectionStatus('connecting')
    reconnectAttemptsRef.current = 0
    
    try {
      wsRef.current = new WebSocket(url)
      
      wsRef.current.onopen = () => {
        console.log('✅ WebSocket connected')
        setIsConnected(true)
        setConnectionStatus('connected')
        reconnectAttemptsRef.current = 0
        onOpen?.()
      }
      
      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          setLastMessage(data)
          onMessage?.(data)
        } catch (error) {
          console.error('❌ Failed to parse WebSocket message:', error)
          setLastMessage(event.data)
          onMessage?.(event.data)
        }
      }
      
      wsRef.current.onclose = (event) => {
        console.log('❌ WebSocket disconnected:', event.code, event.reason)
        setIsConnected(false)
        setConnectionStatus('disconnected')
        onClose?.(event)
        
        // Auto-reconnect logic
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++
          console.log(`🔄 Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`)
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, reconnectInterval)
        }
      }
      
      wsRef.current.onerror = (error) => {
        console.error('❌ WebSocket error:', error)
        setConnectionStatus('error')
        onError?.(error)
      }
    } catch (error) {
      console.error('❌ Failed to create WebSocket:', error)
      setConnectionStatus('error')
    }
  }, [url, onMessage, onOpen, onClose, onError, reconnectInterval, maxReconnectAttempts])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'User disconnected')
    }
    
    setIsConnected(false)
    setConnectionStatus('disconnected')
    reconnectAttemptsRef.current = 0
  }, [])

  const sendMessage = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message = typeof data === 'string' ? data : JSON.stringify(data)
      wsRef.current.send(message)
    } else {
      console.warn('⚠️ WebSocket is not connected. Cannot send message.')
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    isConnected,
    connectionStatus,
    sendMessage,
    connect,
    disconnect,
    lastMessage
  }
}
