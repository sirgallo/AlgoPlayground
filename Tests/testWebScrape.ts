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
    paginate: (baseurl, page, perPage) => { 
      return `${baseurl}/Page/${page}` 
    }
  }
  */
  {
    url: 'https://www.astm.org',
    selectors: [
      {
        text: 'product-item',
        type: 'class'
      }
    ],
    paginateOpts: {
      paginateFunc: (baseurl, page, perPage) => { 
        return `${baseurl}/catalogsearch/result/index/?p=${page}&q=standards` 
      },
      startPage: 1,
      endPage: 5
    }
  }
];