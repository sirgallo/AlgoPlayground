import puppeteer from 'puppeteer'

export interface IWebScrape {
  url: string
  selectors: ISelector[]
  paginateOpts?: {
    paginateFunc(baseUrl: string, page: number, perPage?: number): string
    perPage?: number
    startPage?: number
    endPage?: number
  }
}

export interface IReturnPaginatedHtml {
  allPaginatedResults: IPaginateResults[]
  errorStack: any[]
}

export interface IReturnHtml {
  innerHtml: any
}

interface IPaginateResults {
  url: string
  htmlList: IReturnHtml[]
}

interface ISelector {
  text: string
  type: string
}

interface IBrowser {
  browser: puppeteer.Browser
  page: puppeteer.Page
}

export class WebScrapeProvider {
  constructor(private configs: IWebScrape[], private headless: boolean = true) {}

  getConfigs() {
    return this.configs
  }

  async runMultiUrl() {
    const allResults = []
    const _browser = await this.runHeadless()

    for(const config of this.configs) {
      if(config.paginateOpts) allResults.push(await this.headlessPaginate(_browser, config))
      else allResults.push(await this.scrapePage(_browser, config.url, config.selectors))
    }

    _browser.browser.close()
    return allResults
  }

  private async runHeadless(): Promise<{ browser: puppeteer.Browser, page: puppeteer.Page }> {
    const browser = await puppeteer.launch({ 
      args: ['--no-sandbox', '--disable-setuid-sandbox'], 
      headless: this.headless
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
    try {
      console.log('Navigating to base url...', config.url)
      await _browser.page.goto(config.url)
      console.log('Beginning pagination...')
      while(config.paginateOpts.endPage? config.paginateOpts.endPage >= page : pageNext) {
        const formattedPath = config.paginateOpts.paginateFunc(config.url, page, config.paginateOpts.perPage)

        console.log(`Attempting page ${page}...`)
        console.log(`Next page url: ${pageNext ? formattedPath : 'ended' }`)
        const returnHtmlList: IReturnHtml[] = await this.scrapePage(_browser, formattedPath, config.selectors)
        
        if (returnHtmlList.length > 0) { 
          resp.allPaginatedResults.push({
            url: formattedPath,
            htmlList: returnHtmlList
          })

        } else pageNext = false
        
        ++page
      }
    } catch (err) {
      console.log('Could be end?', err)
      pageNext = false
      resp.errorStack.push(err)
    }

    return resp
  }

  private async scrapePage(_browser: IBrowser, url: string, selectors: ISelector[]): Promise<IReturnHtml[]> {
    try {
      await _browser.page.goto(url)
      const elements: IReturnHtml[] = await _browser.page.evaluate( selectors => {
        const validateSelector = (selector: ISelector): string => selector.type === 'class' ? `.${selector.text}` : `#${selector.text}`
        const res = []

        for(const selector of selectors) {
          const elem = document.querySelectorAll(validateSelector(selector))
          elem.forEach( item => {
            res.push({
              innerHtml: item.innerHTML
            })
          })
        }

        return res
      }, selectors as any)

      return elements
    } catch (err) { throw err }
  }
}