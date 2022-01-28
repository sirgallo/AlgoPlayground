import puppeteer from 'puppeteer'

export interface IWebScrape {
  url: string
  selectors: ISelector[]
  paginate?(baseUrl: string, page: number, perPage: number): string
  perPage?: number
}

export interface IReturnPaginatedHtml {
  allPaginatedResults: IReturnHtml[][]
  errorStack: any[]
}

export interface IReturnHtml {
  innerHtml: string
}

interface ISelector {
  text: string
  type: 'class' | 'element'
}

interface IBrowser {
  browser: puppeteer.Browser
  page: puppeteer.Page
}

export class WebScrapeProvider {
  constructor(private configs: IWebScrape[]) {}

  async runMultiUrl() {
    const allResults = []
    const _browser = await this.runHeadless()
    for(const config of this.configs) {
      if(config.paginate) allResults.push(await this.headlessPaginate(_browser, config))
      else allResults.push(await this.scrapePage(_browser, config.url, config.selectors))
    }
    _browser.browser.close()

    return allResults
  }

  private async runHeadless(): Promise<{ browser: puppeteer.Browser, page: puppeteer.Page }> {
    const browser = await puppeteer.launch({ 
      args: ['--no-sandbox', '--disable-setuid-sandbox'], 
      headless: true
    })
    const page = await browser.newPage()

    return { browser, page }
  }

  private async headlessPaginate(_browser: IBrowser, config: IWebScrape): Promise<IReturnPaginatedHtml> {
    const resp = {
      allPaginatedResults: [],
      errorStack: []
    }
    
    let pageNext = true
    let page = 1
    while(pageNext) {
      try {
        console.log(`Attempting page ${page}...`)
        console.log(`Next page url: ${config.paginate ? config.paginate(config.url, page, config.perPage) : 'ended' }`)
        const returnHtmlList = await this.scrapePage(_browser, config.paginate(config.url, page, config.perPage), config.selectors)
        console.log(returnHtmlList)
        returnHtmlList.length > 0 ? resp.allPaginatedResults.push() : pageNext = false
        ++page
      } catch (err) {
        console.log('Could be end?', err)
        pageNext = false
        resp.errorStack.push(err)
      }
    }

    return resp
  }

  private async scrapePage(_browser: IBrowser, url: string, selectors: ISelector[]): Promise<IReturnHtml[]> {
    try {
      const page = _browser.page
      await page.goto(url)
      const elements: IReturnHtml[] = await page.evaluate( selectors => {

        const validateSelector = (selector: ISelector) => selector.type === 'class' ? `.${selector.text}` : `#${selector.text}`
        const res = []

        for(const selector of selectors) {
          console.log()
          const elem = document.querySelectorAll(validateSelector(selector))
          elem.forEach( item => {
            res.push({
              innnerHtml: item.innerHTML
            })
          })
        }

        return res
      }, selectors as any)

      console.log('hi, res', elements ? elements : 'no res')

      return elements
    } catch (err) { throw err }
  }
}