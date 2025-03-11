"use client"

import { useState, useEffect, useCallback } from "react"
import { ethers } from "ethers"

export function useWallet() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Base chain ID
  const BASE_CHAIN_ID = 8453
  const BASE_TESTNET_CHAIN_ID = 84531

  // Initialize provider from window.ethereum
  const initProvider = useCallback(async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        setProvider(provider)
        return provider
      } catch (err) {
        console.error("Failed to create provider:", err)
        setError("Failed to initialize provider")
        return null
      }
    }
    return null
  }, [])

  // Connect wallet
  const connect = useCallback(async () => {
    setIsConnecting(true)
    setError(null)

    try {
      const provider = await initProvider()
      if (!provider) {
        throw new Error("No provider available")
      }

      // Request account access
      await provider.send("eth_requestAccounts", [])

      const signer = provider.getSigner()
      const address = await signer.getAddress()
      const { chainId } = await provider.getNetwork()

      setSigner(signer)
      setAddress(address)
      setChainId(chainId)

      return { provider, signer, address, chainId }
    } catch (err) {
      console.error("Error connecting wallet:", err)
      setError("Failed to connect wallet")
      return null
    } finally {
      setIsConnecting(false)
    }
  }, [initProvider])

  // Switch to Base network
  const switchToBase = useCallback(
    async (testnet = false) => {
      if (!provider) return false

      const targetChainId = testnet ? BASE_TESTNET_CHAIN_ID : BASE_CHAIN_ID
      const chainIdHex = `0x${targetChainId.toString(16)}`

      try {
        await provider.send("wallet_switchEthereumChain", [{ chainId: chainIdHex }])
        return true
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            await provider.send("wallet_addEthereumChain", [
              {
                chainId: chainIdHex,
                chainName: testnet ? "Base Goerli Testnet" : "Base Mainnet",
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: [testnet ? "https://goerli.base.org" : "https://mainnet.base.org"],
                blockExplorerUrls: [testnet ? "https://goerli.basescan.org" : "https://basescan.org"],
              },
            ])
            return true
          } catch (addError) {
            console.error("Error adding Base network:", addError)
            setError("Failed to add Base network")
            return false
          }
        }
        console.error("Error switching to Base network:", switchError)
        setError("Failed to switch to Base network")
        return false
      }
    },
    [provider],
  )

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setSigner(null)
    setAddress(null)
    setChainId(null)
  }, [])

  // Listen for account and chain changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          disconnect()
        } else if (accounts[0] !== address) {
          // Account changed
          connect()
        }
      }

      const handleChainChanged = () => {
        // Chain changed, refresh provider
        window.location.reload()
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [address, connect, disconnect])

  return {
    provider,
    signer,
    address,
    chainId,
    isConnecting,
    error,
    connect,
    disconnect,
    switchToBase,
    isBase: chainId === BASE_CHAIN_ID || chainId === BASE_TESTNET_CHAIN_ID,
  }
}

