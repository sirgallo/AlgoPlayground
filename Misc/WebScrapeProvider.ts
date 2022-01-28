import puppeteer from 'puppeteer'

export interface IWebScrape {
  url: string
  selectors: ISelectors[]
}

interface ISelectors {
  text: string
  type: 'class' | 'element'
}

export class WebScrapeProvider {
  constructor(private configs: IWebScrape[]) {}

  async runMultiUrl() {
    const allResults = []
    for(const config of this.configs) {
      console.log(config.selectors)
      allResults.push(
        await this.runHeadlessChrome(config.url, config.selectors)
      )
    }

    return allResults
  }

  private async runHeadlessChrome(url: string, selectors: ISelectors[]): Promise<any[]> {

    console.log('hi', selectors)
    const browser = await puppeteer.launch({ 
      args: ['--no-sandbox', '--disable-setuid-sandbox'], 
      headless: true
    })

    const page = await browser.newPage()
    await page.goto(url)
    const elements = await page.evaluate( selectors => {

      const validateSelector = (selector: ISelectors) => selector.type === 'class' ? `.${selector.text}` : `#${selector.text}`
      const res = []

      for(const selector of selectors) {
        console.log()
        const elem = document.querySelectorAll(validateSelector(selector))
        elem.forEach( item => {
          res.push({
            url:  item.getAttribute('href'),
            text: item.innerHTML
          })
        })
      }

      return res
    }, selectors as any)
    await browser.close()

    return elements
  }
}