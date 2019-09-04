import { randomBytes } from 'crypto-browserify'
import { TokenSigner } from 'jsontokens'
import { getPublicKeyFromPrivate } from 'blockstack'

export const getHubInfo = async (hubUrl: string) => {
  const response = await fetch(`${hubUrl}/hub_info`)
  const data = await response.json()
  return data
}

export const getHubPrefix = async (hubUrl: string) => {
  const { read_url_prefix } = await getHubInfo(hubUrl)
  return read_url_prefix
}

export const makeGaiaAssociationToken = (secretKeyHex: string, childPublicKeyHex: string ) => {
  const LIFETIME_SECONDS = 365 * 24 * 3600
  const signerKeyHex = secretKeyHex.slice(0, 64)
  const compressedPublicKeyHex = getPublicKeyFromPrivate(signerKeyHex)
  const salt = randomBytes(16).toString('hex')
  const payload = {
    childToAssociate: childPublicKeyHex,
    iss: compressedPublicKeyHex,
    exp: LIFETIME_SECONDS + (new Date().getTime() / 1000),
    iat: Date.now() / 1000,
    salt
  }

  const token = new TokenSigner('ES256K', signerKeyHex).sign(payload)
  return token
}
