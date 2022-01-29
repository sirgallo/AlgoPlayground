import { IWebScrape } from '../Misc/WebScrapeProvider'

export const configs: IWebScrape[] = [
  /*
  {
    url: 'https://www.anandtech.com',
    selectors: [
      {
        text: 'cont_box1',
        type: 'class'
      }
    ],
    paginateOpts: {
      paginateFunc: (baseurl, page, perPage) => { 
        return `${baseurl}/Page/${page}` 
      }
    }
  },
  */
  {
    url: 'https://www.astm.org',
    selectors: [
      {
        text: 'up-date',
        type: 'class'
      }
    ],
    paginateOpts: {
      paginateFunc: (baseurl, page, perPage) => { 
        return `${baseurl}/catalogsearch/result/index/?p=${page}&q=standards` 
      },
      startPage: 1
    }
  }
];