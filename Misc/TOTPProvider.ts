import totp from 'totp-generator'

interface ITOTPOpts {
  period?: number | undefined
  algorithm?: string | undefined
  digits?: number | undefined
  timestamp?: number | undefined
}

export class TOTPProvider {
  constructor(private key: string, private opts: ITOTPOpts) {}

  generateOnInterval(interval: number) {
    setInterval(() => {
      try {
        const token: number = this.totpGen()
        console.log(`Token: ${token}`)
      } catch (err) { console.log(`Error: ${err}`) }
    }, interval)
  }

  totpGen(): number {
    try {
      const token: number = totp(this.key, this.opts)
      return token
    } catch (err) { throw err }
  }
}