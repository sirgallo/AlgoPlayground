import * as OTPAUTH from 'otpauth'

interface IOTPAuth {
  issuer?: string
  label?: string
  algorithm?: string
  digits?: number
  period?: number
  secret?: string | OTPAUTH.Secret
}

export class OTPAuthProvider {
  private totp: OTPAUTH.TOTP
  private currentToken: string
  constructor(opts: IOTPAuth) {
    this.totp = new OTPAUTH.TOTP(opts)
  }

  generateOnInterval(interval: number) {
    this.setToken()
    setInterval(() => {
      try { 
        this.setToken() 
      } catch (err) { console.log(`Error: ${err}`) }
    }, interval)
  }

  private setToken() {
    const token: string = this.generateToken()
    if (token !== this.currentToken) { 
      this.currentToken = token
      console.log(`Token: ${this.currentToken}`)
    }
  }

  private generateToken(): string {
    return this.totp.generate()
  }
}

const testOptsOTPAuth: IOTPAuth = {
  issuer: 'Nick',
  label: 'Test',
  algorithm: 'SHA256',
  digits: 6,
  period: 30,
  secret: 'HELLOWORLD'
}

const secToMs = (sec: number): number => sec * 1000

new OTPAuthProvider(testOptsOTPAuth)
  .generateOnInterval(secToMs(30))